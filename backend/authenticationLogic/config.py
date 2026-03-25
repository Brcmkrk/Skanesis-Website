import json
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Try to get credentials from environment variable first (for Render/Cloud)
firebase_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT")

if firebase_json:
    # Use environment variable
    cred_dict = json.loads(firebase_json)
    cred = credentials.Certificate(cred_dict)
else:
    # Fallback to local file
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    CRED_PATH = os.path.join(BASE_DIR, "jsons", "skanesis-database-firebase-adminsdk-fbsvc-636734c58e.json")
    if os.path.exists(CRED_PATH):
        cred = credentials.Certificate(CRED_PATH)
    else:
        raise RuntimeError("Firebase credentials not found in env or file!")

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

