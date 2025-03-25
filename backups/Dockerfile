FROM apache/airflow:2.10.0

USER root

RUN apt-get update && apt-get install -y tar postgresql-client curl \
    && curl -LO https://dl.min.io/client/mc/release/linux-amd64/mc \
    && chmod +x mc \
    && mv mc /usr/local/bin/

COPY ./entrypoint.sh /tmp/

RUN sed -i 's/\r$//g' /tmp/entrypoint.sh

RUN chmod +x /tmp/entrypoint.sh

RUN airflow db init

USER airflow
