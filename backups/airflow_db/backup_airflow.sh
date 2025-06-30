#!/bin/bash

AIRFLOW_LOG_FILE="/opt/airflow/airflow_db/backup_logs/backup_$(date +%Y-%m-%d).log"
mkdir -p "/opt/airflow/airflow_db/backup_logs"
touch "$AIRFLOW_LOG_FILE"

AIRFLOW_BACKUP_DIR="/opt/airflow/airflow_db/backup_airflow"
AIRFLOW_BACKUP_ARCHIVE="/opt/airflow/airflow_db/backup_airflow/backup_$(date +%Y-%m-%d)_airflow_db.tar.gz"

if [ -z "$AIRFLOW_POSTGRES_USER" ] || [ -z "$AIRFLOW_POSTGRES_DB" ] || [ -z "$AIRFLOW_POSTGRES_HOST" ]; then
  echo "Required environment variables are not set. Check your .env file." | tee -a "$AIRFLOW_LOG_FILE"
  exit 1
fi

echo "Creating backup directory at $AIRFLOW_BACKUP_DIR..." | tee -a "$AIRFLOW_LOG_FILE"
mkdir -p "$AIRFLOW_BACKUP_DIR"

# DB backup
echo "Dumping Airflow database to $AIRFLOW_BACKUP_DIR/backup_$(date +%Y-%m-%d)_airflow_db.sql..." | tee -a "$AIRFLOW_LOG_FILE"
PGPASSWORD="$AIRFLOW_POSTGRES_PASSWORD" pg_dump -U "$AIRFLOW_POSTGRES_USER" -h "$AIRFLOW_POSTGRES_HOST" -d "$AIRFLOW_POSTGRES_DB" > "$AIRFLOW_BACKUP_DIR/backup_$(date +%Y-%m-%d)_airflow_db.sql" 2>> "$AIRFLOW_LOG_FILE"

echo "Compressing backup directory into $AIRFLOW_BACKUP_ARCHIVE..." | tee -a "$AIRFLOW_LOG_FILE"
tar -czvf "$AIRFLOW_BACKUP_ARCHIVE" -C "$AIRFLOW_BACKUP_DIR" backup_$(date +%Y-%m-%d)_airflow_db.sql 2>> "$AIRFLOW_LOG_FILE"

if [ $? -ne 0 ]; then
  echo "Failed to compress backup!" | tee -a "$AIRFLOW_LOG_FILE"
  exit 1
fi
echo "Backup compressed successfully into $AIRFLOW_BACKUP_ARCHIVE!" | tee -a "$AIRFLOW_LOG_FILE"

rm -f "$AIRFLOW_BACKUP_DIR/backup_$(date +%Y-%m-%d)_airflow_db.sql" 2>> "$AIRFLOW_LOG_FILE"

echo "Airflow-pg backup process completed successfully!" | tee -a "$AIRFLOW_LOG_FILE"
