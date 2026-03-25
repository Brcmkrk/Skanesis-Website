import smtplib
from email.mime.text import MIMEText


class EmailService:

    def __init__(self):
        self.sender_email = "wstskanesis@gmail.com"
        self.sender_password = "yxieyhqixdhwyytp"

    def send_reset_email(self, receiver_email, reset_code):

        subject = "Password Reset Code"
        body = f"Your password reset code is: {reset_code}\nThis code expires in 10 minutes."

        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = self.sender_email
        msg["To"] = receiver_email

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(self.sender_email, self.sender_password)
            server.sendmail(
                self.sender_email,
                receiver_email,
                msg.as_string()
            )
            
    def send_verification_code(self, receiver_email, code):
        subject = "Your Skanesis Verification Code"
        body = f"Welcome to Skanesis!\n\nYour 6-digit verification code is: {code}\n\nThis code will expire in 5 minutes.\nIf you did not request this, please ignore this email."

        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = self.sender_email
        msg["To"] = receiver_email

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(self.sender_email, self.sender_password)
            server.sendmail(
                self.sender_email,
                receiver_email,
                msg.as_string()
            )

    def send_temp_password_email(self, receiver_email, username, temp_password):

        subject = "Your Account Has Been Created"
        body = f"""Hello, An account has been created for you. Username: {username} Temporary Password: {temp_password} 
                   Please change your password immediately after logging in.
                   If this was not expected, contact your administrator.
"""

        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = self.sender_email
        msg["To"] = receiver_email

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(self.sender_email, self.sender_password)
            server.sendmail(
                self.sender_email,
                receiver_email,
                msg.as_string()
            )


    def send_deletion_email(self, receiver_email, username):

        subject = "Your Account Has Been Deleted"
        body = f"""
    Hello,

    Your account with username '{username}' has been deleted by the administrator.

    If you believe this was a mistake, please contact support.
"""

        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = self.sender_email
        msg["To"] = receiver_email

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(self.sender_email, self.sender_password)
            server.sendmail(
                self.sender_email,
                receiver_email,
                msg.as_string()
            )