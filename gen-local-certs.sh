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

    if
        command -v sudo 2 &
        >1 >>/dev/null && command -v trust 2 &
        >1 >>/dev/null
    then
        echo -n "Installing local CA certificate to system trust store… "
        sudo trust anchor ./myCA.pem
        echo "done"
    else
        echo ********************************************************************************
        echo * Please make sure to install the local CA root certificate into your *
        echo * operating system’s trust store on many Linux systems this is done with *
        echo * $(trust anchor myCA.pem). Please Consult the documentation of your OS on how *
        echo * to achieve this on your computer. *
        echo ********************************************************************************
    fi
fi

#Our services
service_table="frontend backend airflow druid keycloak minio console.minio guest.superset superset"
#Geneate certificates for each service
for service in $service_table; do
    commonname=$service
    mkdir $service.igad.local
    openssl genrsa -out $service.igad.local/privkey.pem 2048
    openssl req -new -key $service.igad.local/privkey.pem -out $service.igad.local/$service.csr \
        -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/"

    cat >$service.igad.local/$service.ext <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $service.igad.local
EOF

    openssl x509 -req -in $service.igad.local/$service.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial \
        -out $service.igad.local/fullchain.pem -days 825 -sha256 -extfile $service.igad.local/$service.ext
done
