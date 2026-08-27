import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


def send_email(to_email: str, subject: str, html_body: str, reply_to: str = None) -> bool:
    """
    Email best-effort hai -- SMTP fail ho ya config missing ho to False
    return karega, exception nahi uthayega.
    """
    if not to_email or not SMTP_USERNAME or not SMTP_PASSWORD:
        print(f"[email_service] Skipped -- missing config ya recipient email ({to_email})")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"FixMyCity <{SMTP_USERNAME}>"
        msg["To"] = to_email
        msg["Reply-To"] = reply_to or SMTP_USERNAME
        msg.attach(MIMEText(html_body, "html"))

        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10) as server:
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.sendmail(SMTP_USERNAME, [to_email], msg.as_string())
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.sendmail(SMTP_USERNAME, [to_email], msg.as_string())
        return True
    except Exception as e:
        print(f"[email_service] Failed to send email to {to_email}: {e}")
        return False