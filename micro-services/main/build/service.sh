#!/bin/bash

# Prompt for service worker name
read -p "Enter your service worker name (e.g., hello): " service

# Prompt for project directory
read -p "Enter the absolute path to your project directory: " projectDir

# Check if project directory exists
if [ ! -d "${projectDir}" ]; then
  echo "Error: Directory ${projectDir} does not exist."
  exit 1
fi

# Change directory to your project directory
cd "${projectDir}"

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
  echo "PM2 could not be found. Please install PM2 first."
  exit 1
fi

# Query PM2 for the number of existing instances of the service worker
existing_instances=$(pm2 list | grep -c "service_${service}")

# Prompt for the number of additional instances to start
read -p "Enter the number of additional instances you want to start (default is 1): " additional_instances
additional_instances=${additional_instances:-1}

# Start additional instances from the next index
start_index=$((existing_instances + 1))

# Start the additional instances
for ((i = start_index; i < start_index + additional_instances; i++)); do
  if ! pm2 start bin/worker/"${service}".js --name "service_${service}_${i}" -- --port $((4000 + i - 1)) --update-env; then
    echo "Failed to start the service with PM2 for instance $i."
    exit 1
  fi
done

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Completion message
echo "Setup complete. Your Service worker is now running with a total of $((existing_instances + additional_instances)) instances."
