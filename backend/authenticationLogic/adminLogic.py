import re
import bcrypt
from backend.authenticationLogic.config import db
from backend.authenticationLogic.emailService import EmailService


class AdminUserService:

    def __init__(self, admin_username):
        self.admin_username = admin_username
        self.accounts_ref = db.collection("accounts")
        self.email_service = EmailService()

    def create_user(self, username, email):

        username = username.strip()
        email = email.strip().lower()

        if not username:
            return 4

        if any(self.accounts_ref.where("username", "==", username).stream()):
            return 4

        if not self.validate_email(email):
            return 2

        if any(self.accounts_ref.where("email", "==", email).stream()):
            return 1

        temp_password = self._generate_temp_password()

        hashed_password = bcrypt.hashpw(
            temp_password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        data = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "role": "user",
            "created_by_admin": self.admin_username
        }

        try:
            self.accounts_ref.add(data)

            self.email_service.send_temp_password_email(
                receiver_email=email,
                username=username,
                temp_password=temp_password
            )

            return 0

        except Exception:
            return 5

    def delete_user(self, username):

        query = self.accounts_ref.where("username", "==", username).stream()

        for doc in query:
            data = doc.to_dict()

            if data.get("created_by_admin") != self.admin_username:
                return 2 

            email = data["email"]

            doc.reference.delete()

            self.email_service.send_deletion_email(email, username)

            return 0

        return 1  

    def get_my_users(self):

        query = self.accounts_ref.where(
            "created_by_admin", "==", self.admin_username
        ).stream()

        users = []

        for doc in query:
            data = doc.to_dict()

            users.append({
                "username": data.get("username"),
                "email": data.get("email"),
                "role": data.get("role"),
                "type": data.get("type", ""),
                "ai_scan_enabled": data.get("ai_scan_enabled"),
                "created_by_admin": data.get("created_by_admin")
            })

        return users

    def _generate_temp_password(self, length=12):

        if length < 8:
            length = 8
        if length > 24:
            length = 24

        import string
        import secrets
        import random

        lowercase = string.ascii_lowercase
        uppercase = string.ascii_uppercase
        digits = string.digits
        special = "!@#$%^&*"

        password_chars = [
            secrets.choice(lowercase),
            secrets.choice(uppercase),
            secrets.choice(digits),
            secrets.choice(special),
        ]

        all_characters = lowercase + uppercase + digits + special

        for _ in range(length - 4):
            password_chars.append(secrets.choice(all_characters))

        random.SystemRandom().shuffle(password_chars)

        return ''.join(password_chars)

    def validate_email(self, email):
        pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        return re.match(pattern, email) is not None

