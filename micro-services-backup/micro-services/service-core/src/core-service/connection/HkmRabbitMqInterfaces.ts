import * as amqp from "amqplib";
import {Promise} from "bluebird";

export interface HKMRabbitMqConnectionFactory {
    create(): Promise<amqp.Connection>;
  }
  
  export interface HKMRabbitMqConnectionConfig {
    hostname?: string;
    port?: number; 
    vhost?: string;
    protocol?: string;
    username?: string;
    password?: string;
    locale?: string;
    frameMax?: number;
    heartbeat?: number;
  }
  

  