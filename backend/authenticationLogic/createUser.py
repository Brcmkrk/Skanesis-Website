import re
import bcrypt
from authenticationLogic.config import db


def create_user(username, email, password, type):

    username = username.strip()
    email = email.strip().lower()

    accounts_ref = db.collection("accounts")

    if not username:
        return 4

    if any(accounts_ref.where("username", "==", username).stream()):
        return 4

    if not validate_email(email):
        return 2

    if any(accounts_ref.where("email", "==", email).stream()):
        return 1

    if not validate_password(password):
        return 3

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    if type == "regular":
        data = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "role": "user",
            "type": type,
            "created_by_admin": None
        }
    elif type == "premium":
        data = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "role": "user",
            "type": type,
            "created_by_admin": None
        }
    else:
        data = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "role": "user",
            "type": type,
            "created_by_admin": None
        }

    try:
        accounts_ref.add(data)
        return 0
    except Exception:
        return 5
    
def validate_email(email):
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return re.match(pattern, email) is not None


def validate_password(password):

    if len(password) < 8 or len(password) > 24:
        return False

    if not re.search(r"[A-Z]", password):
        return False

    if not re.search(r"[a-z]", password):
        return False

    if not re.search(r"[0-9]", password):
        return False

    if not re.search(r"[^\w\s]", password):
        return False

    return True