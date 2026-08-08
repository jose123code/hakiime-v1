#!/bin/bash

# Define the parameters
nomineeCode="$1"
vote="$2"

# Replace with your actual API endpoint
apiEndpoint="https://jojo.hkmcode.com/api/fkkkkkkkk_vote"

# Create the JSON payload
jsonPayload="{\"code\":\"$nomineeCode\",\"vote\":$vote}"

# Make the POST request using curl and store the response
response=$(curl -s -X POST -H "Content-Type: application/json" -d "$jsonPayload" "$apiEndpoint")

# Print the response JSON
echo "$response"