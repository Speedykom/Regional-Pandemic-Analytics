#!/bin/bash

# Specify the directory to watch for changes
WATCH_DIR="/home"

# Verify if /files exists
mkdir -p "/files"

echo "Running watcher..."

# -d -o /files/watchRuns.txt
inotifywait -m -r "/home" -e create | while read event; do
  # Run the chmod command on the modified file
  chmod -R 777 "${WATCH_DIR}"
  echo "Got a change" >> /files/watchRuns.txt
done
