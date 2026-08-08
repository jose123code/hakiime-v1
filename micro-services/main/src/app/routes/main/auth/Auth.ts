import { INTERFACE_TYPE } from '../../../../utils';
import { body } from 'express-validator';
import { validationErrorHandler } from '../../../../common';
import { container } from '../../../../inversify.config';
import { Router } from 'express';
import { AuthController } from '../../../controllers/AuthController';
import { verify_token } from '../../../../common/middlewares/verify-token';

export const Auth = (router: Router) => {
  const controller = container.get<AuthController>(
    INTERFACE_TYPE.AuthController,
  );

  router.post(
    '/register',
    [
      body('developerName')
        .trim()
        .notEmpty()
        .withMessage('Please Provide Developer name'),
      body('developerEmail').isEmail().withMessage('Email must be valid'),
      body('developerPassword')
        .trim()
        .notEmpty()
        .withMessage('Password is required'),
    ],

    validationErrorHandler,
    controller.onCreateAuth.bind(controller),
  );
  router.get('/register', function (req, res, next) {
    res.template<any>(null);
  });

  router.post(
    '/login',
    [
      body('email').isEmail().withMessage('Email must be valid'),
      body('password').trim().notEmpty().withMessage('Password is required'),
    ],
    validationErrorHandler,
    controller.onAuth.bind(controller),
  );

  router.get('/login', function (req, res, next) {
    res.template<any>(null);
  });

  router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });


  router.post(
    '/authorization',
    [
      body('email').isEmail().withMessage('Email must be valid'),
      body('authorization')
        .trim()
        .notEmpty()
        .withMessage('Authorization key is required'),
    ],
    validationErrorHandler,
    controller.onAuthorization.bind(controller),
  );

  router.post(
    '/forgot-password',
    [body('email').trim().notEmpty().isEmail().withMessage('Email must be valid')],
    validationErrorHandler,
    controller.onAuthForgot.bind(controller),
  );

  router.get('/forgot-password', function (req, res, next) {
    res.template<any>(null);
  });
  router.post(
    '/reset/:token',
    [
      body('newPassword').trim().notEmpty().isLength({ min: 4 }).withMessage('Password must be at least 4 characters long.'),
      body('confirmPassword').trim().notEmpty().custom((value, { req }) => {
        return value === req.body.newPassword
      }).withMessage('Passwords must match.')
    ],
    validationErrorHandler,
    controller.onResetPassword.bind(controller),
  );

  router.get(
    '/reset/:token',
    controller.onResetPasswordGet.bind(controller),
  );

  return router;
};
