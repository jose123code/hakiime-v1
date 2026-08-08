export class Session {
    constructor(
      public readonly idSession: string,
      public readonly session: any,
      public readonly expires: Date

    ) {}
  }