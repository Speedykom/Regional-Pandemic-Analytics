from django.core.mail import send_mail
from core.settings import EMAIL_HOST_USER
from mailer.templates.reset_password import resetTemplateView

def SendMail(subject: str, payload: dict, redirectUri: str):
    message = ""
    recipient_list = [payload["email"]]

    send_mail(subject = subject, message = message, from_email = EMAIL_HOST_USER, recipient_list = recipient_list, fail_silently=True, html_message=resetTemplateView(payload["name"], redirectUri)) 