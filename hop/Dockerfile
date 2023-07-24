FROM apache/hop-web:2.4.0

RUN apt-get update

# Copy and  file watcher script executable
COPY watchFiles.sh /usr/local/tomcat/watchFiles.sh
RUN chmod +x /usr/local/tomcat/watchFiles.sh

#ADD hop-cpython-1.5.tar.gz /usr/local/tomcat/plugins/transforms
COPY plugins/transforms/googlesheets /usr/local/tomcat/plugins/transforms/googlesheets
COPY hop-config.json /usr/local/tomcat/webapps/ROOT/config/hop-config.json

COPY keycloak/lib/*.jar /usr/local/tomcat/lib/
COPY keycloak/tomcat-users.xml /usr/local/tomcat/conf
COPY keycloak/context.xml /usr/local/tomcat/webapps/ROOT/META-INF
COPY keycloak/web.xml /usr/local/tomcat/webapps/ROOT/WEB-INF
COPY keycloak/keycloak.json /usr/local/tomcat/webapps/ROOT/WEB-INF/keycloak.template.json
COPY run-web.sh /tmp/

CMD ["/bin/bash", "/tmp/run-web.sh"]
