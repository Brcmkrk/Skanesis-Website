import bcrypt
import secrets
import re
from datetime import datetime, timedelta, timezone
from firebase_admin import firestore
from authenticationLogic.config import db


class PasswordResetService:

    def __init__(self, email_service):
        self.email_service = email_service

    def request_reset(self, username):

        username = username.strip()

        user_doc = self._get_user(username)
        if not user_doc:
            return 1  

        user_data = user_doc.to_dict()
        email = user_data["email"]

        plain_code = str(secrets.randbelow(900000) + 100000)

        hashed_code = bcrypt.hashpw(
            plain_code.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        expiration = datetime.now(timezone.utc) + timedelta(minutes=10)

        user_doc.reference.update({
            "reset_code": hashed_code,
            "reset_expiration": expiration
        })

        self.email_service.send_reset_email(email, plain_code)

        return 0  

    def confirm_reset(self, username, code, new_password):

        username = username.strip()

        user_doc = self._get_user(username)
        if not user_doc:
            return 1 

        user_data = user_doc.to_dict()

        stored_hash = user_data.get("reset_code")
        expiration = user_data.get("reset_expiration")

        if not stored_hash or not expiration:
            return 2  

        if datetime.now(timezone.utc) > expiration:
            return 3  

        if not bcrypt.checkpw(
            code.encode("utf-8"),
            stored_hash.encode("utf-8")
        ):
            return 4 

        if not self._validate_password(new_password):
            return 5 

        old_password_hash = user_data["password"]

        if bcrypt.checkpw(
            new_password.encode("utf-8"),
            old_password_hash.encode("utf-8")
        ):
            return 6  

        new_hashed_password = bcrypt.hashpw(
            new_password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        user_doc.reference.update({
            "password": new_hashed_password,
            "reset_code": firestore.DELETE_FIELD,
            "reset_expiration": firestore.DELETE_FIELD
        })

        return 0  

    def _get_user(self, username):
        query = db.collection("accounts").where("username", "==", username).stream()
        for doc in query:
            return doc
        return None

    def _validate_password(self, password):

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