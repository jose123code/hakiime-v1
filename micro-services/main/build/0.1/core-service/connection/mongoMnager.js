const mongoose = require('mongoose');

// Define the Website schema
const websiteSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true,
      index: true
    },
    callbackUrl: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date().toISOString(),
      index: true
    },
    updatedAt: {
      type: Date,
      default: () => new Date().toISOString(),
      index: true
    }
  });


 
  // Define the Developer schema
  const developerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    websites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Website'
    }],
    createdAt: {
      type: Date,
      default: () => new Date().toISOString(),
      index: true
    },
    updatedAt: {
      type: Date,
      default: () => new Date().toISOString(),
      index: true
    }
  });



 
  
// Create the Website and Developer models based on the schemas
const Websites = mongoose.model('websites', websiteSchema);
const Developers = mongoose.model('developers', developerSchema);
  

class MongoDBManager {
    constructor(config, environment) {
        this.config = config[environment];
        this.database = this.config.database || 'test'; // Default to 'test' if not provided
        this.colname = 'websites';
        this.models = {
            'websites': Websites,
            'developers': Developers
        };
      }
    
    async connect() {
        try {
            const { hostname, user, pwd, port } = this.config;
            const connectionString = `mongodb://${user}:${encodeURIComponent(pwd)}@${hostname}:${port}/${this.database}?authMechanism=DEFAULT&directConnection=true`;
            console.log(connectionString);
            await mongoose.connect(connectionString);
            console.log(`Connected to MongoDB at ${hostname}:${port}, Database: ${this.database}`);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }
   useCollection(col){
        if(this.models.hasOwnProperty(col)){
            this.colname = col
            return this.models[col];
        }
        return false;
    }

  close() {
    if (mongoose.connection.readyState === 1) {
      mongoose.disconnect();
      console.log('MongoDB connection closed');
    }
  }

  
}

module.exports = {
    MongoDBManager,
    websiteSchema,
    developerSchema,
    Websites,
    Developers

}
