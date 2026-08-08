import express from "express";
export * as api from "./api";
export * as mainRouters from "./main";

export const main = (()=>{
    var router = express.Router();
    router.get('/', function(req, res, next) {
        res.render('home', { title: 'HOME'});
    });

     return router;
    
})();

