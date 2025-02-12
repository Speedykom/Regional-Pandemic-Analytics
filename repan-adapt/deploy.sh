#!/bin/bash

# This deployment script will read from INI configuration file and adapt repan to the provided configs
# This script will first create a branch then change files locally. The developer at last should 
# validate the changes and push to the repository.

CONFIG_FILE="template.cfg"

source $CONFIG_FILE

echo $project_name
