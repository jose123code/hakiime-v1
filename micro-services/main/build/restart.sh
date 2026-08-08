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
existing_instances=$(echo "$process_list" | awk -v service="$service" '$0 ~ service {print $2}')

if ! [[ $existing_instances == "Current" ]]; then
    for instance in $existing_instances; do
      if ! pm2 restart "$instance"; then
        echo "Failed to restart instance $instance of the service worker."
        exit 1
      fi
      echo "Instance $instance of the service worker has been restarted."
    done
fi

# Completion message
echo "All existing instances of the service worker have been restarted."
