import random
from datetime import datetime, timezone, timedelta

from flask import Blueprint, request, jsonify
from backend.authenticationLogic.createAdmin import create_admin
from backend.authenticationLogic.createUser import create_user, validate_email, validate_password
from backend.authenticationLogic.authentication import Auth
from backend.authenticationLogic.config import db

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

ERROR_MESSAGES = {
    1: "An account with this email already exists.",
    2: "Invalid email format.",
    3: (
        "Password must be 8–24 characters and include at least one "
        "uppercase letter, one lowercase letter, one digit, and one "
        "special character."
    ),
    4: "Username is invalid or already taken.",
    5: "An internal server error occurred. Please try again later.",
}


def _build_response(code: int):
    """Convert a logic return code into a JSON HTTP response."""
    if code == 0:
        return jsonify({"success": True, "message": "Account created successfully."}), 201

    message = ERROR_MESSAGES.get(code, "Unknown error.")

    # Map logic codes → HTTP status codes
    http_status = {
        1: 409,  # Conflict  – email taken
        2: 422,  # Unprocessable – bad email
        3: 422,  # Unprocessable – bad password
        4: 409,  # Conflict  – username taken / empty
        5: 500,  # Internal server error
    }.get(code, 400)

    return jsonify({"success": False, "message": message, "code": code}), http_status


def _extract_fields(body: dict):
    """Pull and lightly validate that the three required fields are present."""
    username = body.get("username", "").strip()
    email    = body.get("email", "").strip()
    password = body.get("password", "")

    missing = [f for f, v in (("username", username), ("email", email), ("password", password)) if not v]
    return username, email, password, missing

def _extract_login_fields(body: dict):
    """Pull and lightly validate username and password for login."""
    username = body.get("username", "").strip()
    password = body.get("password", "")

    missing = [f for f, v in (("username", username), ("password", password)) if not v]
    return username, password, missing


# ── POST /api/auth/register/admin ───────────────────────────────────────────
@auth_bp.route("/register/admin", methods=["POST"])
def register_admin():
    """
    Register a new admin account.

    Request body (JSON):
        { "username": "...", "email": "...", "password": "..." }

    Returns:
        201  { success: true,  message: "Account created successfully." }
        409  { success: false, message: "...", code: 1|4 }
        422  { success: false, message: "...", code: 2|3 }
        500  { success: false, message: "...", code: 5 }
    """
    body = request.get_json(silent=True) or {}
    username, email, password, missing = _extract_fields(body)

    if missing:
        return (
            jsonify({"success": False, "message": f"Missing fields: {', '.join(missing)}."}),
            400,
        )

    code = create_admin(username, email, password)
    return _build_response(code)


# ── POST /api/auth/request_verification ─────────────────────────────────────
@auth_bp.route("/request_verification", methods=["POST"])
def request_verification():
    body = request.get_json(silent=True) or {}
    username, email, password, missing = _extract_fields(body)

    if missing:
        return (
            jsonify({"success": False, "message": f"Missing fields: {', '.join(missing)}."}),
            400,
        )

    # Validate email format
    if not validate_email(email):
        return _build_response(2)

    # Validate password format
    if not validate_password(password):
        return _build_response(3)

    # Validate email existence
    users_with_email = list(db.collection("accounts").where("email", "==", email).stream())
    if users_with_email:
        return _build_response(1) # Email exists

    # Validate username
    users_with_username = list(db.collection("accounts").where("username", "==", username).stream())
    if users_with_username:
        return _build_response(4) # Username exists

    # Generate and save verification code
    code = str(random.randint(100000, 999999))
    expiration = datetime.now(timezone.utc) + timedelta(minutes=5)
    
    db.collection("email_verifications").document(email).set({
        "username": username,
        "email": email,
        "code": code,
        "expires_at": expiration
    })

    # Send email
    try:
        from authenticationLogic.emailService import EmailService
        email_service = EmailService()
        email_service.send_verification_code(email, code)
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({"success": False, "message": "Failed to send verification email.", "code": 5}), 500

    return jsonify({"success": True, "message": "Verification code sent to email."}), 200

# ── POST /api/auth/register/user ────────────────────────────────────────────
@auth_bp.route("/register/user", methods=["POST"])
def register_user():
    """
    Register a new user account.

    Request body (JSON):
        { "username": "...", "email": "...", "password": "...", "verificationCode": "123456" }

    Returns:
        201  { success: true,  message: "Account created successfully." }
        409  { success: false, message: "...", code: 1|4 }
        422  { success: false, message: "...", code: 2|3 }
        500  { success: false, message: "...", code: 5 }
    """
    body = request.get_json(silent=True) or {}
    username, email, password, missing = _extract_fields(body)
    verification_code = body.get("verificationCode", "").strip()

    if missing or not verification_code:
        return (
            jsonify({"success": False, "message": "Missing required fields or verification code."}),
            400,
        )

    # Validate verification code
    veri_doc = db.collection("email_verifications").document(email).get()
    if not veri_doc.exists:
        return jsonify({"success": False, "message": "No verification request found for this email.", "code": 6}), 400
    
    veri_data = veri_doc.to_dict()
    if veri_data.get("code") != verification_code:
        return jsonify({"success": False, "message": "Invalid verification code.", "code": 7}), 400
        
    expires_at = veri_data.get("expires_at")
    if expires_at:
        from google.api_core.datetime_helpers import DatetimeWithNanoseconds
        if isinstance(expires_at, DatetimeWithNanoseconds) or isinstance(expires_at, datetime):
            if datetime.now(timezone.utc) > expires_at:
                return jsonify({"success": False, "message": "Verification code expired.", "code": 8}), 400

    # Code is valid, delete verification document
    db.collection("email_verifications").document(email).delete()

    code = create_user(username, email, password, "regular")
    return _build_response(code)

# ── POST /api/auth/login/user (Unified Login with Role Support) ─────────────
@auth_bp.route("/login/user", methods=["POST"])
def login_user():
    """
    Login a user or admin account.
    
    Request body (JSON):
        { "username": "...", "password": "..." }

    Returns:
        200  { success: true,  message: "Login successful.", role: "user|admin", username: "..." }
        401  { success: false, message: "Invalid username or password.", code: ... }
    """
    body = request.get_json(silent=True) or {}
    username, password, missing = _extract_login_fields(body)

    if missing:
        return (
            jsonify({"success": False, "message": f"Missing fields: {', '.join(missing)}."}),
            400,
        )

    auth_instance = Auth(username, password)
    code = auth_instance.login_user()

    # If code is 0, it's a regular user success
    if code == 0:
        sub_type = auth_instance.user_data.get("type", "regular") if auth_instance.user_data else "regular"
        return jsonify({
            "success": True, 
            "message": "Login successful.", 
            "username": username, 
            "role": "user",
            "subscription_type": sub_type
        }), 200

    # If code is 3, it's a role mismatch (could be an admin)
    if code == 3:
        # Try logging in as Admin
        admin_code = auth_instance.login_admin()
        if admin_code == 0:
            sub_type = auth_instance.user_data.get("type", "regular") if auth_instance.user_data else "regular"
            return jsonify({
                "success": True, 
                "message": "Login successful.", 
                "username": username, 
                "role": "admin",
                "subscription_type": sub_type
            }), 200
        # If admin_code is also 3, or anything else, fall through to error handling
        code = admin_code

    # Map authentication errors (1: not found, 2: wrong pass, 3: role mismatch)
    error_msg = "Invalid username or password."
    if code == 3:
        error_msg = "Account role mismatch."

    return jsonify({"success": False, "message": error_msg, "code": code}), 401

@auth_bp.route("/update_subscription", methods=["POST"])
def update_subscription():
    data = request.json
    username = data.get("username")
    new_type = data.get("new_type")

    if not username or not new_type:
        return jsonify({"success": False, "message": "Username and new_type are required"}), 400

    users_ref = db.collection("accounts").where("username", "==", username).stream()
    user_docs = list(users_ref)

    if not user_docs:
        return jsonify({"success": False, "message": "User not found"}), 404

    doc_id = user_docs[0].id
    from firebase_admin import firestore
    
    update_data = {"type": new_type}
    
    if new_type == "premium":
        update_data["remaining_ai"] = 5
        update_data["remaining_scans"] = firestore.DELETE_FIELD
    elif new_type in ("premium plus", "premium_plus"):
        update_data["remaining_ai"] = firestore.DELETE_FIELD
        update_data["remaining_scans"] = firestore.DELETE_FIELD
    elif new_type == "regular":
        update_data["remaining_scans"] = 5
        update_data["remaining_ai"] = firestore.DELETE_FIELD
        
    db.collection("accounts").document(doc_id).update(update_data)

    return jsonify({"success": True, "message": "Subscription updated successfully", "subscription_type": new_type}), 200
