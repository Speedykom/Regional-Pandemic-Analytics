#!/bin/bash

if ! [ -x "$(command -v docker compose)" ]; then
  echo 'Error: docker compose is not installed.' >&2
  exit 1
fi

rsa_key_size=4096
data_path="./certbot"
email="hamza@speedykom.de" # Adding a valid address is strongly recommended
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

domain_names=(analytics2.igad-health.eu coordinator2.igad-health.eu db2.igad-health.eu integration2.igad-health.eu auth2.igad-health.eu data2.igad-health.eu orchestration2.igad-health.eu cache2.igad-health.eu console.cache2.igad-health.eu home2.igad-health.eu mediator2.igad-health.eu console2.igad-health.eu)
#Geneate certificates for each service
for domains in "${domain_names[@]}"; do

  if [ -d "$data_path" ]; then
    read -p "Existing data found for $domains. Continue and replace existing certificate? (y/N) " decision
    if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
      continue
    fi
  fi


  if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
    echo "### Downloading recommended TLS parameters ..."
    mkdir -p "$data_path/conf"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
    echo
  fi

  echo "### Creating dummy certificate for $domains ..."
  path="/etc/letsencrypt/live/$domains"
  mkdir -p "$data_path/conf/live/$domains"
  docker compose --env-file ./.env -f docker-compose.yml -f docker-compose.dev.yml run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
      -keyout '$path/privkey.pem' \
      -out '$path/fullchain.pem' \
      -subj '/CN=localhost'" certbot
  echo


  echo "### Starting nginx ..."
  docker compose --env-file ./.env -f docker-compose.yml -f docker-compose.dev.yml  up --force-recreate -d nginx
  echo

  echo "### Deleting dummy certificate for $domains ..."
  docker compose  --env-file ./.env -f docker-compose.yml -f docker-compose.dev.yml run --rm --entrypoint "\
    rm -Rf /etc/letsencrypt/live/$domains && \
    rm -Rf /etc/letsencrypt/archive/$domains && \
    rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot
  echo


  echo "### Requesting Let's Encrypt certificate for $domains ..."
  #Join $domains to -d args
  domain_args=""
  for domain in "${domains[@]}"; do
    domain_args="$domain_args -d $domain"
  done

  # Select appropriate email arg
  case "$email" in
    "") email_arg="--register-unsafely-without-email" ;;
    *) email_arg="--email $email" ;;
  esac

  # Enable staging mode if needed
  if [ $staging != "0" ]; then staging_arg="--staging"; fi

  docker compose  --env-file ./.env -f docker-compose.yml -f docker-compose.dev.yml run --rm --entrypoint "\
    certbot certonly --cert-name $domains --webroot -w /var/www/certbot \
      $staging_arg \
      $email_arg \
      $domain_args \
      --rsa-key-size $rsa_key_size \
      --agree-tos \
      --force-renewal" certbot
  echo

  echo "### Reloading nginx ..."
  docker compose exec nginx nginx -s reload

done