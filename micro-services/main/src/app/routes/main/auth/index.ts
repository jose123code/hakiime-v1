import express, { Router } from "express";
import { Auth } from "./Auth";

/**
 * Initializes version 1 (auth) of the API routes.
 * @returns {Router} The configured router for auth routes.
 */
export const auth = (() => {
    const router = express.Router();

    // Apply routes from Auth module
    Auth(router);

    return router;
})();
