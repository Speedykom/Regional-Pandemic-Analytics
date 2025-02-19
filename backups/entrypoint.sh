#!/bin/bash

airflow users create --role Admin --username ${BACKUP_ADMIN_USER} --email ${BACKUP_ADMIN_EMAIL} --firstname ${BACKUP_ADMIN_FIRSTNAME} --lastname ${BACKUP_ADMIN_LASTNAME} --password ${BACKUP_ADMIN_PASSWORD}

airflow scheduler
