import os
from dotenv import load_dotenv

load_dotenv(".env")


class Config:
    SECRET_KEY = os.environ.get("APP_SECRET_KEY")
    DEBUG = False
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
