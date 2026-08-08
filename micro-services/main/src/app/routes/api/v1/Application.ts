import { INTERFACE_TYPE } from "../../../../utils";
import { ApplicationController } from "../../../controllers/ApplicationController";
import { body } from "express-validator";
import { requireAuth, validationErrorHandler } from "../../../../common";
import { container } from "../../../../inversify.config";
import { Router } from "express";




export const Application = (router:Router)=>{

    const controller = container.get<ApplicationController>(
        INTERFACE_TYPE.ApplicationController
    );

    router.post(
        '/app',
        requireAuth,
        [
          body('appName').trim().notEmpty().withMessage('Please provide application name'),
          body('appURL').trim().isURL().withMessage('App Url must be valid'),
          body('appCallback').trim().isURL().withMessage('Application Callback must be a valid url')
        ],
        validationErrorHandler,
        controller.onCreateApplication.bind(controller)
    );
    router.get('/app/:apptoken',
                requireAuth,
                controller.onViewApplication.bind(controller)
    );

    return router;
};



