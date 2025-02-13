#!/bin/bash

# This deployment script will read from cfg configuration file and adapt 
# repan to the provided configs.This script will first create a branch
# then change files locally. The developer at last should validate the 
# changes and push to the repository.

project_directory="../"


########################## Adapting variables ############################## 
############################################################################

echo "Reading variables from template.cfg"

CONFIG_FILE="template.cfg"
source $CONFIG_FILE

echo "Reading variables complete."


######################## Adapting local domains ############################ 
############################################################################

echo "Adapting local domains."

old_local_domain="igad.local"
new_local_domain=$local_domain
#find all old domains and change them with new domain
find "$project_directory" -type f -exec sed -i "s/$old_local_domain/$new_local_domain/g" {} +

echo "Adapting local domains complete."


######################### Adapting dev domains ############################# 
############################################################################

echo "Adapting dev domains."

old_dev_domain="igad-health.eu"
new_dev_domain=$dev_domain
find "$project_directory" -type f -exec sed -i "s/$old_dev_domain/$new_dev_domain/g" {} +

echo "Adapting dev domains complete."


######################### Adapting prod domains ############################ 
############################################################################

echo "Adapting prod domains."

old_local_domain="prod-igad.domain"
new_local_domain=$prod_domain
find "$project_directory" -type f -exec sed -i "s/$old_dev_domain/$new_local_domain/g" {} +

echo "Adapting prod domain complete."


######################## Adapting project name ############################# 
############################################################################

echo "Adapting project name and env variables"
# Changing Regionl Pandemic Analytics
old_project_name="Regional Pandemic Analytics"
new_project_name=$project_name
find "$project_directory" -type f -exec sed -i "s/$old_project_name/$new_project_name/gI" {} +

# Changing RePan
old_repan="repan"
new_word="$project_name_abbreviation"
find "$project_directory" -type f -exec sed -i "s/$old_repan/$new_word/gI" {} +

# Changing IGAD
old_igad="igad"
new_word="$project_name_abbreviation"
find "$project_directory" -type f -exec sed -i "s/$old_repan/$new_word/gI" {} +

echo "Adapting project name and variables complete."
