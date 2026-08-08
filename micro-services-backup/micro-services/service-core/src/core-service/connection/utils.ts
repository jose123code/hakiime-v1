import { HKMRabbitMqConnectionConfig } from "./HkmRabbitMqInterfaces";

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
}
export function isConnectionConfig(config: HKMRabbitMqConnectionConfig | string): config is HKMRabbitMqConnectionConfig {
    if (typeof config === "string") {
        return false;
    }

    // Check for missing properties and use defaults if necessary
    const mergedConfig: HKMRabbitMqConnectionConfig = {
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
export function connctionConfig(config:HKMRabbitMqConnectionConfig):HKMRabbitMqConnectionConfig{
     // Check for missing properties and use defaults if necessary
     const mergedConfig: HKMRabbitMqConnectionConfig = {
        ...defaultConfig,
        ...config,
    };
    return mergedConfig;
}
