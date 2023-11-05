# FROM ubuntu
# RUN apt-get update -y
# RUN apt-get install -y wget unzip

# # install google chrome

# RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
# RUN wget https://chromedriver.storage.googleapis.com/88.0.4324.96/chromedriver_linux64.zip
# RUN unzip chromedriver_linux64.zip
# RUN chmod +x chromedriver
# RUN mv chromedriver /usr/bin
# RUN rm -f google-chrome-stable_current_amd64.deb chromedriver_linux64.zip


FROM apache/superset:2.1.0
RUN pip install Authlib
RUN pip install python-keycloak
RUN pip install psycopg2
RUN pip install apache-superset[thumbnails]
# Needed for the Thumbnail caching feature
RUN pip install redis
RUN pip install Flask-Caching
RUN pip install celery==4.4.7
