#!/bin/sh

#Company details
country=TN
state=TN
locality=TN
organization=Speedykom
organizationalunit=IT
email=ala-hmz@outlook.com
password=dummypassword

#Where the certs would be generated
cd nginx/certificates

#Generate CA and CAkey if they don't already exist
CA=myCA.pem
if test -f "$CA"; then
    echo "$FILE already exists."
else 
    openssl genrsa -out myCA.key 2048
    openssl req -x509 -new -nodes -key myCA.key -sha256 -days 1825 -out myCA.pem \
         -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/emailAddress=$email"
    echo files generated!

fi

#Our services
service_table="frontend backend airflow druid hop keycloak storage superset"
#Geneate certificates for each service
for service in $service_table; do
commonname=$service
openssl genrsa -out $service.key 2048
openssl req -new -key $service.key -out $service.csr \
    -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/emailAddress=$email"

cat > $service.ext << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $service
EOF

openssl x509 -req -in $service.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial \
-out $service.crt -days 825 -sha256 -extfile $service.ext
done