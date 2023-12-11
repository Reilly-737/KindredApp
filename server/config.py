# Standard library imports
from flask_session import Session
# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os
load_dotenv()
# Local imports
import secrets
# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["SQLALCHEMY_ECHO"] = True
app.json.compact = False
app.secret_key = os.environ.get("SECRET_KEY")

import secrets

db = SQLAlchemy(app)


# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)