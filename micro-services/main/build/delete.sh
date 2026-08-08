#!/bin/bash

# Prompt for service worker name
read -p "Enter the service worker name: " service

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
  echo "PM2 could not be found. Please install PM2 first."
  exit 1
fi

# Query PM2 for the list of all running processes
process_list=$(pm2 list)

# Extract process IDs related to the specified service worker
pids=$(echo "$process_list" | awk -v service="$service" '$0 ~ service {print $2}')

# Delete each process individually
for pid in $pids; do
  if ! pm2 delete "$pid"; then
    echo "Failed to delete process $pid of the service worker."
    exit 1
  fi
done

# Completion message
echo "All instances of the service worker have been deleted."
