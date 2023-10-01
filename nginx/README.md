# Nginx Config

This README will help you set up the server on which nginx running

## How Nginx is working

Nginx will automatically fail if one of the web-console is not running / healthy yet: for this reason in the docker-compose.yml for nginx service you will notice that nginx depends on other services

## How gen-letsencrypt-certs.sh works 

when you run the script you will need to specify the env file

example:
```bash
./gen-letsencrypt-certs.sh ./.env.dev
```

Mainly the script will generate self-signed certificates so Nginx could start without failing: in the nginx services configuration you can see that we specify the location of ssl keys

Then, these certs will be deleted and will be overwritten by the ones requested from letsencrypt: you can notice that we have a **location** in the **http server** in the configuration of nginx

## How the ssl certificates are re-generated:
To do so, we added a container named certbot in the docker-compose.dev.yml and the docker-compose.prod.yml. Mainly what it does is to check the status of the certificate every 12h and it will try to re-sign it if it's needed: a directory between nginx and certbot is shared over docker volume
 
Check this [link](https://pentacent.medium.com/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71) for reference.

## Nginx cronjobs
Nginx needs to reload configuration so he can pick the new signed certificates, to do so we tried to implement a cronjob inside the nginx container but we failed, we also tried to run a while true loop in the background inside the container to reload config every 6h but we also failed, so we opted to make a cron job that will docker exec the nginx command every 6h
Let's suppose the project is on the home directory of a user named **user**
create a cronjob by:
```bash
crontab -e
```
and add the following line:
```bash
0 */6 * * * cd /home/user/Regional-Pandemic-Analytics && docker compose --env-file ./.env.dev -f docker-compose.yml -f docker-compose.dev.yml exec -d nginx nginx -s reload
```
