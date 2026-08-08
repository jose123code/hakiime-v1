import express, { Router } from "express";
import { Account } from "./Account";

/**
 * Initializes version 1 (Account) of the API routes.
 * @returns {Router} The configured router for Account routes.
 */
export const account = (() => {
    const router = express.Router();

    // Apply routes from Account module
    Account(router);

    return router;
})();
