const {MongoDBManager} = require("../../core-service");
const { addAction, addFilter } = require("../event");

addAction('init',()=>{
    console.log('hello init!');
},0,0)

addFilter('init_db',(context,dbs,config)=>{
    const dbManager = new MongoDBManager(config,'dev')
    context.req = {
        ...context.req,
        mongodb: dbManager
    }
    if(dbs == null){
        dbs = {
            context:context,
            mongodb: dbManager
        }
    }else{
        dbs = {
            ...dbs,
            context:context,
            mongodb: dbManager
        }
    }
    return dbs;
},0,2)

addAction('shutdown',(context)=>{
    if(context != null){
        context.req.mongodb.close();
    }
},0,0)