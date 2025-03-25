#!/bin/bash

DRUID_LOG_FILE="/opt/airflow/druid_db/backup_logs/backup_$(date +%Y-%m-%d).log"
mkdir -p "/opt/airflow/druid_db/backup_logs"
touch "$DRUID_LOG_FILE"

DRUID_STORAGE_PATH="/opt/airflow/storage"
DRUID_BACKUP_DIR="/opt/airflow/druid_db/backup_druid"

BACKUP_ARCHIVE="/opt/airflow/druid_db/backup_druid/backup_$(date +%Y-%m-%d)_druid_db.tar.gz"
DRUID_SEGMENTS_PATH="$DRUID_STORAGE_PATH/segments"
DRUID_INDEXING_LOGS_PATH="$DRUID_STORAGE_PATH/indexing-logs"

if [ ! -d "$DRUID_STORAGE_PATH" ]; then
  echo "Critical paths for Druid data are missing!" | tee -a "$DRUID_LOG_FILE"
  exit 1
fi

if [ -z "$DRUID_POSTGRES_USER" ] || [ -z "$DRUID_POSTGRES_DB" ] || [ -z "$DRUID_POSTGRES_HOST" ]; then
  echo "Required environment variables are not set. Check your .env file."
  exit 1
fi

echo "Creating backup directory at $DRUID_BACKUP_DIR..." | tee -a "$DRUID_LOG_FILE"
mkdir -p "$DRUID_BACKUP_DIR"

# DB backup
echo "Dumping Druid database to $BACKUP_DB_FILE..." | tee -a "$DRUID_LOG_FILE"
BACKUP_DB_FILE="$DRUID_BACKUP_DIR/db_backup_$(date +%Y-%m-%d)_druid_db.sql"
PGPASSWORD="$DRUID_POSTGRES_PASSWORD" pg_dump -U "$DRUID_POSTGRES_USER" -h "$DRUID_POSTGRES_HOST" -d "$DRUID_POSTGRES_DB" > "$BACKUP_DB_FILE" 2>> "$DRUID_LOG_FILE"

echo "Backing up segment files from $DRUID_SEGMENTS_PATH..." | tee -a "$DRUID_LOG_FILE"
cp -R "$DRUID_SEGMENTS_PATH" "$DRUID_BACKUP_DIR/segments" 2>> "$DRUID_LOG_FILE"

if [ $? -ne 0 ]; then
  echo "Failed to back up segment files!" | tee -a "$DRUID_LOG_FILE"
fi
echo "Segment files backup completed!" | tee -a "$DRUID_LOG_FILE"

echo "Backing up indexing logs from $DRUID_INDEXING_LOGS_PATH..." | tee -a "$DRUID_LOG_FILE"
cp -R "$DRUID_INDEXING_LOGS_PATH" "$DRUID_BACKUP_DIR/indexing-logs" 2>> "$DRUID_LOG_FILE"
if [ $? -ne 0 ]; then
  echo "Failed to back up indexing logs!" | tee -a "$DRUID_LOG_FILE"
fi
echo "Indexing logs backup completed!" | tee -a "$DRUID_LOG_FILE"

# tar
echo "Compressing backup directory into $BACKUP_ARCHIVE..." | tee -a "$DRUID_LOG_FILE"
tar -czvf "$BACKUP_ARCHIVE" -C "$DRUID_BACKUP_DIR" segments indexing-logs "$(basename "$BACKUP_DB_FILE")" 2>> "$DRUID_LOG_FILE"

if [ $? -ne 0 ]; then
  echo "Failed to compress backup!" | tee -a "$DRUID_LOG_FILE"
  exit 1
fi
echo "Backup compressed successfully into $BACKUP_ARCHIVE!" | tee -a "$DRUID_LOG_FILE"

rm -rf "$DRUID_BACKUP_DIR/segments" 2>> "$DRUID_LOG_FILE"
rm -rf "$DRUID_BACKUP_DIR/indexing-logs" 2>> "$DRUID_LOG_FILE"
rm -rf "$BACKUP_DB_FILE" 2>> "$DRUID_LOG_FILE"

echo "Druid backup process completed successfully!" | tee -a "$DRUID_LOG_FILE"
