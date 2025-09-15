FROM apache/superset:4.1.3

COPY requirements.txt /app/requirements.txt

RUN pip --no-cache-dir install -r /app/requirements.txt

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
