# Regional-Pandemic-Analytics

RePan: A regional pandemic analytics tool to collect, analyze, and report granular and aggregated data from multiple sources for informed decision-making.

# What is RePan

RePan is a state-of-the-art regional pandemic analytics tool that provides high-level insights into the pandemic situation across multiple countries. It allows decision-makers to monitor and manage the pandemic situation with a high level of granularity and aggregated data. The tool can analyze data from diverse sources, including hospital admission rates, mortality rates, test positivity rates, and vaccination rates.
RePan's advanced data analysis algorithms enable decision-makers to identify trends and patterns in the pandemic situation across different countries. The tool provides insights into the effectiveness of existing measures and identifies areas that require immediate attention.
RePan's user-friendly interface enables decision-makers to access high-level insights and also view detailed and granular data for each country. This level of granularity empowers decision-makers to make informed decisions that are specific to the situation in each country.
RePan is a game-changer, providing decision-makers with a reliable and efficient way to monitor and manage the pandemic situation at a regional level while still allowing for a granular view of the data within each country.

# Makefile

The Makefile contains alias for basic commands, these commands need .env files generated before

- `make start-local` to start the cluster locally
- `make start-local service=nginx` to restart a specific service (in this example nginx)
- `make start` to start the cluster in dev server
- `make start service=nginx` to restart a specific service (in this example nginx)
- `make destroy` to remove volumes

# Local development

To run the cluster, on local environment:

1. run `sudo ./add-local-hosts
` to add containers domain name to your /etc/hosts
2. generate ssl self-signed certificates with `./gen-local-certs`
3. If the output from the previous command tells you so, install the `myCA.pem` certificate into your system's certificate store
4. run `make start-local` to start the cluster
5. open keycloak interface and add a new user

## Environment variables

The services rely on a few environment variables. Important ones include:

- `DJANGO_DEBUG` – set to `True` to enable Django debug mode.
- `DJANGO_ALLOWED_HOSTS` – comma separated list of allowed hosts for Django.
- `KEYCLOAK_VERIFY_SSL` – set to `False` to skip TLS verification when talking to Keycloak.
- `DRUID_VERIFY_SSL` – controls TLS verification for requests to Druid.
- `SUPERSET_VERIFY_SSL` – controls TLS verification in Superset/Keycloak integration.

## Domain Names

### Local domains

- [keycloak.igad.local](https://keycloak.igad.local "keyclaok.igad.local") for keycloak web console
- [frontend.igad.local](https://frontend.igad.local "front.igad.local") for frontend
- [superset.igad.local](https://superset.igad.local "keyclaok.igad.local") for superset web console
- [airflow.igad.local](https://airflow.igad.local "airflow.igad.local") for airflow web console
- [druid.igad.local](https://druid.igad.local "druid.igad.local") for keycloak web console
- [coordinator.igad.local](https://coordinator.igad.local "coordinator.igad.local") for druid coordinator
- [console.minio.igad.local](https://minio.igad.local "minio.igad.local") for minio web console
- [minio.igad.local](https://minio.igad.local "minio.igad.local") for minio API

### Dev Server domains

- [analytics2.repan.info](https://analytics2.repan.info) for Superset
- [coordinator2.repan.info](https://coordinator2.repan.info) for Druid API
- [db2.repan.info](https://db2.repan.info) for Druid
- [auth2.repan.info](https://auth2.repan.info) for Keycloak
- [orchestration2.repan.info](https://orchestration2.repan.info) for Airflow
- [cache2.repan.info](https://cache2.repan.info) for Minio
- [data2.repan.info](https://data2.repan.info) for Backend
- [home2.repan.info](https://home2.repan.info) for Frontend
