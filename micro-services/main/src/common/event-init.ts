import { SharedContext, addAction } from "./events";

export const Init = ()=>{
    addAction('init',()=>{
        console.log('hello init!');
    },0,0)
    
    
    
    addAction('shutdown',(context:SharedContext)=>{
        if(context.req != null){
            // context.req.mongodb.close();
        }
    
    },0,0)
}
