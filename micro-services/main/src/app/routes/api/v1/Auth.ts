
import { INTERFACE_TYPE } from "../../../../utils";
import { body } from "express-validator";
import { validationErrorHandler } from "../../../../common";
import { container } from "../../../../inversify.config";
import { Router } from "express";
import { AuthController } from "../../../controllers/AuthController";
import { verify_token } from "../../../../common/middlewares/verify-token";




export const Auth = (router:Router)=>{

    const controller = container.get<AuthController>(
        INTERFACE_TYPE.AuthController
    );

    router.post(
        '/auth/register',
        [
          body('developerName').trim().notEmpty().withMessage('Please Provide Developer name'),
          body('developerEmail').isEmail().withMessage('Email must be valid'),
          body('developerPhone').isMobilePhone("any").withMessage('Phone number is invalid'),
          body('developerPassword').trim().notEmpty().withMessage('Password is required'),
        ],
        validationErrorHandler,
        controller.onCreateAuth.bind(controller)
    );
    router.post('/auth',[
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('Password is required'),
      ],
      validationErrorHandler,
      controller.onAuth.bind(controller))

    router.post('/authorization',[
        body('email').isEmail().withMessage('Email must be valid'),
        body('authorization').trim().notEmpty().withMessage('Authorization key is required'),
      ],
      validationErrorHandler,
      controller.onAuthorization.bind(controller))



    return router;
};



