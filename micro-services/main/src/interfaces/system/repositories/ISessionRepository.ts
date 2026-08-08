import { Session } from '../../../app/entities/Session';
import { ISession } from '../ISession';
import { Types, Document } from 'mongoose';

export interface ISessionRepository {
  getById(idSession: string): Promise<
    | (Document<unknown, {}, ISession> &
        ISession & {
          _id: Types.ObjectId;
        })
    | null
  >;
  // getAll(): Promise<
  //   | (Document<unknown, {}, ISession> &
  //       ISession &
  //       {
  //         _id: Types.ObjectId;
  //       }[])
  //   | null
  // >;
  create(session: Session): Promise<void>;
  update(idSession: string, session: Session): Promise<void>;
  delete(idSession: string): Promise<void>;
}
