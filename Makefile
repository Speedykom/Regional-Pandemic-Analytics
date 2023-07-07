start-local:
ifdef service
    @docker stop $(service) && docker rm $(service)
    @docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml up $(service) -d --build --force-recreate $(service)
else
    @docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml down --remove-orphans
    @docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml  up -d --build --force-recreate
endif
start:
ifdef service
    @docker stop $(service) && docker rm $(service)
    @docker compose --env-file ./.env -f docker-compose.yml up -d $(service)
else
    @docker compose --env-file ./.env -f docker-compose.yml down --remove-orphans
    @docker compose --env-file ./.env -f docker-compose.yml up -d
endif
destroy:
    @docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml down -v
