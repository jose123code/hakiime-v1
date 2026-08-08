const amqp = require("amqplib");
const Promise = require("bluebird");
const { createChildLogger } = require("../../app/logger");
const { connConfig, isConnectionConfig } = require("./utils");



class RabbitMqConnectionFactory {
  constructor(logger, config) {
    const connConfi = connConfig(config);
    this.connection =
      isConnectionConfig(config) ?
      `${connConfi.protocol}://${connConfi.hostname}:${connConfi.port}` :
      config;
    this.connectionConfig = connConfi;
    this.logger = createChildLogger(logger, "RabbitMqConnectionFactory");
  }

  create() {
    this.logger.debug("connecting to %s", this.connection);
    return Promise.resolve(amqp.connect(this.connectionConfig)).catch((err) => {
      this.logger.error("failed to create connection '%s'", this.connection);
      return Promise.reject(err);
    });
  }
}

class RabbitMqSingletonConnectionFactory {
  constructor(logger, config) {
    const connConfi = connConfig(config);
    this.connection =
      isConnectionConfig(config) ?
      `${connConfi.protocol}://${connConfi.hostname}:${connConfi.port}` :
      config;
    this.connectionConfig = connConfi;
    this.logger = createChildLogger(logger, "RabbitMqSingletonConnectionFactory");

  }
 
  create() {
    if (this.promise) {
      this.logger.trace("reusing connection to %s", this.connection);
      return this.promise;
    }
    this.logger.debug("creating connection to %s", this.connection);
    return (this.promise = Promise.resolve(amqp.connect(this.connectionConfig)));
  }
}


module.exports = {
    RabbitMqConnectionFactory,
    RabbitMqSingletonConnectionFactory,
    connConfig, 
    isConnectionConfig,
    ...require('./mongoMnager')
  };