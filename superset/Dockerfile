FROM apache/superset:2.1.0
USER root
RUN apt update && apt install gettext-base
RUN pip install Authlib
RUN pip install flask-oidc==1.3.0
RUN pip install itsdangerous==2.0.1
RUN pip install flask_openid
USER superset