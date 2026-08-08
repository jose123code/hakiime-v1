import express, { Router } from "express";
import { Application } from "./Application";
import { Auth } from "./Auth";
import { Test } from "./Test";

/**
 * Initializes version 1 (v1) of the API routes.
 * @returns {Router} The configured router for v1 routes.
 */
export const v1 = (() => {
    const router = express.Router();

    // Apply routes from Application module
    Application(router);

    // Apply routes from Auth module
    Auth(router);
    
    Test(router);

    return router;
})();
