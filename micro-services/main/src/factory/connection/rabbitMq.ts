import amqp from 'amqplib';
import Promise from 'bluebird';
import { inject, injectable } from 'inversify';
import { INTERFACE_TYPE } from '../../utils';
import { ApplicationConfig, IConfig } from '../../interfaces';

@injectable()
export class RabbitMqConnectionFactory {
  private connection: amqp.Options.Connect;
  private connectionConfig: any;
  //   private logger: any;
  private configuration_manager: IConfig;
 
  constructor(
    @inject(INTERFACE_TYPE.ConfigurationManager) configManager: IConfig,
  ) {
    this.configuration_manager = configManager;

    var data = this.configuration_manager.getConfig() as ApplicationConfig;

    const connConfi = data.rabbitMQ;
    const { hostname, username, password, port } =
      connConfi[process.env.ENVIRONMENT || 'dev'];
    const { protocol, locale, frameMax, heartbeat, vhost } = connConfi;

    this.connection = {
      protocol: protocol,
      locale: locale,
      frameMax: frameMax,
      heartbeat: heartbeat,
      vhost: vhost,
      hostname: hostname,
      username: username,
      password: password,
      port: port,
    };
    // console.log(this.connection);
    
    this.connectionConfig = connConfi;
  }

  create(): Promise<any> {
    console.log(
      'connecting to ' +
        this.connection.protocol +
        '://' +
        this.connection.hostname +
        ':' +
        this.connection.port,
    );
    return Promise.resolve(amqp.connect(this.connection)).catch(
      (err: any) => {
        console.log(
          'failed to create connection ' +
            this.connection.protocol +
            '://' +
            this.connection.hostname +
            ':' +
            this.connection.port,
        );
        return Promise.reject(err);
      },
    );
  }
}

@injectable()
export class RabbitMqSingletonConnectionFactory {
  private connection: amqp.Options.Connect;
  private connectionConfig: any;
  private configuration_manager: IConfig;
  private promise: Promise<any> | null = null;

  constructor(
    @inject(INTERFACE_TYPE.ConfigurationManager) configManager: IConfig,
  ) {
    this.configuration_manager = configManager;

    var data = this.configuration_manager.getConfig() as ApplicationConfig;

    const connConfi = data.rabbitMQ;
    const { hostname, username, password, port } =
      connConfi[process.env.ENVIRONMENT || 'dev'];
    const { protocol, locale, frameMax, heartbeat, vhost } = connConfi;

    this.connection = {
      protocol: protocol,
      locale: locale,
      frameMax: frameMax,
      heartbeat: heartbeat,
      vhost: vhost,
      hostname: hostname,
      username: username,
      password: password,
      port: port,
    };
    // console.log(this.connection);

    this.connectionConfig = connConfi;
  }

  create(): Promise<any> {
    if (this.promise) {
      console.log(
        'reusing connection to ' +
          this.connection.protocol +
          '://' +
          this.connection.hostname +
          ':' +
          this.connection.port,
      );
      return this.promise;
    }
    console.log(
      'creating connection to ' +
        this.connection.protocol +
        '://' +
        this.connection.hostname +
        ':' +
        this.connection.port,
    );
    return (this.promise = Promise.resolve(
      amqp.connect(this.connection),
    ));
  }
}
