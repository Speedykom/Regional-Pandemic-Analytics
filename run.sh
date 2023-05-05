#!/usr/bin/env bash
docker-compose down --remove-orphans
docker-compose build && clear
docker-compose up -d
docker exec -it hop ./watchFiles.sh

echo "Running!"