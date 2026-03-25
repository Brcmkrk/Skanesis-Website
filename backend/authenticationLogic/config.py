import firebase_admin
from firebase_admin import credentials, firestore
import os

# Get absolute path to the project root directory (two levels up from config.py)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CRED_PATH = os.path.join(BASE_DIR, "jsons", "skanesis-database-firebase-adminsdk-fbsvc-636734c58e.json")

cred = credentials.Certificate(CRED_PATH)

firebase_admin.initialize_app(cred)

db = firestore.client()

