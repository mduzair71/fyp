from dotenv import load_dotenv
load_dotenv()
import os

print("USERNAME:", repr(os.getenv("SMTP_USERNAME")))
print("PASSWORD:", repr(os.getenv("SMTP_PASSWORD")))

from services.email_service import send_email
result = send_email(
    to_email="mduzair1805@gmail.com",
    subject="FixMyCity Test Email",
    html_body="<p>Test</p>",
)
print("Email sent:" if result else "Email FAILED:", result)