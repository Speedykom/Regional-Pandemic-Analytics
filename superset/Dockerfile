FROM apache/superset:3.0.1

RUN pip --no-cache-dir install Authlib  python-keycloak==3.12.0 python-jose 'apache-superset[druid]' 'apache-superset[excel]' 'apache-superset[postgres]' 'apache-superset[prophet]' 'apache-superset[thumbnails]'

USER root
RUN apt update \
    && apt install -y chromium-driver chromium-l10n \
    && apt clean

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt install -y nodejs

COPY repan-superset-startup.sh /usr/bin/repan-superset-startup.sh
USER superset

WORKDIR /app/superset-frontend
RUN npm install

COPY assets/cameroon.geojson superset-frontend/node_modules/@superset-ui/legacy-plugin-chart-country-map/esm/countries/cameroon.geojson

COPY assets/countries.js superset-frontend/node_modules/@superset-ui/legacy-plugin-chart-country-map/esm/countries.js

WORKDIR /app

VOLUME ["/app/import"]
CMD ["/usr/bin/repan-superset-startup.sh"]
