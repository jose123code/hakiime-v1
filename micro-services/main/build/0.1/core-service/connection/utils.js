const defaultConfig = {
  protocol: 'amqp',
  hostname: 'localhost',
  port: 5672,
  username: 'guest',
  password: 'guest',
  locale: 'en_US',
  frameMax: 0,
  heartbeat: 0,
  vhost: '/',
};

function isConnectionConfig(config) {
  if (typeof config === "string") {
    return false;
  }

  // Check for missing properties and use defaults if necessary
  const mergedConfig = {
    ...defaultConfig,
    ...config,
  };

  // Check if all the required properties exist in the merged config
  if (
    "hostname" in mergedConfig &&
    "port" in mergedConfig
  ) {
    return true;
  } else {
    return false;
  }
}

function connConfig(config) {
  // Check for missing properties and use defaults if necessary
  const mergedConfig = {
    ...defaultConfig,
    ...config,
  };
  return mergedConfig;
}

module.exports = {
  isConnectionConfig,
  connConfig,
};
