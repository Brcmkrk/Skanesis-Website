import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask
from flask_cors import CORS
from auth import auth_bp

def create_app():
    # Configure static folder pointing to the React build path
    static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../frontend/build'))
    app = Flask(__name__, static_folder=static_dir, static_url_path='/')
    CORS(app)
    app.register_blueprint(auth_bp)
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return app.send_static_file(path)
        return app.send_static_file('index.html')
        
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", debug=True, port=5000)