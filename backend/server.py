from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv()

from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.files import files_bp
from routes.catalogue_songs import catalogue_songs_bp

app = Flask(__name__)
CORS(app)
app.register_blueprint(auth_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(files_bp)
app.register_blueprint(catalogue_songs_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)
