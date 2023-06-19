import secrets
import string

# secure random string
def get_random_secret(length: int):
    secure_str = ''.join((secrets.choice(string.ascii_letters) for i in range(length)))
    return secure_str
