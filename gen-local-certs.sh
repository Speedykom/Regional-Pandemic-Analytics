#!/bin/sh

#Company details
country=TN
state=TN
locality=TN
organization=Speedykom
organizationalunit=IT

#Where the certs would be generated
cd ./certbot/conf/live
#Generate CA and CAkey if they don't already exist
CA=myCA.pem
commonname=myCA
if test -f "$CA"; then
    echo "$FILE already exists."
else 
    openssl genrsa -out myCA.key 2048
    openssl req -x509 -new -nodes -key myCA.key -sha256 -days 1825 -out myCA.pem \
         -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/"
    echo files generated!
fi

#Our services
service_table="frontend backend airflow druid hop keycloak minio console-minio superset openhim console-openhim"
#Geneate certificates for each service
for service in $service_table; do
commonname=$service
mkdir $service.igad.local
openssl genrsa -out $service.igad.local/privkey.pem 2048
openssl req -new -key $service.igad.local/privkey.pem -out $service.igad.local/$service.csr \
    -subj "/C=$country/1=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/"

cat > $service.igad.local/$service.ext << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $service
EOF

openssl x509 -req -in $service.igad.local/$service.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial \
-out $service.igad.local/fullchain.pem -days 825 -sha256 -extfile $service.igad.local/$service.ext
done
