import { FavorableEntity } from 'src/entity';

export class User extends FavorableEntity {
  constructor(public params: IUser) {
    super();
  }
  hidePassword(): Omit<IUser, 'password'> {
    const copyWithoutPassword = { ...this.params };
    copyWithoutPassword.password = undefined;
    return copyWithoutPassword;
  }
}

export interface IUser {
  id: string; // uuid v4
  login: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
  password: string;
}
