from dotenv import load_dotenv,find_dotenv
import os

load_dotenv(find_dotenv())

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
S3_URL = os.getenv("S3_URL")
