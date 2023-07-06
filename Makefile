up:
ifdef service
	@docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml  up -d --build --force-recreate $(service)
else
	@docker compose --env-file ./.env.local -f docker-compose.yml -f docker-compose.local.yml  up -d --build --force-recreate
endif
