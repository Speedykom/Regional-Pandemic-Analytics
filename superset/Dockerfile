FROM apache/superset:4.1.1
RUN pip install --upgrade pip
RUN pip --no-cache-dir install \
    Authlib==1.2.1 \
    python-keycloak==3.12.0 \
    python-jose==3.3.0 \
    'apache-superset[druid]' \
    'apache-superset[excel]' \
    'apache-superset[postgres]' \
    'apache-superset[prophet]' \
    'apache-superset[thumbnails]'

USER root
RUN apt-get update \
    && apt-get install -y chromium-driver chromium-l10n \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY repan-superset-startup.sh /usr/bin/repan-superset-startup.sh
RUN chmod +x /usr/bin/repan-superset-startup.sh

USER superset

VOLUME ["/app/import"]
CMD ["/usr/bin/repan-superset-startup.sh"]
