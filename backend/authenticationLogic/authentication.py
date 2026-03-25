import bcrypt
from authenticationLogic.config import db


class Auth:

    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.user_data = None

    def login_admin(self):
        users_ref = db.collection("accounts")
        query = users_ref.where("username", "==", self.username).stream()

        for user in query:
            user_data = user.to_dict()
            stored_password = user_data["password"].encode('utf-8')
            if user_data["role"] == "user":
                print("Role is mismatched")
                return 3

            if bcrypt.checkpw(self.password.encode('utf-8'), stored_password):
                print("Authentication successful")
                self.user_data = user_data
                return 0
            else:
                print("Password is wrong")
                return 2

        print("No username matched")
        return 1
    
    def login_user(self):
        users_ref = db.collection("accounts")
        query = users_ref.where("username", "==", self.username).stream()

        for user in query:
            user_data = user.to_dict()
            stored_password = user_data["password"].encode('utf-8')
            if user_data["role"] == "admin":
                print("Role is mismatched")
                return 3
            
            if bcrypt.checkpw(self.password.encode('utf-8'), stored_password):
                print("Authentication successful")
                self.user_data = user_data
                return 0
            else:
                print("Password is wrong")
                return 2
            
        print("No username matched")
        return 1

    def get_account_profile(self):
        users_ref = db.collection("accounts")
        query = users_ref.where("username", "==", self.username).stream()

        for user in query:
            user_data = user.to_dict() or {}
            return {
                "username": user_data.get("username", self.username),
                "role": user_data.get("role", ""),
                "type": user_data.get("type", ""),
                "ai_scan_enabled": user_data.get("ai_scan_enabled"),
                "created_by_admin": user_data.get("created_by_admin"),
            }

        return {
            "username": self.username,
            "role": "",
            "type": "",
            "ai_scan_enabled": None,
            "created_by_admin": None,
        }
