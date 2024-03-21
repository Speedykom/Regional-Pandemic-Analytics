# Our services
service_table="frontend backend airflow druid keycloak minio console.minio guest.superset superset openhim console.openhim coordinator"

# Geneate certificates for each service
for service in $service_table; do
    directory="$service.igad.local"
    if [ -d "$directory" ]; then
        echo "$directory already exists."
    else
        mkdir "$directory"
        echo "Created $directory directory."
        # Continue with certificate generation for this service
        openssl genrsa -out "$directory/privkey.pem" 2048
        openssl req -new -key "$directory/privkey.pem" -out "$directory/$service.csr" \
            -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$service/"

        cat >"$directory/$service.ext" <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $service.igad.local
EOF

        openssl x509 -req -in "$directory/$service.csr" -CA myCA.pem -CAkey myCA.key -CAcreateserial \
            -out "$directory/fullchain.pem" -days 825 -sha256 -extfile "$directory/$service.ext"
    fi
done
read