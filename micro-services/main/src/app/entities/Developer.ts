export class Developer {
    constructor(
      public readonly name: string,
      public readonly email: string,
      public readonly password: string,
      public readonly phone: number,
      public readonly born?: string,
      public readonly address?: string,
      public readonly applications?: string[],
      public readonly languages?: string[],


    ) {}
  }
  