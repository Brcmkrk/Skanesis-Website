import os

from flask import Flask
from flask_cors import CORS
from backend.auth import auth_bp

def create_app():
    # Configure static folder pointing to the React build path
    static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../frontend/build'))
    app = Flask(__name__, static_folder=static_dir, static_url_path='/')
    CORS(app)
    app.register_blueprint(auth_bp)
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if not os.path.exists(app.static_folder):
            return "Backend is running. Frontend build not found.", 200
            
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return app.send_static_file(path)
        
        index_path = os.path.join(app.static_folder, 'index.html')
        if os.path.exists(index_path):
            return app.send_static_file('index.html')
        return "Backend is running. index.html not found.", 200
        
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", debug=True, port=5000)