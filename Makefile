start-prod:
	@docker network inspect backup_network >/dev/null 2>&1 || docker network create --driver bridge backup_network
ifdef service
	@docker stop $(service) && docker rm $(service)
	@docker compose --env-file ./.env.prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build --force-recreate $(service)
	@docker compose --env-file ./.env.prod -f ./backups/docker-compose-backups.yml up -d
else
	@docker compose --env-file ./.env.prod -f docker-compose.yml -f docker-compose.prod.yml down --remove-orphans
	@docker compose --env-file ./.env.prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build --force-recreate
	@docker compose --env-file ./.env.prod -f ./backups/docker-compose-backups.yml up -d
endif

start-local:
	@docker network inspect backup_network >/dev/null 2>&1 || docker network create --driver bridge backup_network
ifdef service
	@docker stop $(service) && docker rm $(service)
	@docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml up $(service) -d --build --force-recreate $(service)
else
	@docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml down --remove-orphans
	@docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml  up -d --build --force-recreate
endif
ifeq ($(BACKUP),1)
	@sed -i 's/\r$//' ./backups/*_db/*.sh
	@docker compose --env-file ./.env.local -f ./backups/docker-compose-backups.local.yml up -d
endif

start-dev:
	@docker network inspect backup_network >/dev/null 2>&1 || docker network create --driver bridge backup_network
ifdef service
	@docker stop $(service) && docker rm $(service)
	@docker compose --env-file ./.env.dev -f docker-compose.yml -f docker-compose.dev.yml up -d --build --force-recreate $(service)
	@docker compose --env-file ./.env.dev -f ./backups/docker-compose-backups.yml up -d
else
	@docker compose --env-file ./.env.dev -f docker-compose.yml -f docker-compose.dev.yml down --remove-orphans
	@docker compose --env-file ./.env.dev -f docker-compose.yml -f docker-compose.dev.yml up -d --build --force-recreate
	@docker compose --env-file ./.env.dev -f ./backups/docker-compose-backups.yml up -d
endif

destroy-prod:
	@docker compose --env-file ./.env.prod -f docker-compose.yml -f docker-compose.prod.yml down -v
	@docker compose --env-file ./.env.prod -f ./backups/docker-compose-backups.yml down -v

destroy-local:
	@docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml down -v
	@docker compose --env-file ./.env.local -f ./backups/docker-compose-backups.yml down -v

destroy-dev:
	@docker compose --env-file ./.env.dev -f docker-compose.yml -f docker-compose.dev.yml down -v
	@docker compose --env-file ./.env.dev -f ./backups/docker-compose-backups.yml down -v
