#!/bin/sh
hosts="127.0.0.1 frontend.igad.local backend.igad.local keycloak.igad.local airflow.igad.local console.minio.igad.local minio.igad.local guest.superset.igad.local superset.igad.local druid.igad.local"
if grep -q "$hosts" /etc/hosts; then
    echo hosts already added!
else
    echo $hosts >>/etc/hosts
    echo hosts have been added!
fi
