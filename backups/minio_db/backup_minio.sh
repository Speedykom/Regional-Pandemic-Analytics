#!/bin/bash

MINIO_LOG_FILE="/opt/airflow/minio_db/backup_logs/backup_$(date +%Y-%m-%d).log"
mkdir -p "/opt/airflow/minio_db/backup_logs"
touch "$MINIO_LOG_FILE"

MINIO_BACKUP_DIR="/tmp/minio_db/backup_minio"
mkdir -p "$MINIO_BACKUP_DIR"
MINIO_BACKUP_ARCHIVE="/opt/airflow/minio_db/backup_minio/backup_$(date +%Y-%m-%d)_minio_db.tar.gz"

if [ -z "$MINIO_MC_REMOTE_SERVER_URL" ] || [ -z "$MINIO_ROOT_USER" ] || [ -z "$MINIO_ROOT_PASSWORD" ]; then
  echo "Missing critical environment variables!" | tee -a $MINIO_LOG_FILE
  exit 1
fi
echo "Environment variables for MinIO loaded from $ENV_FILE"

MINIO_ALIAS="minio"

echo "Configuring MinIO client..."
mc alias set $MINIO_ALIAS "$MINIO_MC_REMOTE_SERVER_URL" $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD

mc mirror --overwrite "$MINIO_ALIAS" "$MINIO_BACKUP_DIR" 2>> "$MINIO_LOG_FILE"

echo "Creating backup archive..." | tee -a "$MINIO_LOG_FILE"
tar -czvf "$MINIO_BACKUP_ARCHIVE" -C "$MINIO_BACKUP_DIR" .

echo "Backup archived at $MINIO_BACKUP_ARCHIVE" | tee -a "$MINIO_LOG_FILE"

rm -rf "$MINIO_BACKUP_DIR" 2>> "$MINIO_LOG_FILE"

echo "Minio backup process completed successfully!" | tee -a "$MINIO_LOG_FILE"
