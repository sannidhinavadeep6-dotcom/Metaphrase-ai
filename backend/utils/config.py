import os
import json
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent.parent
BACKEND_DIR = BASE_DIR.parent

for p in [ROOT_DIR / ".env", BACKEND_DIR / ".env", Path.cwd() / ".env"]:
    if p.exists():
        load_dotenv(p)
load_dotenv()

def get_gemini_api_key() -> str:
    """
    Secure credential manager:
    1. Checks if AWS Secrets Manager is configured (AWS_SECRET_NAME).
    2. Falls back to OS environment variable GEMINI_API_KEY.
    3. Falls back to .env file.
    """
    # 1. Check AWS Secrets Manager if configured
    secret_name = os.getenv("AWS_SECRET_NAME")
    aws_region = os.getenv("AWS_REGION", "us-east-1")
    
    if secret_name:
        try:
            import boto3
            from botocore.exceptions import ClientError
            
            client = boto3.client("secretsmanager", region_name=aws_region)
            response = client.get_secret_value(SecretId=secret_name)
            
            if "SecretString" in response:
                secret = json.loads(response["SecretString"])
                if "GEMINI_API_KEY" in secret:
                    return secret["GEMINI_API_KEY"]
        except Exception as e:
            # Fall through gracefully to env variable
            print(f"[ConfigVault] AWS Secrets Manager lookup skipped/failed: {e}")

    # 2. Check environment variable
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and api_key.strip():
        return api_key.strip()

    raise ValueError("GEMINI_API_KEY not found in environment or AWS Secrets Vault.")

def mask_credential(key: str) -> str:
    """Returns a safe masked version of a credential string for logging."""
    if not key or len(key) < 8:
        return "********"
    return f"{key[:4]}...{key[-4:]}"

ACTIVE_GEMINI_MODELS = [
    "gemini-3.7-flash",
    "gemini-flash-lite-latest",
    "gemini-flash-latest",
    "gemini-3.8-flash",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-pro-latest"
]
