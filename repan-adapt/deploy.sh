#!/bin/bash

# This deployment script will read from cfg configuration file and adapt repan to the provided configs
# This script will first create a branch then change files locally. The developer at last should 
# validate the changes and push to the repository.


# loading variables
CONFIG_FILE="template.cfg"
source $CONFIG_FILE
echo "Reading variables complete."

project_directory="../"

# Adapting local domains
echo "Adapting local domains."
old_local_domain="igad.local"
new_local_domain=$local_domain
#find all old domains and change them with new domain
find "$project_directory" -type f -exec sed -i "s/$old_local_domain/$new_local_domain/g" {} +
echo "Adapting local domains complete."

# Adapting dev domains
echo "Adapting dev domains."
old_dev_domain="igad-health.eu"
new_dev_domain=$local_domain
#find all old domains and change them with new domain
find "$project_directory" -type f -exec sed -i "s/$old_dev_domain/$new_dev_domain/g" {} +
echo "Adapting dev domains complete."

# Adapting prod domains
echo "Adapting prod domains."
old_local_domain="prod-igad.domain"
new_local_domain=$local_domain
#find all old domains and change them with new domain
find "$project_directory" -type f -exec sed -i "s/$old_dev_domain/$new_local_domain/g" {} +
echo "Adapting prod domain complete."


#find all old domains and change them with new domain

