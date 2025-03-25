#!/bin/bash

KEYCLOAK_LOG_FILE="/opt/airflow/keycloak_db/backup_logs/backup_$(date +%Y-%m-%d).log"
mkdir -p "/opt/airflow/keycloak_db/backup_logs"
touch "$KEYCLOAK_LOG_FILE"

KEYCLOAK_BACKUP_DIR="/opt/airflow/keycloak_db/backup_keycloak"
KEYCLOAK_BACKUP_ARCHIVE="$KEYCLOAK_BACKUP_DIR/backup_$(date +%Y-%m-%d)_keycloak-pg.tar.gz"

if [ -z "$KEYCLOAK_POSTGRES_USER" ] || [ -z "$KEYCLOAK_POSTGRES_DB" ] || [ -z "$KEYCLOAK_DB_URL_HOST" ]; then
  echo "Required environment variables are not set. Check your .env file." | tee -a "$KEYCLOAK_LOG_FILE"
  exit 1
fi

echo "Creating backup directory at $KEYCLOAK_BACKUP_DIR..." | tee -a "$KEYCLOAK_LOG_FILE"
mkdir -p "$KEYCLOAK_BACKUP_DIR"

# DB backup
echo "Dumping Keycloak database to $KEYCLOAK_BACKUP_DIR/db_backup_$(date +%Y-%m-%d)_keycloak-pg.sql..." | tee -a "$KEYCLOAK_LOG_FILE"
PGPASSWORD="$KEYCLOAK_POSTGRES_PASSWORD" pg_dump -U "$KEYCLOAK_POSTGRES_USER" -h "$KEYCLOAK_DB_URL_HOST" -d "$KEYCLOAK_POSTGRES_DB" > "$KEYCLOAK_BACKUP_DIR/db_backup_$(date +%Y-%m-%d)_keycloak-pg.sql" 2>> "$KEYCLOAK_LOG_FILE"

echo "Compressing backup directory into $KEYCLOAK_BACKUP_ARCHIVE..." | tee -a "$KEYCLOAK_LOG_FILE"
tar -czvf "$KEYCLOAK_BACKUP_ARCHIVE" -C "$KEYCLOAK_BACKUP_DIR" db_backup_$(date +%Y-%m-%d)_keycloak-pg.sql 2>> "$KEYCLOAK_LOG_FILE"

if [ $? -ne 0 ]; then
  echo "Failed to compress backup!" | tee -a "$KEYCLOAK_LOG_FILE"
  exit 1
fi
echo "Backup compressed successfully into $KEYCLOAK_BACKUP_ARCHIVE!" | tee -a "$KEYCLOAK_LOG_FILE"

rm -f "$KEYCLOAK_BACKUP_DIR/db_backup_$(date +%Y-%m-%d)_keycloak-pg.sql" 2>> "$KEYCLOAK_LOG_FILE"

echo "Keycloak-pg backup process completed successfully!" | tee -a "$KEYCLOAK_LOG_FILE"
