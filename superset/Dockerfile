FROM apache/superset:3.0.2

RUN pip --no-cache-dir install Authlib  python-keycloak==3.12.0 python-jose 'apache-superset[druid]' 'apache-superset[excel]' 'apache-superset[postgres]' 'apache-superset[prophet]' 'apache-superset[thumbnails]'

USER root
RUN apt update \
    && apt install -y chromium-driver chromium-l10n \
    && apt clean
COPY repan-superset-startup.sh /usr/bin/repan-superset-startup.sh
USER superset

VOLUME ["/app/import"]
CMD ["/usr/bin/repan-superset-startup.sh"]
