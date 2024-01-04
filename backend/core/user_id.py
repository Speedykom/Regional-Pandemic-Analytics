from typing import Union
try:
    from threading import local
except:
    from django.utils._threading_local import local

_thread_locals = local()

class UserIdMiddleware:
    """Saves the ID (username) of the user making the request into a thread-local for easy retrieval
    through `get_current_user`
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)
    def process_view(self, request, view_func, view_args, view_kwargs):
        if hasattr(request, 'userinfo'):
            _thread_locals.user = request.userinfo['preferred_username'] or request.userinfo['sub']

def get_current_user() -> Union[str, None]:
    return getattr(_thread_locals, 'user', None)
