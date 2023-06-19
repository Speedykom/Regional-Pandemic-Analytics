#!/usr/bin/env bash
docker-compose down --remove-orphans
docker-compose -f docker-compose.local.yml build && clear
docker-compose -f docker-compose.local.yml --env-file ./.env.local up -d

echo "Running!"