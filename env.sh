#!/bin/bash

# Set Vault address and token
export VAULT_ADDR='http://127.0.0.1:8200'

#Read existing unseal keys and root token
echo "Reading existing unseal keys and root token..."
VAULT_SECRETS=$(cat ./vault/vault_secret.json)

UNSEAL_KEYS=$(echo "$VAULT_SECRETS" | jq -r '.keys_base64[]')

ROOT_TOKEN=$(echo "$VAULT_SECRETS" | jq -r '.root_token')

# Unseal Vault
echo "Unsealing Vault..."
COUNTER=0

for KEY in $UNSEAL_KEYS; do
    if [ $COUNTER -lt 4 ]; then
        docker exec -it vault-server sh -c "vault operator unseal '$KEY'"
        ((COUNTER++))
    fi
done

#Login to Vault
echo "Logging into Vault..."
docker exec -it vault-server sh -c "vault login '$ROOT_TOKEN'; exit"

#Enable kv secrets engine (if not already enabled)
echo "Enabling kv secrets engine..."
docker exec -it vault-server sh -c "vault secrets enable -path=kv kv 2>&1 | grep -q 'path kv/ is already in use' || true; exit"

#Read secrets from Vault and populate .env files
echo "Reading secrets from Vault and populating .env files..."

# Check Vault Seal Status
SEAL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/sys/seal-status")
if [ "$SEAL_STATUS" != "200" ]; then
    echo "Vault is sealed or inaccessible (HTTP status code $SEAL_STATUS)."
    exit 1
fi

# Set VAULT_TOKEN for script
export VAULT_TOKEN="$ROOT_TOKEN"

# read secrets from Vault and write to .env files
read_all_secrets() {
    local ENVIRONMENT="$1"  # Accepts 'dev', 'prod', or 'local'
    local FILENAME=".env.$ENVIRONMENT"

    SECRETS_JSON=$(curl -s -H "X-Vault-Token: $VAULT_TOKEN" -X GET "$VAULT_ADDR/v1/env/$ENVIRONMENT")
    if [[ $(echo "$SECRETS_JSON" | jq -r '.errors') != "null" ]]; then
        echo "Error fetching secrets from Vault for environment '$ENVIRONMENT':"
        echo "$SECRETS_JSON"
        exit 1
    fi
    echo "$SECRETS_JSON" | jq -r '.data | to_entries[] | .key + "=" + (.value | tostring)' > "$FILENAME"
    echo "Successfully populated $FILENAME file with secrets from Vault."
}

# write all secrets to .env files for each environment
read_all_secrets "dev"
read_all_secrets "prod"
read_all_secrets "local"

echo "All .env files populated successfully."
