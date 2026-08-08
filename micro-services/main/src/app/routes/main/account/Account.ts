import { INTERFACE_TYPE } from '../../../../utils';
import { isAuthenticated } from '../../../../common';
import { container } from '../../../../inversify.config';
import { Router } from 'express';
import "../../../../common/auth/local";
import { AccountController } from '../../../controllers/AccountController';

export const Account = (router: Router) => {
  const controller = container.get<AccountController>(
    INTERFACE_TYPE.AccountController,
  );

  
  router.get(
    '/',
    isAuthenticated,
    controller.onAccount.bind(controller),
  );

  return router;
};
