#!/bin/bash

mkdir -p "/opt/airflow/minio_db/restore_logs"
MINIO_LOG_FILE="/opt/airflow/minio_db/restore_logs/restore_minio_$(date +%Y-%m-%d).log"
touch "$MINIO_LOG_FILE"

MINIO_BACKUP_DIR="/opt/airflow/minio_db/backup_minio"
MINIO_BACKUP_FILE=$(ls -t $MINIO_BACKUP_DIR/backup_*.tar.gz | head -n 1)
if [ -z "$MINIO_BACKUP_FILE" ]; then
  echo -e "No backup file found in $MINIO_BACKUP_DIR." | tee -a "$MINIO_LOG_FILE"
  exit 1
fi

MINIO_RESTORE_DIR="/tmp/restore_minio"

# Extract date from the backup file name
DATE_BACKUP=$(basename "$MINIO_BACKUP_FILE" | sed -E 's/backup_([0-9]{4}-[0-9]{2}-[0-9]{2})_minio_db\.tar\.gz/\1/')
echo "DATE_BACKUP: $DATE_BACKUP" | tee -a "$MINIO_LOG_FILE"
if [ -z "$DATE_BACKUP" ]; then
  echo -e "Failed to extract date from backup file name." | tee -a "$MINIO_LOG_FILE"
  exit 1
fi

MINIO_BACKUP_FILE_TAR="${MINIO_BACKUP_DIR}/backup_${DATE_BACKUP}_minio_db.tar.gz"
if [ ! -f "$MINIO_BACKUP_FILE_TAR" ]; then
  echo -e "Backup file not found in $MINIO_BACKUP_DIR." | tee -a "$MINIO_LOG_FILE"
  exit 1
fi

echo "Extracting $MINIO_BACKUP_FILE_TAR..." | tee -a "$MINIO_LOG_FILE"
mkdir -p "$MINIO_RESTORE_DIR"
tar -xzvf "$MINIO_BACKUP_FILE_TAR" -C "$MINIO_RESTORE_DIR/" > /dev/null 2>> "$MINIO_LOG_FILE"
if [ $? -ne 0 ]; then
  echo -e "Failed to extract $MINIO_BACKUP_FILE_TAR." | tee -a "$MINIO_LOG_FILE"
  exit 1
fi

MINIO_ALIAS="minio"

mc alias set "$MINIO_ALIAS" "$MINIO_MC_REMOTE_SERVER_URL" "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" 2>> "$MINIO_LOG_FILE"

echo "Restoring MinIO data..." | tee -a "$MINIO_LOG_FILE"
mc mirror --overwrite "$MINIO_RESTORE_DIR" "$MINIO_ALIAS" 2>> "$MINIO_LOG_FILE"

if [ $? -eq 0 ]; then
  echo -e "Restoration of $MINIO_MC_REMOTE_SERVER_URL successful!" | tee -a "$MINIO_LOG_FILE"
  rm -rf "$MINIO_RESTORE_DIR" 2>> "$MINIO_LOG_FILE"
else
  echo -e "Restoration of $MINIO_MC_REMOTE_SERVER_URL failed." | tee -a "$MINIO_LOG_FILE"
  exit 1
fi

if [ -f "$MINIO_LOG_FILE" ] && [ ! -s "$MINIO_LOG_FILE" ]; then
  rm "$MINIO_LOG_FILE"
fi
