import smtplib
import random
from email.mime.text import MIMEText

# REPLACE THESE WITH YOUR SENDER GMAIL DETAILS
# You MUST generate an "App Password" in your Google Account settings for this to work
SENDER_EMAIL = "sannidhinavadeep6@gmail.com" 
SENDER_PASSWORD = "abcdefghijklmnop"

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(receiver_email, otp):
    subject = "Metaphrase AI - Your Login OTP"
    body = f"Welcome to Metaphrase! Your One-Time Password (OTP) is: {otp}\n\nPlease enter this to securely log in."
    
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL
    msg['To'] = receiver_email

    try:
        # Connect to Gmail's SMTP server
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, receiver_email, msg.as_string())
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False