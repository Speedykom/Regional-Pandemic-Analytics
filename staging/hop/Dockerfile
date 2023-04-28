FROM apache/hop-web:2.4.0

# RUN apt-get -y update &&\
#     apt-get install -y python3 python3-pip &&\
#     apt-get install -y python-is-python3 &&\
#     pip install --no-cache pandas numpy scipy matplotlib openpyxl scikit-learn xlrd

#ADD hop-cpython-1.5.tar.gz /usr/local/tomcat/plugins/transforms

COPY plugins/transforms/googlesheets /usr/local/tomcat/plugins/transforms/googlesheets
COPY hop-config.json /usr/local/tomcat/webapps/ROOT/config/hop-config.json