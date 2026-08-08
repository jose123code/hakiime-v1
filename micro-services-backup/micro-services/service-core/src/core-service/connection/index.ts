import * as amqp from "amqplib";
import * as Logger from "bunyan";
import {Promise} from "bluebird";
import {createChildLogger} from "../../logger";
export * from "./utils";
import { connctionConfig, isConnectionConfig } from "./utils";
import { HKMRabbitMqConnectionConfig, HKMRabbitMqConnectionFactory } from "./HkmRabbitMqInterfaces";
export * from "./HkmRabbitMqInterfaces";


export class RabbitMqConnectionFactory implements HKMRabbitMqConnectionFactory {
    private connection: string;
    private connectionConfig: HKMRabbitMqConnectionConfig;
    constructor(private logger: Logger, config: HKMRabbitMqConnectionConfig | string) {
      var connConfi = connctionConfig(config as HKMRabbitMqConnectionConfig);
        this.connection = isConnectionConfig(config) ? `${connConfi.protocol}://${connConfi.hostname}:${connConfi.port}` : config;
        this.connectionConfig = connConfi;
        this.logger = createChildLogger(logger, "RabbitMqConnectionFactory");
    }
  
    create(): Promise<amqp.Connection> {
      this.logger.debug("connecting to %s", this.connection);
      return Promise.resolve(amqp.connect(this.connectionConfig)).catch(err => {
        this.logger.error("failed to create connection '%s'", this.connection);
        return Promise.reject(err);
      });
    }
  }
  
  export class RabbitMqSingletonConnectionFactory implements HKMRabbitMqConnectionFactory {
    private connection: string;
    private connectionConfig: HKMRabbitMqConnectionConfig;
    private promise?: Promise<amqp.Connection>;
    constructor(private logger: Logger, config: HKMRabbitMqConnectionConfig | string) {
        var connConfi = connctionConfig(config as HKMRabbitMqConnectionConfig);
        this.connection = isConnectionConfig(config) ? `${connConfi.protocol}://${connConfi.hostname}:${connConfi.port}` : config;
        this.connectionConfig = connConfi;
         
    }
  
    create(): Promise<amqp.Connection> {
      if (this.promise) {
        this.logger.trace("reusing connection to %s", this.connection);
        return this.promise;
      }
      this.logger.debug("creating connection to %s", this.connection);
      return this.promise = Promise.resolve(amqp.connect(this.connectionConfig));
    }
  }