start-prod:
ifdef service
	@docker stop $(service) && docker rm $(service)
	@docker compose --env-file ./.env.prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build --force-recreate $(service)
else
	@docker compose --env-file ./.env.prod -f docker-compose.yml -f docker-compose.prod.yml down --remove-orphans
	@docker compose --env-file ./.env.prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build --force-recreate
endif

start-local:
ifdef service
	@docker stop $(service) && docker rm $(service)
	@docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml up $(service) -d --build --force-recreate $(service)
else
	@docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml down --remove-orphans
	@docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml  up -d --build --force-recreate
endif

start-dev:
ifdef service
	@docker stop $(service) && docker rm $(service)
	@docker compose --env-file ./.env.dev -f docker-compose.yml -f docker-compose.dev.yml up -d --build --force-recreate $(service)
else
	@docker compose --env-file ./.env.dev -f docker-compose.yml -f docker-compose.dev.yml down --remove-orphans
	@docker compose --env-file ./.env.dev -f docker-compose.yml -f docker-compose.dev.yml up -d --build --force-recreate
endif

destroy-prod:
	@docker compose --env-file ./.env.prod -f docker-compose.yml -f docker-compose.prod.yml down -v

destroy-local:
	@docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml down -v

destroy-dev:
	@docker compose --env-file ./.env.dev -f docker-compose.yml -f docker-compose.dev.yml down -v
