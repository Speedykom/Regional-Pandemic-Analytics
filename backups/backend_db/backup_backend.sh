#!/bin/bash

BACKEND_LOG_FILE="/opt/airflow/backend_db/backup_logs/backup_$(date +%Y-%m-%d).log"
mkdir -p "/opt/airflow/backend_db/backup_logs"
touch "$BACKEND_LOG_FILE"

BACKEND_BACKUP_DIR="/opt/airflow/backend_db/backup_backend"
BACKEND_BACKUP_ARCHIVE="/opt/airflow/backend_db/backup_backend/backup_$(date +%Y-%m-%d)_backend_db.tar.gz"

if [ -z "$BACKEND_DB_USER" ] || [ -z "$BACKEND_DB_NAME" ] || [ -z "$BACKEND_DB_HOST" ]; then
  echo "Required environment variables are not set. Check your .env file." | tee -a "$BACKEND_LOG_FILE"
  exit 1
fi

echo "Creating backup directory at $BACKEND_BACKUP_DIR..." | tee -a "$BACKEND_LOG_FILE"
mkdir -p "$BACKEND_BACKUP_DIR"

# DB backup
echo "Dumping Backend database to $BACKEND_BACKUP_DIR/db_backup_$(date +%Y-%m-%d)_backend_db.sql..." | tee -a "$BACKEND_LOG_FILE"
PGPASSWORD="$BACKEND_DB_PASSWORD" pg_dump -U "$BACKEND_DB_USER" -h "$BACKEND_DB_HOST" -d "$BACKEND_DB_NAME" > "$BACKEND_BACKUP_DIR/db_backup_$(date +%Y-%m-%d)_backend_db.sql" 2>> "$BACKEND_LOG_FILE"

echo "Compressing backup directory into $BACKEND_BACKUP_ARCHIVE..." | tee -a "$BACKEND_LOG_FILE"
tar -czvf "$BACKEND_BACKUP_ARCHIVE" -C "$BACKEND_BACKUP_DIR" db_backup_$(date +%Y-%m-%d)_backend_db.sql 2>> "$BACKEND_LOG_FILE"

if [ $? -ne 0 ]; then
  echo "Failed to compress backup!" | tee -a "$BACKEND_LOG_FILE"
  exit 1
fi
echo "Backup compressed successfully into $BACKEND_BACKUP_ARCHIVE!" | tee -a "$BACKEND_LOG_FILE"

rm -f "$BACKEND_BACKUP_DIR/db_backup_$(date +%Y-%m-%d)_backend_db.sql" 2>> "$BACKEND_LOG_FILE"

echo "Backend_db backup process completed successfully!" | tee -a "$BACKEND_LOG_FILE"
