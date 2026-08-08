export class OS {
    constructor(
      public readonly name: string,
      public readonly short_name: string,
      public readonly version: string,
      public readonly platform: string,
      public readonly hits: number,
      public readonly family: string,
    ) {}
  }
export class Client{
    constructor(
        public readonly name: string,
        public readonly short_name: string,
        public readonly version: string,
        public readonly type: string,
        public readonly engine: string,
        public readonly engine_version: string,
        public readonly family: string,
        public readonly hits: number,

      ) {}
}

export class Device{
    constructor(
        public readonly id: string,
        public readonly type: string,
        public readonly brand: string,
        public readonly model_: string,
        public readonly code: string,
        public readonly trusted: string,
        public readonly info: string,
        public readonly hits: number,

      ) {}
}