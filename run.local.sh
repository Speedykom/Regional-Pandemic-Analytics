#!/usr/bin/env bash
if [ -z "$1" ]
then
    docker-compose -f docker-compose.yml -f docker-compose.local.yml down --remove-orphans
    docker-compose -f docker-compose.yml -f docker-compose.local.yml --env-file ./.env.local build && clear
    docker-compose -f docker-compose.yml -f docker-compose.local.yml --env-file ./.env.local up -d
else
    docker stop $1 && docker rm $1
    docker-compose -f docker-compose.yml -f docker-compose.local.yml --env-file ./.env.local build $1 && clear
    docker-compose -f docker-compose.yml -f docker-compose.local.yml --env-file ./.env.local up -d $1
fi
echo "Running!"