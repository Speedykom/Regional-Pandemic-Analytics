#!/bin/bash

mkdir -p "/opt/airflow/backend_db/restore_logs"
BACKEND_LOG_FILE="/opt/airflow/backend_db/restore_logs/restore_backend_$(date +%Y-%m-%d).log"
touch "$BACKEND_LOG_FILE"

BACKEND_BACKUP_DIR="/opt/airflow/backend_db/backup_backend"
BACKEND_BACKUP_FILE=$(ls -t $BACKEND_BACKUP_DIR/backup_*.tar.gz | head -n 1)
if [ -z "$BACKEND_BACKUP_FILE" ]; then
  echo -e "No backup file found in $BACKEND_BACKUP_DIR." | tee -a "$BACKEND_LOG_FILE"
  exit 1
fi

# Extract date from the backup file name
DATE_BACKUP=$(basename "$BACKEND_BACKUP_FILE" | sed -E 's/backup_([0-9]{4}-[0-9]{2}-[0-9]{2})_backend_db\.tar\.gz/\1/')
echo "DATE_BACKUP: $DATE_BACKUP" | tee -a "$BACKEND_LOG_FILE"
if [ -z "$DATE_BACKUP" ]; then
  echo -e "Failed to extract date from backup file name." | tee -a "$BACKEND_LOG_FILE"
  exit 1
fi

if [ -z "$BACKEND_DB_USER" ] || [ -z "$BACKEND_DB_NAME" ] || [ -z "$BACKEND_DB_PASSWORD" ] || [ -z "$BACKEND_DB_HOST" ]; then
  echo -e "Required environment variables are not set. Check your .env file." | tee -a "$BACKEND_LOG_FILE"
  exit 1
fi

BACKEND_BACKUP_FILE_TAR="${BACKEND_BACKUP_DIR}/backup_${DATE_BACKUP}_backend_db.tar.gz"
if [ ! -f "$BACKEND_BACKUP_FILE_TAR" ]; then
  echo -e "Backup file not found in $BACKEND_BACKUP_DIR." | tee -a "$BACKEND_LOG_FILE"
  exit 1
fi

echo "Extracting $BACKEND_BACKUP_FILE_TAR..." | tee -a "$BACKEND_LOG_FILE"
mkdir -p "/tmp/$BACKEND_DB_HOST"
tar -xzvf "$BACKEND_BACKUP_FILE_TAR" -C "/tmp/$BACKEND_DB_HOST/" > /dev/null 2>> "$BACKEND_LOG_FILE"
if [ $? -ne 0 ]; then
  echo -e "Failed to extract $BACKEND_BACKUP_FILE_TAR." | tee -a "$BACKEND_LOG_FILE"
  exit 1
fi

echo "Restoring $BACKEND_DB_NAME..." | tee -a "$BACKEND_LOG_FILE"
PGPASSWORD="$BACKEND_DB_PASSWORD" psql -U "$BACKEND_DB_USER" -h "$BACKEND_DB_HOST" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$BACKEND_DB_NAME';" > /dev/null 2>> "$BACKEND_LOG_FILE"
PGPASSWORD="$BACKEND_DB_PASSWORD" psql -U "$BACKEND_DB_USER" -h "$BACKEND_DB_HOST" -d postgres -c "DROP DATABASE IF EXISTS $BACKEND_DB_NAME" > /dev/null 2>> "$BACKEND_LOG_FILE"
PGPASSWORD="$BACKEND_DB_PASSWORD" psql -U "$BACKEND_DB_USER" -h "$BACKEND_DB_HOST" -d postgres -c "CREATE DATABASE $BACKEND_DB_NAME" > /dev/null 2>> "$BACKEND_LOG_FILE"

BACKUP_FILENAME_SQL="/tmp/$BACKEND_DB_HOST/backup_${DATE_BACKUP}_backend_db.sql"
cat "$BACKUP_FILENAME_SQL" | PGPASSWORD="$BACKEND_DB_PASSWORD" psql -h "$BACKEND_DB_HOST" -U "$BACKEND_DB_USER" -d "$BACKEND_DB_NAME" > /dev/null 2>> "$BACKEND_LOG_FILE"

if [ $? -eq 0 ]; then
  echo -e "Restoration of $BACKEND_DB_NAME successful!" | tee -a "$BACKEND_LOG_FILE"
  rm "$BACKUP_FILENAME_SQL"
else
  echo -e "Restoration of $BACKEND_DB_NAME failed." | tee -a "$BACKEND_LOG_FILE"
  exit 1
fi

if [ -f "$BACKEND_LOG_FILE" ] && [ ! -s "$BACKEND_LOG_FILE" ]; then
  rm "$BACKEND_LOG_FILE"
fi
