from utils.keycloak_auth import get_current_user

import logging

class Logger:
    user = None
    logger = None

    def __init__(self, request):
        self.user = get_current_user(request)
        self.logger = logging.getLogger("django")

    def user_info(self, message, action):
        action = "user = {} message = {} - {}".format(self.user['preferred_username'], message, action)
        self.logger.info(action)

    def info(info):
        action = "user = {} info = {}".format(self.user['preferred_username'], info)
        self.logger.info(action)

    def error(error):
        action = "user = {} error = {}".format(self.user['preferred_username'], error)
        self.logger.error(error)