from django.core.mail import EmailMultiAlternatives

subject, from_email, to = "hello", "from@example.com", "to@example.com"
text_content = "This is an important message."
html_content = "<p>This is an <strong>important</strong> message.</p>"
msg = EmailMultiAlternatives(subject, text_content, from_email, [to], auth_user)
msg.attach_alternative(html_content, "text/html")
msg.send()