#!/bin/bash

# This deployment script will read from INI configuration file and adapt repan to the provided configs
# This script will first create a branch then change files locally. The developer at last should 
# validate the changes and push to the repository.

INI_CONFIG_FILE="template.ini"

# Function to read the ini file and export variables
function parse_ini() {
    local section=""
    while IFS='=' read -r key value; do
        key=$(echo "$key" | tr -d ' ')  # Remove spaces
        value=$(echo "$value" | tr -d ' ')
        
        if [[ $key =~ ^\[.*\]$ ]]; then
            section=$(echo "$key" | tr -d '[]')  # Extract section name
        elif [[ -n "$key" && -n "$value" ]]; then
            var_name="${section}_${key}"  # Combine section and key
            eval "$var_name=\"$value\""  # Store variable
        fi
    done < <(grep -v '^\s*#' "$INI_CONFIG_FILE" | grep -v '^\s*$')  # Remove comments and empty lines
}

parse_ini

