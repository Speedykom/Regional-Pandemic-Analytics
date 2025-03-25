# Deployment Script README

## Overview
This Bash script is designed to adapt the RePan project to a provided configuration by modifying domain names, project names, and other environment-specific variables based on values from a configuration file. The script automatically updates project files while excluding certain directories.

## Features
- Reads configuration values from `template.cfg`.
- Replaces old domain names (local, dev, and production) with new ones.
- Updates the project name and related variables.
- Uses a `replace` function to find and replace text while excluding specified directories.

## Prerequisites
- Bash shell environment (Linux/macOS)
- `sed` and `find` utilities
- A valid `template.cfg` file containing necessary variables

## Configuration File
The script reads configuration values from `template.cfg`. This file should define the following variables:
```bash
local_domain="your.local.domain"
dev_domain="your.dev.domain"
prod_domain="your.prod.domain"
project_name="Your Project Name"
project_name_abbreviation="Your Abbreviation"
```

## Usage
1. Ensure `template.cfg` is correctly configured.
2. Run the script:
   ```bash
   ./deploy.sh
   ```
3. Review the changes and commit them manually.

## Exclusions
The script avoids modifying files in the following directories:
- `.git/`
- `repan-adapt/`

## Notes
- This script modifies files in the project directory (`../`). Ensure you have a backup or use version control before running it.
- After execution, manually validate the changes and commit them to your repository.

