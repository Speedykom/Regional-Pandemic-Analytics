#!/bin/bash

mkdir -p "/opt/airflow/superset_db/restore_logs"
LOG_FILE="/opt/airflow/superset_db/restore_logs/restore_superset_$(date +%Y-%m-%d).log"
touch "$LOG_FILE"

BACKUP_DIR="/opt/airflow/superset_db/backup_superset"
BACKUP_FILE=$(ls $BACKUP_DIR/backup_*.tar.gz | head -n 1)
if [ -z "$BACKUP_FILE" ]; then
  echo -e "No backup file found in $BACKUP_DIR." | tee -a "$LOG_FILE"
  exit 1
fi

# Extract date from the backup file name
DATE_BACKUP=$(basename "$BACKUP_FILE" | sed -E 's/backup_([0-9]{4}-[0-9]{2}-[0-9]{2})_superset_db\.tar\.gz/\1/')
echo "DATE_BACKUP: $DATE_BACKUP" | tee -a "$LOG_FILE"
if [ -z "$DATE_BACKUP" ]; then
  echo -e "Failed to extract date from backup file name." | tee -a "$LOG_FILE"
  exit 1
fi

if [ -z "$SUPERSET_POSTGRES_USER" ] || [ -z "$SUPERSET_POSTGRES_DB" ] || [ -z "$SUPERSET_POSTGRES_PASSWORD" ] || [ -z "$SUPERSET_POSTGRES_HOST" ]; then
  echo -e "Required environment variables are not set. Check your .env file." | tee -a "$LOG_FILE"
  exit 1
fi

BACKUP_FILE_TAR="${BACKUP_DIR}/backup_${DATE_BACKUP}_superset_db.tar.gz"
if [ ! -f "$BACKUP_FILE_TAR" ]; then
  echo -e "Backup file not found in $BACKUP_DIR." | tee -a "$LOG_FILE"
  exit 1
fi

echo "Extracting $BACKUP_FILE_TAR..." | tee -a "$LOG_FILE"
mkdir -p "/tmp/$SUPERSET_POSTGRES_HOST"
tar -xzvf "$BACKUP_FILE_TAR" -C "/tmp/$SUPERSET_POSTGRES_HOST/" > /dev/null 2>> "$LOG_FILE"
if [ $? -ne 0 ]; then
  echo -e "Failed to extract $BACKUP_FILE_TAR." | tee -a "$LOG_FILE"
  exit 1
fi

echo "Restoring $SUPERSET_POSTGRES_DB..." | tee -a "$LOG_FILE"
PGPASSWORD="$SUPERSET_POSTGRES_PASSWORD" psql -U "$SUPERSET_POSTGRES_USER" -h "$SUPERSET_POSTGRES_HOST" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$SUPERSET_POSTGRES_DB';" > /dev/null 2>> "$LOG_FILE"
PGPASSWORD="$SUPERSET_POSTGRES_PASSWORD" psql -U "$SUPERSET_POSTGRES_USER" -h "$SUPERSET_POSTGRES_HOST" -d postgres -c "DROP DATABASE IF EXISTS $SUPERSET_POSTGRES_DB" > /dev/null 2>> "$LOG_FILE"
PGPASSWORD="$SUPERSET_POSTGRES_PASSWORD" psql -U "$SUPERSET_POSTGRES_USER" -h "$SUPERSET_POSTGRES_HOST" -d postgres -c "CREATE DATABASE $SUPERSET_POSTGRES_DB" > /dev/null 2>> "$LOG_FILE"

BACKUP_FILENAME_SQL="/tmp/$SUPERSET_POSTGRES_HOST/backup_${DATE_BACKUP}_superset_db.sql"
cat "$BACKUP_FILENAME_SQL" | PGPASSWORD="$SUPERSET_POSTGRES_PASSWORD" psql -h "$SUPERSET_POSTGRES_HOST" -U "$SUPERSET_POSTGRES_USER" -d "$SUPERSET_POSTGRES_DB" > /dev/null 2>> "$LOG_FILE"

if [ $? -eq 0 ]; then
  echo -e "Restoration of $SUPERSET_POSTGRES_DB successful!" | tee -a "$LOG_FILE"
  rm "$BACKUP_FILENAME_SQL"
else
  echo -e "Restoration of $SUPERSET_POSTGRES_DB failed." | tee -a "$LOG_FILE"
  exit 1
fi

if [ -f "$LOG_FILE" ] && [ ! -s "$LOG_FILE" ]; then
  rm "$LOG_FILE"
fi
