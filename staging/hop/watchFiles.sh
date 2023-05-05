#!/bin/bash

# # Specify the directory to watch for changes
WATCH_DIR="/home"

echo "Running watcher..."

inotifywait -m -d -o /files/watchRuns.txt -r "/home" | while read event; do

  # Run the chmod command on the modified file
  chmod -R 777 "${WATCH_DIR}"
  echo "Got a change" >> /files/watchRuns.txt
done
