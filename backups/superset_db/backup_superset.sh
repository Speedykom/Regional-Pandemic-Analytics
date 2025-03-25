#!/bin/bash

SUPERSET_LOG_FILE="/opt/airflow/superset_db/backup_logs/backup_$(date +%Y-%m-%d).log"
mkdir -p "/opt/airflow/superset_db/backup_logs"
touch "$SUPERSET_LOG_FILE"

SUPERSET_BACKUP_DIR="/opt/airflow/superset_db/backup_superset"
SUPERSET_BACKUP_ARCHIVE="/opt/airflow/superset_db/backup_superset/backup_$(date +%Y-%m-%d)_superset_db.tar.gz"

if [ -z "$SUPERSET_POSTGRES_USER" ] || [ -z "$SUPERSET_POSTGRES_DB" ] || [ -z "$SUPERSET_POSTGRES_HOST" ]; then
  echo "Required environment variables are not set. Check your .env file." | tee -a "$SUPERSET_LOG_FILE"
  exit 1
fi

echo "Creating backup directory at $SUPERSET_BACKUP_DIR..." | tee -a "$SUPERSET_LOG_FILE"
mkdir -p "$SUPERSET_BACKUP_DIR"

# DB backup
echo "Dumping Superset database to $SUPERSET_BACKUP_DIR/db_backup_$(date +%Y-%m-%d)_superset_db.sql..." | tee -a "$SUPERSET_LOG_FILE"
PGPASSWORD="$SUPERSET_POSTGRES_PASSWORD" pg_dump -U "$SUPERSET_POSTGRES_USER" -h "$SUPERSET_POSTGRES_HOST" -d "$SUPERSET_POSTGRES_DB" > "$SUPERSET_BACKUP_DIR/db_backup_$(date +%Y-%m-%d)_superset_db.sql" 2>> "$SUPERSET_LOG_FILE"

echo "Compressing backup directory into $SUPERSET_BACKUP_ARCHIVE..." | tee -a "$SUPERSET_LOG_FILE"
tar -czvf "$SUPERSET_BACKUP_ARCHIVE" -C "$SUPERSET_BACKUP_DIR" db_backup_$(date +%Y-%m-%d)_superset_db.sql 2>> "$SUPERSET_LOG_FILE"

if [ $? -ne 0 ]; then
  echo "Failed to compress backup!" | tee -a "$SUPERSET_LOG_FILE"
  exit 1
fi
echo "Backup compressed successfully into $SUPERSET_BACKUP_ARCHIVE!" | tee -a "$SUPERSET_LOG_FILE"

rm -f "$SUPERSET_BACKUP_DIR/db_backup_$(date +%Y-%m-%d)_superset_db.sql" 2>> "$SUPERSET_LOG_FILE"

echo "Superset_db backup process completed successfully!" | tee -a "$SUPERSET_LOG_FILE"
