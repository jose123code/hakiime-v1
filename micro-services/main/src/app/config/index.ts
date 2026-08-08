import * as fs from 'fs';
import * as path from 'path';
import { ApplicationConfig,IConfig } from '../../interfaces';
import { injectable } from 'inversify';

@injectable() // Add @injectable annotation
export class ConfigurationManager implements IConfig {
  private configPath: string;
  private config:ApplicationConfig|null;

  constructor() {
      // Assuming config.json is in the project directory
      this.configPath = path.resolve(__dirname, '../../..', 'config.json');
      this.config = this.readConfig()
  }

  private readConfig(): ApplicationConfig|null {
      try {
          const rawData = fs.readFileSync(this.configPath, 'utf-8');
          return JSON.parse(rawData);
      } catch (error) {
          console.error('Error reading configuration file:', error);
          return null;
      }
  }

  getConfig(): ApplicationConfig|null {
      if(this.config && isApplicationConfig(this.config)){
        return this.config;
      }

      return this.readConfig();
  }
}

/**
 * Checks if the given payload is of type ApplicationConfig.
 * @param payload The payload to check.
 * @returns True if the payload is of type ApplicationConfig, false otherwise.
 */
export function isApplicationConfig(payload: any): payload is ApplicationConfig {
  return typeof payload === 'object' && 'development' in payload && 'rabbitMQ' in payload;
}
