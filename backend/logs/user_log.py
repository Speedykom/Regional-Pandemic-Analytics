from utils.keycloak_auth import get_current_user_id

class Logger:
    user = nil

    def __init__(self, request):
        self.user = get_current_user_id(request)
        print(self.user)

    def info(message):
        pass

    def error(message):
        pass