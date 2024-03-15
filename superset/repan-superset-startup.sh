#!/bin/bash

superset fab create-admin --username speedykom --firstname Superset --lastname Admin --email admin@superset.com --password speedykom
superset db upgrade
superset superset init

if ls /app/import/*.zip 2>&1 > /dev/null; then
    echo "Found dashboard backups. Importing…"
    TIMESTAMP="$(date -I)"
    IMPORTED_DIR="/app/import/imported/$TIMESTAMP"
    FAIL_DIR="/app/import/failed/$TIMESTAMP"
    mkdir -p "$IMPORTED_DIR" 2>&1 > /dev/null
    mkdir -p "$FAIL_DIR" 2>&1 > /dev/null
    for EXP in /app/import/*.zip; do
        echo "Importing $(basename $EXP)… "
        if superset import-dashboards -p "$EXP"; then
            echo "Import OK"
            mv "$EXP" "$IMPORTED_DIR"
        else
            echo "Import failed!"
            mv "$EXP" "$FAIL_DIR"
        fi
    done
fi

echo "Starting Superset server…"

export SERVER_WORKER_AMOUNT=5

if test "$1" = "--dev"; then
   FLASK_ENV=development flask run -p 8088 --with-threads --reload --debugger --host=0.0.0.0
else
    /usr/bin/run-server.sh
fi
