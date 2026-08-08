# Start your image with a node base image
FROM node:18.13.0-alpine

# Install Yarn
RUN npm install -g yarn --force

# The /app directory should act as the main application directory
WORKDIR /

# Copy the app package and package-lock.json file
COPY package*.json ./

# Install node packages using Yarn
RUN yarn install

# Copy local directories to the current local directory of our docker image (/app)
COPY . .

# Expose the port on which your app will run
EXPOSE 3000

# Start the app using Yarn
CMD ["yarn", "start"]
