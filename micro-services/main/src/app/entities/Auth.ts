export class Authentication {
    constructor(
      public readonly email: string,
      public readonly secreteKey: string,
      public readonly license: string,
      public readonly hits: number,
      public readonly devices: string[],
    ) {}
  }
  
  export class Auth {
    constructor(
      public readonly email: string,
      public readonly password: string,

    ) {}
  }