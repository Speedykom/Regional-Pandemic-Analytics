#!/usr/bin/env bash
docker-compose down --remove-orphans
docker-compose build && clear
docker-compose -f docker-compose-staging.yml --env-file .env.staging up -d

echo "Running!"