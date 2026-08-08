import passport from "passport";
import passportLocal from "passport-local";
import { container } from "../../inversify.config";
import { AuthController } from "../../app/controllers/AuthController";
import { INTERFACE_TYPE } from "../../utils";
import { LicensePayload } from "../../interfaces";
const LocalStrategy = passportLocal.Strategy;
declare global {
  namespace Express {
    interface User {
      current?: LicensePayload
    }

  }
}



passport.serializeUser<any, any>((req, user, done) => {
  done(undefined, user.current!.auth);
});


passport.deserializeUser<string>((id, done) => {
  const controller = container.get<AuthController>(
    INTERFACE_TYPE.AuthController
  );
  controller.onDeserializeAuth.bind(controller)(
    id, done
  ).then(data => {
    return data;
  }).catch((err) => {
    return done(err);
  })

});

passport.use(new LocalStrategy({ usernameField: "email" }, (username: any, password: string, done: any) => {
  const controller = container.get<AuthController>(
    INTERFACE_TYPE.AuthController
  );
  controller.onAuthPassport.bind(controller)(
    username as unknown as string, password, done
  ).then(data => {
    return data;
  }).catch((err) => {
    return done(err);
  })

}));
