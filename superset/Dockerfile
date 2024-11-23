FROM apache/superset:3.1.0

RUN pip --no-cache-dir install Authlib  python-keycloak==3.12.0 python-jose 'apache-superset[druid]' 'apache-superset[excel]' 'apache-superset[postgres]' 'apache-superset[prophet]' 'apache-superset[thumbnails]'

USER root
RUN apt update \
    && apt install -y chromium-driver chromium-l10n \
    && apt clean

COPY assets/cameroon.geojson node_modules/@superset-ui/legacy-plugin-chart-country-map/esm/countries/cameroon.geojson
COPY assets/countries.js node_modules/@superset-ui/legacy-plugin-chart-country-map/esm/countries.js
COPY repan-superset-startup.sh /usr/bin/repan-superset-startup.sh
USER superset

VOLUME ["/app/import"]
CMD ["/usr/bin/repan-superset-startup.sh"]
