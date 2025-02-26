#!/bin/bash

mkdir -p "/opt/airflow/druid_db/restore_logs"
DRUID_LOG_FILE="/opt/airflow/druid_db/restore_logs/restore_$(date +%Y-%m-%d).log"
touch "$DRUID_LOG_FILE"

DRUID_BACKUP_DIR="/opt/airflow/druid_db/backup_druid"
DRUID_STORAGE_PATH="/opt/airflow/storage"
DRUID_RESTORE_DIR="/tmp/restore_druid"

DRUID_BACKUP_FILE_TAR=$(ls -t $DRUID_BACKUP_DIR/backup_*.tar.gz | head -n 1)
if [ -z "$DRUID_BACKUP_FILE_TAR" ]; then
  echo -e "No backup file found for storage in $DRUID_BACKUP_DIR." | tee -a "$DRUID_LOG_FILE"
  exit 1
fi

echo "Starting Druid restore process from $DRUID_BACKUP_DIR..." | tee -a "$DRUID_LOG_FILE"

# DATE EXTRACTION
DATE_BACKUP=$(basename "$DRUID_BACKUP_FILE_TAR" | sed -E 's/backup_([0-9]{4}-[0-9]{2}-[0-9]{2})_druid_db\.tar\.gz/\1/')
echo "DATE_BACKUP: $DATE_BACKUP" | tee -a "$DRUID_LOG_FILE"
if [ -z "$DATE_BACKUP" ]; then
  echo -e "Failed to extract date from backup file name." | tee -a "$DRUID_LOG_FILE"
  exit 1
fi

# FILES EXTRACTION
echo "Extracting $DRUID_BACKUP_FILE_TAR..." | tee -a "$DRUID_LOG_FILE"
mkdir -p "$DRUID_RESTORE_DIR"
tar -xzvf "$DRUID_BACKUP_FILE_TAR" -C "$DRUID_RESTORE_DIR" > /dev/null 2>> "$DRUID_LOG_FILE"
if [ $? -ne 0 ]; then
  echo -e "Failed to extract $DRUID_BACKUP_FILE_TAR." | tee -a "$DRUID_LOG_FILE"
  exit 1
fi

# DB RESTORE
echo "Restoring $DRUID_POSTGRES_DB..." | tee -a "$DRUID_LOG_FILE"
PGPASSWORD="$DRUID_POSTGRES_PASSWORD" psql -U "$DRUID_POSTGRES_USER" -h "$DRUID_POSTGRES_HOST" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DRUID_POSTGRES_DB';" > /dev/null 2>> "$DRUID_LOG_FILE"
PGPASSWORD="$DRUID_POSTGRES_PASSWORD" psql -U "$DRUID_POSTGRES_USER" -h "$DRUID_POSTGRES_HOST" -d postgres -c "DROP DATABASE IF EXISTS $DRUID_POSTGRES_DB" > /dev/null 2>> "$DRUID_LOG_FILE"
PGPASSWORD="$DRUID_POSTGRES_PASSWORD" psql -U "$DRUID_POSTGRES_USER" -h "$DRUID_POSTGRES_HOST" -d postgres -c "CREATE DATABASE $DRUID_POSTGRES_DB" > /dev/null 2>> "$DRUID_LOG_FILE"

BACKUP_FILENAME_SQL="$DRUID_RESTORE_DIR/db_backup_${DATE_BACKUP}_druid_db.sql"
cat "$BACKUP_FILENAME_SQL" | PGPASSWORD="$DRUID_POSTGRES_PASSWORD" psql -h "$DRUID_POSTGRES_HOST" -U "$DRUID_POSTGRES_USER" -d "$DRUID_POSTGRES_DB" > /dev/null 2>> "$DRUID_LOG_FILE"

if [ $? -eq 0 ]; then
  echo -e "Restoration of $DRUID_POSTGRES_DB successful!" | tee -a "$DRUID_LOG_FILE"
  rm "$BACKUP_FILENAME_SQL"
else
  echo -e "Restoration of $DRUID_POSTGRES_DB failed." | tee -a "$DRUID_LOG_FILE"
fi

# SEGMENTS
DRUID_SEGMENTS_PATH="$DRUID_STORAGE_PATH/segments"
if [ -d "$DRUID_RESTORE_DIR/segments" ]; then
  echo "Restoring segment files..." | tee -a "$DRUID_LOG_FILE"
  mkdir -p "$DRUID_SEGMENTS_PATH"
  cp -R "$DRUID_RESTORE_DIR/segments/"* "$DRUID_SEGMENTS_PATH/" 2>> "$DRUID_LOG_FILE"

  if [ $? -ne 0 ]; then
    echo "Failed to restore segment files!" | tee -a "$DRUID_LOG_FILE"
  fi
  echo "Segment files restored successfully!" | tee -a "$DRUID_LOG_FILE"
else
  echo "No segment files found in the backup. Skipping segment restoration." | tee -a "$DRUID_LOG_FILE"
fi

# INDEXING LOGS RESTORE
DRUID_INDEXING_LOGS_PATH="$DRUID_STORAGE_PATH/indexing-logs"
if [ -d "$DRUID_RESTORE_DIR/indexing-logs" ]; then
  echo "Restoring indexing logs..." | tee -a "$DRUID_LOG_FILE"
  mkdir -p "$DRUID_INDEXING_LOGS_PATH"
  cp -R "$DRUID_RESTORE_DIR/indexing-logs/"* "$DRUID_INDEXING_LOGS_PATH" 2>> "$DRUID_LOG_FILE"

  if [ $? -ne 0 ]; then
    echo "Failed to restore indexing logs!" | tee -a "$DRUID_LOG_FILE"
  else
    echo "Indexing logs restored successfully!" | tee -a "$DRUID_LOG_FILE"
  fi
else
  echo "No indexing logs found in the backup. Skipping indexing logs restoration." | tee -a "$DRUID_LOG_FILE"
fi

rm -rf "$DRUID_RESTORE_DIR" 2>> "$DRUID_LOG_FILE"

echo "Druid restore process completed successfully!" | tee -a "$DRUID_LOG_FILE"
