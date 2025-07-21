import { IUser } from '../features/auth/user.model';

type Base = Pick<IUser, 'username' | 'email' | 'role'>;
type OptionalPassword = Partial<Pick<IUser, 'password'>>;

export type UserData = Base & OptionalPassword;
