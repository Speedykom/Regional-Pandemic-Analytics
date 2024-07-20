#!/bin/bash

# Check if an argument (the .env file path) was provided
if [ $# -eq 0 ]; then
  echo "Usage: $0 <path to .env file>"
  exit 1
fi

# Get the path to the .env file from the first argument
ENV_FILE="$1"

# Check if the .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "$ENV_FILE does not exist."
  exit 1
fi

# Load environment variables from the provided .env file
source "$ENV_FILE"

if [ "$NGINX_ENV" == "dev" ]; then
  docker_composefile=docker-compose.dev.yml
else
  docker_composefile=docker-compose.prod.yml
fi

if ! [ -x "$(command -v docker)" ]; then
  echo 'Error: docker is not installed.' >&2
  exit 1
fi

rsa_key_size=4096
data_path="./certbot"
email="hamza@speedykom.de" # Adding a valid address is strongly recommended
staging=0                  # Set to 1 if you're testing your setup to avoid hitting request limits

if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf >"$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem >"$data_path/conf/ssl-dhparams.pem"
  echo
fi
domain_names=($NGINX_FRONTEND_DOMAIN_NAME $NGINX_BACKEND_DOMAIN_NAME $NGINX_KEYCLOAK_DOMAIN_NAME $NGINX_MINIO_DOMAIN_NAME $NGINX_CONSOLE_MINIO_DOMAIN_NAME $NGINX_SUPERSET_DOMAIN_NAME $NGINX_SUPERSET_GUEST_DOMAIN_NAME $NGINX_AIRFLOW_DOMAIN_NAME $NGINX_DRUID_DOMAIN_NAME $NGINX_DRUID_COORDINATOR_DOMAIN_NAME)
#Geneate certificates for each service
for domain in "${domain_names[@]}"; do

  if [ -d "$data_path" ]; then
    read -p "Existing data found for $domain. Continue and replace existing certificate? (y/N) " decision
    if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
      continue
    fi
  fi

  echo "### Creating dummy certificate for $domain ..."
  path="/etc/letsencrypt/live/$domain"
  mkdir -p "$data_path/conf/live/$domain"
  docker compose --env-file $ENV_FILE -f docker-compose.yml -f $docker_composefile run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
      -keyout '$path/privkey.pem' \
      -out '$path/fullchain.pem' \
      -subj '/CN=localhost'" certbot
  echo

done

echo "### Starting nginx ..."
docker compose --env-file $ENV_FILE -f docker-compose.yml -f $docker_composefile up --force-recreate -d nginx
echo

for domain in "${domain_names[@]}"; do

  echo "### Deleting dummy certificate for $domain ..."
  docker compose --env-file $ENV_FILE -f docker-compose.yml -f $docker_composefile run --rm --entrypoint "\
    rm -Rf /etc/letsencrypt/live/$domain && \
    rm -Rf /etc/letsencrypt/archive/$domain && \
    rm -Rf /etc/letsencrypt/renewal/$domain.conf" certbot
  echo
done

echo "### Requesting Let's Encrypt certificate for $domains ..."

# Select appropriate email arg
case "$email" in
"") email_arg="--register-unsafely-without-email" ;;
*) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

for domain in "${domain_names[@]}"; do
  docker compose --env-file $ENV_FILE -f docker-compose.yml -f $docker_composefile run --rm --entrypoint "\
  certbot certonly -v --cert-name $domain --webroot -w /var/www/certbot \
      $staging_arg \
      $email_arg \
      -d $domain \
      --rsa-key-size $rsa_key_size \
      --agree-tos \
      --force-renewal" certbot
  echo
done

echo "### Reloading nginx ..."
docker compose --env-file $ENV_FILE -f docker-compose.yml -f $docker_composefile exec nginx nginx -s reload
