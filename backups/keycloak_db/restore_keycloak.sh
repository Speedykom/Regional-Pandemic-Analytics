#!/bin/bash

mkdir -p "/opt/airflow/keycloak_db/restore_logs"
LOG_FILE="/opt/airflow/keycloak_db/restore_logs/restore_keycloak_$(date +%Y-%m-%d).log"
touch "$LOG_FILE"

BACKUP_DIR="/opt/airflow/keycloak_db/backup_keycloak"
BACKUP_FILE=$(ls -t $BACKUP_DIR/backup_*.tar.gz | head -n 1)
if [ -z "$BACKUP_FILE" ]; then
  echo -e "No backup file found in $BACKUP_DIR." | tee -a "$LOG_FILE"
  exit 1
fi

# Extract date from the backup file name
DATE_BACKUP=$(basename "$BACKUP_FILE" | sed -E 's/backup_([0-9]{4}-[0-9]{2}-[0-9]{2})_keycloak-pg\.tar\.gz/\1/')
echo "DATE_BACKUP: $DATE_BACKUP" | tee -a "$LOG_FILE"
if [ -z "$DATE_BACKUP" ]; then
  echo -e "Failed to extract date from backup file name." | tee -a "$LOG_FILE"
  exit 1
fi

if [ -z "$KEYCLOAK_POSTGRES_USER" ] || [ -z "$KEYCLOAK_POSTGRES_DB" ] || [ -z "$KEYCLOAK_POSTGRES_PASSWORD" ] || [ -z "$KEYCLOAK_DB_URL_HOST" ]; then
  echo -e "Required environment variables are not set. Check your .env file." | tee -a "$LOG_FILE"
  exit 1
fi

BACKUP_FILE_TAR="${BACKUP_DIR}/backup_${DATE_BACKUP}_keycloak-pg.tar.gz"
if [ ! -f "$BACKUP_FILE_TAR" ]; then
  echo -e "Backup file not found in $BACKUP_DIR." | tee -a "$LOG_FILE"
  exit 1
fi

echo "Extracting $BACKUP_FILE_TAR..." | tee -a "$LOG_FILE"
mkdir -p "/tmp/$KEYCLOAK_DB_URL_HOST"
tar -xzvf "$BACKUP_FILE_TAR" -C "/tmp/$KEYCLOAK_DB_URL_HOST/" > /dev/null 2>> "$LOG_FILE"
if [ $? -ne 0 ]; then
  echo -e "Failed to extract $BACKUP_FILE_TAR." | tee -a "$LOG_FILE"
  exit 1
fi

BACKUP_FILENAME_SQL="/tmp/$KEYCLOAK_DB_URL_HOST/db_backup_${DATE_BACKUP}_keycloak-pg.sql"

if [ ! -f "$BACKUP_FILENAME_SQL" ]; then
  echo -e "Backup file not found $BACKUP_FILENAME_SQL." | tee -a "$LOG_FILE"
  exit 1
fi

echo "Restoring $KEYCLOAK_POSTGRES_DB..." | tee -a "$LOG_FILE"
PGPASSWORD="$KEYCLOAK_POSTGRES_PASSWORD" psql -U "$KEYCLOAK_POSTGRES_USER" -h "$KEYCLOAK_DB_URL_HOST" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$KEYCLOAK_POSTGRES_DB';" > /dev/null 2>> "$LOG_FILE"
PGPASSWORD="$KEYCLOAK_POSTGRES_PASSWORD" psql -U "$KEYCLOAK_POSTGRES_USER" -h "$KEYCLOAK_DB_URL_HOST" -d postgres -c "DROP DATABASE IF EXISTS $KEYCLOAK_POSTGRES_DB" > /dev/null 2>> "$LOG_FILE"
PGPASSWORD="$KEYCLOAK_POSTGRES_PASSWORD" psql -U "$KEYCLOAK_POSTGRES_USER" -h "$KEYCLOAK_DB_URL_HOST" -d postgres -c "CREATE DATABASE $KEYCLOAK_POSTGRES_DB" > /dev/null 2>> "$LOG_FILE"
cat "$BACKUP_FILENAME_SQL" | PGPASSWORD="$KEYCLOAK_POSTGRES_PASSWORD" psql -h "$KEYCLOAK_DB_URL_HOST" -U "$KEYCLOAK_POSTGRES_USER" -d "$KEYCLOAK_POSTGRES_DB" > /dev/null 2>> "$LOG_FILE"

if [ $? -eq 0 ]; then
  echo -e "Restoration of $KEYCLOAK_POSTGRES_DB successful!" | tee -a "$LOG_FILE"
else
  echo -e "Restoration of $KEYCLOAK_POSTGRES_DB failed." | tee -a "$LOG_FILE"
  exit 1
fi

if [ -f "$LOG_FILE" ] && [ ! -s "$LOG_FILE" ]; then
  rm "$LOG_FILE"
fi
