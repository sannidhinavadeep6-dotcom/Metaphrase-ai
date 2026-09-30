import pytest
import hashlib
import uuid
from database import hash_password, verify_password, register_user, verify_login, init_db

def test_bcrypt_hashing_and_salting():
    pw = "supersecret123"
    hash1 = hash_password(pw)
    hash2 = hash_password(pw)
    
    # Hashes must start with bcrypt or pbkdf2 identifier
    assert hash1.startswith("$2b$") or hash1.startswith("$2a$") or hash1.startswith("pbkdf2$")
    assert hash2.startswith("$2b$") or hash2.startswith("$2a$") or hash2.startswith("pbkdf2$")
    
    # Salts ensure identical passwords produce distinct hashes
    assert hash1 != hash2
    
    # Both must successfully verify
    assert verify_password(pw, hash1) is True
    assert verify_password(pw, hash2) is True
    assert verify_password("wrongpassword", hash1) is False

def test_legacy_sha256_backwards_compatibility():
    pw = "legacyPassword456"
    legacy_sha256 = hashlib.sha256(pw.encode('utf-8')).hexdigest()
    
    # Verify legacy hash works
    assert verify_password(pw, legacy_sha256) is True
    assert verify_password("wrongpassword", legacy_sha256) is False

def test_user_registration_and_login_flow():
    init_db()
    unique_id = uuid.uuid4().hex[:8]
    test_email = f"tester_qa_{unique_id}@example.com"
    test_pw = "pass12345"
    
    # Register
    reg_success = register_user("QA Tester", test_email, test_pw)
    assert reg_success is True
    
    # Verify login
    login_info = verify_login(test_email, test_pw)
    assert login_info is not None
    role, status, name = login_info
    assert name == "QA Tester"
    assert role == "user"
    assert status == "accepted"
