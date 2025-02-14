#!/bin/bash

# This deployment script will read from cfg configuration file and adapt 
# RePan to the provided configs.This script will first create a branch
# then change files locally. The developer at last should validate the 
# changes and push to the repository.

project_directory="../"
exclude_list=(".git/*" "repan-adapt/*" "no/*")

replace() {
    local old_var="$1"
    local new_var="$2"

    # Build the find command with exclusions
    local find_cmd="find \"$project_directory\" -type f"

    for exclude in "${exclude_list[@]}"; do
        find_cmd+=" -not -path \"$project_directory$exclude\""
    done

    find_cmd+=" -exec sed -i \"s/$old_var/$new_var/gI\" {} +"
    # Execute the command
    eval "$find_cmd"
}


########################## Reading variables ############################## 
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
replace $old_local_domain $new_local_domain
echo "Adapting local domains complete."


######################### Adapting dev domains ############################# 
############################################################################

echo "Adapting dev domains."

old_dev_domain="igad-health.eu"
new_dev_domain=$dev_domain
replace $old_dev_domain $new_dev_domain
echo "Adapting dev domains complete."


######################### Adapting prod domains ############################ 
############################################################################

echo "Adapting prod domains."

old_prod_domain="repan.com"
new_prod_domain=$prod_domain
replace $old_prod_domain $new_prod_domain
echo "Adapting prod domain complete."


######################## Adapting project name ############################# 
############################################################################

echo "Adapting project name and env variables"
# Changing Regionl Pandemic Analytics
old_project_name="RegionaL Pandemic Analytics"
new_project_name=$project_name
echo $project_name
replace $old_project_name $new_project_name
# Changing REPAN
old_repan="REPAN"
new_word="$project_name_abbreviation"
replace $old_repan $new_word
# Changing igad
old_igad="igad"
replace $old_igad $new_word

echo "Adapting project name and variables complete."
