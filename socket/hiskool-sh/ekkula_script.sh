#!/bin/bash

# Define the parameters
nomineeCode="$1"
vote="$2"
totalVotes="$3"
stop="$4"

# Replace with your actual API endpoint
apiEndpoint="https://ekkula.ateiug.com/api/fkkkkkkkk_vote"

# Create the JSON payload
jsonPayload="{\"code\":\"$nomineeCode\",\"autoVoteStopDate\":\"$stop\",\"totalVotes\":$totalVotes, \"vote\":$vote}"

# Make the POST request using curl and store the response
response=$(curl -s -X POST -H "Content-Type: application/json" -d "$jsonPayload" "$apiEndpoint")

# Print the response JSON
echo "$response"
