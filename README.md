# Regional-Pandemic-Analytics
RePan: A regional pandemic analytics tool to collect, analyze, and report granular and aggregated data from multiple sources for informed decision-making.

# What is RePan
RePan is a state-of-the-art regional pandemic analytics tool that provides high-level insights into the pandemic situation across multiple countries. It allows decision-makers to monitor and manage the pandemic situation with a high level of granularity and aggregated data. The tool can analyze data from diverse sources, including hospital admission rates, mortality rates, test positivity rates, and vaccination rates.
RePan's advanced data analysis algorithms enable decision-makers to identify trends and patterns in the pandemic situation across different countries. The tool provides insights into the effectiveness of existing measures and identifies areas that require immediate attention.
RePan's user-friendly interface enables decision-makers to access high-level insights and also view detailed and granular data for each country. This level of granularity empowers decision-makers to make informed decisions that are specific to the situation in each country.
RePan is a game-changer, providing decision-makers with a reliable and efficient way to monitor and manage the pandemic situation at a regional level while still allowing for a granular view of the data within each country.

# Makefile
The Makefile contains alias for basic commands
- `make start-local` to start the cluster locally
- `make start-local service=nginx` to restart a specific service (in this example nginx) 
- `make start` to start the cluster in dev server
- `make start service=nginx` to restart a specific service (in this example nginx) 
- `make destroy` to remove volumes

# Local development
To run the cluster, on local environment:
1. run `sudo ./add-local-hosts
` to add containers domain name to your /etc/hosts
2. generate ssl self-signed certificates with `./gen-cert`
3. run `make start-local` to start the cluster
4. open keycloak interface and add a new user

## Domain Names
- [keyclaok.igad.local](https://keycloak.igad.local "keyclaok.igad.local") for keycloak web console
- [frontend.igad.local](https://frontend.igad.local "front.igad.local") for frontend
- [superset.igad.local](https://superset.igad.local "keyclaok.igad.local") for superset web console
- [airflow.igad.local](https://airflow.igad.local "airflow.igad.local") for airflow web console
- [hop.igad.local](https://hop.igad.local "hop.igad.local") for hop web console
- [druid.igad.local](https://druid.igad.local "druid.igad.local") for keycloak web console
- [console.minio.igad.local](https://druid.igad.local "druid.igad.local") for minio web console
