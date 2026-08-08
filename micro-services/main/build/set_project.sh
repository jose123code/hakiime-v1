#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    # Install Node.js using NodeSource PPA
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "Node.js installed"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    # Install npm
    sudo apt-get install -y npm
    echo "npm installed"
fi

# Check if Apache is installed
if ! command -v apache2 &> /dev/null; then
    echo "Apache is not installed. Please install Apache first."
    exit 1
fi

# Check if pm2 is installed
if ! command -v pm2 &> /dev/null; then
    # Install pm2
    sudo npm install -g pm2
    echo "pm2 installed"
fi

# Check if proxy module is enabled
if ! apache2ctl -M | grep -q 'proxy_module'; then
    # Install and enable proxy module
    sudo a2enmod proxy
    echo "proxy module enabled"
fi

# Check if proxy_http module is enabled
if ! apache2ctl -M | grep -q 'proxy_http_module'; then
    # Install and enable proxy_http module
    sudo a2enmod proxy_http
    echo "proxy_http module enabled"
fi

# Prompt for application name
read -p "Enter your application name (e.g., myapp): " appName

# Prompt for domain name
read -p "Enter your domain name (e.g., example.com): " domain

# Prompt for project directory
read -p "Enter the absolute path to your project directory: " projectDir
 
# Prompt for port number
read -p "Enter the port number to run your Node.js application on (e.g., 3000): " port

# Create a virtual host configuration file
echo "<VirtualHost *:80>
    ServerName ${appName}.${domain}

    ProxyPreserveHost On
    ProxyPass / http://localhost:${port}/
    ProxyPassReverse / http://localhost:${port}/

    # Proxy WebSocket connections to the Socket.io server
    ProxyPass "/socket.io/" "http://localhost:${port}/socket.io/"
    ProxyPassReverse "/socket.io/" "http://localhost:${port}/socket.io/"
</VirtualHost>" | sudo tee /etc/apache2/sites-available/${appName}.conf

# Add SSL configuration if requested
read -p "Do you need to add secure configuration (HTTPS) (yes/no): " secureConfig
if [ "$secureConfig" = "yes" ]; then
    read -p "Enter the path to SSL certificate file: " sslCertPath
    read -p "Enter the path to SSL certificate key file: " sslKeyPath
    max_age = 31536000
    includeSubDomains = includeSubDomains
    preload = preload
    # Add SSL configuration
    echo "<VirtualHost *:443>
        ServerName ${appName}.${domain}

        SSLEngine on
        SSLCertificateFile ${sslCertPath}
        SSLCertificateKeyFile ${sslKeyPath}
        

        ProxyPreserveHost On
        ProxyPass / http://localhost:${port}/
        ProxyPassReverse / http://localhost:${port}/

        # Proxy WebSocket connections to the Socket.io server
        ProxyPass "/socket.io/" "http://localhost:${port}/socket.io/"
        ProxyPassReverse "/socket.io/" "http://localhost:${port}/socket.io/"

    </VirtualHost>" | sudo tee -a /etc/apache2/sites-available/${appName}.conf
fi

# Enable the virtual host
sudo ln -s /etc/apache2/sites-available/${appName}.conf /etc/apache2/sites-enabled/

# Restart Apache
sudo systemctl restart apache2

# Change directory to your project directory
cd "${projectDir}"

# Start your Node.js application with pm2
pm2 start bin/www.js --name "${appName}" -- --port "${port}" --update-env

pm2 save

pm2 startup

echo "Setup complete. Your Node.js application can now be accessed through Apache at ${appName}.${domain}."
