import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { 
  IApplication,
  ILanguage,
  IDeveloper,
  ApplicationConfig, 
  IConfig, 
  mongosDb,
  IAuth,
  IClient,
  IDevice,
  IDeviceDetector,
  IOs,
  ISession

 } from '../interfaces';
import { applicationSchema } from '../schemas/Application.schema';
import { developerSchema } from '../schemas/Developer.schema';
import { languageSchema } from '../schemas/Language.schema';
import { INTERFACE_TYPE } from '../utils';
import { authSchema } from '../schemas/Auth.schema';
import { clientSchema } from '../schemas/Client.schema';
import { deviceSchema } from '../schemas/Device.schema';
import { deviceDetectorSchema } from '../schemas/DeviceDetector.schema';
import { osSchema } from '../schemas/OS.schema';
import { sessionSchema } from '../schemas/Session.schema';

@injectable()
class MongoDBManager {
  private isConnected: boolean;
  private configuration_manager:IConfig;
  private mongodb:mongosDb;
  constructor(
    @inject(INTERFACE_TYPE.ConfigurationManager) configManager: IConfig,
  ) {
    this.isConnected = false;
    this.configuration_manager = configManager;
    var data = this.configuration_manager.getConfig() as ApplicationConfig;
    this.mongodb = data.mongos
  }

  async connect(): Promise<void> {
    this.isConnected = mongoose.connection.readyState === 1
    if (!this.isConnected) {
      try {
        const { hostname, user, pwd, port, database } = this.mongodb[process.env.ENVIRONMENT || 'dev'];
        const connectionString = `mongodb://${user}:${encodeURIComponent(pwd)}@${hostname}:${port}/${database}?authMechanism=DEFAULT&directConnection=true`;
        await mongoose.connect(connectionString);
        console.log(`Connected to MongoDB at ${hostname}:${port}, Database: ${database}`);
        this.isConnected = true;
        mongoose.model<IApplication>('Application', applicationSchema);
        mongoose.model<IDeveloper>('Developer', developerSchema);
        mongoose.model<ILanguage>('Language', languageSchema);
        mongoose.model<IDeviceDetector>('DeviceDetector', deviceDetectorSchema);
        mongoose.model<IAuth>('Auth', authSchema);
        mongoose.model<IDevice>('Device', deviceSchema);
        mongoose.model<IClient>('Client', clientSchema);
        mongoose.model<IOs>('Os', osSchema);
        mongoose.model<ISession>('Session', sessionSchema);


      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      }
    }
  }

  close(): void {
    if (this.isConnected) {
      mongoose.disconnect();
      console.log('MongoDB connection closed');
      this.isConnected = false;
    }
  }

  getCollection<T extends mongoose.Document>(name: string): mongoose.Model<T> {
    return mongoose.model<T>(name);
  }
}

export { MongoDBManager };
