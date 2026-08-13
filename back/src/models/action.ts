import { UserModel } from './user.model';


export abstract class Action<TResult = void> {
  protected user: UserModel | undefined;

  constructor(user?: UserModel) {
    this.user = user;
  }

  protected requireUserId(): number {
    const userId = this.user?.id;
    if (!userId) {
      throw new Error('Usuário inválido para esta ação.');
    }
    return userId;
  }

  abstract run(): Promise<TResult>;
}