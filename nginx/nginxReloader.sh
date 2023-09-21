#!/bin/sh
while true
do
 sleep 6h && nginx -s reload
 echo ">>> nginx config files are reloaded!"
done
