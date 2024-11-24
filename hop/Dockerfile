FROM apache/hop-web:2.7.0

# add installation of inotify tools
USER root

RUN apt-get update
RUN apt-get install inotify-tools -y
RUN apt-get install gettext-base

# Copy and  file watcher script executable
COPY watchFiles.sh /usr/local/tomcat/watchFiles.sh
RUN chmod +x /usr/local/tomcat/watchFiles.sh

COPY hop-config.json /usr/local/tomcat/webapps/ROOT/config/hop-config.json

COPY keycloak/lib/*.jar /usr/local/tomcat/lib/
COPY keycloak/tomcat-users.xml /usr/local/tomcat/conf
COPY keycloak/context.xml /usr/local/tomcat/webapps/ROOT/META-INF
COPY keycloak/web.xml /usr/local/tomcat/webapps/ROOT/WEB-INF
COPY keycloak/keycloak.json /usr/local/tomcat/webapps/ROOT/WEB-INF/keycloak.template.json
COPY run-web.sh /tmp/

USER igad

CMD ["/bin/bash", "/tmp/run-web.sh"]
