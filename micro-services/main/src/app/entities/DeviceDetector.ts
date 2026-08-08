export class DeviceDetector {
    constructor(
      public readonly os: string[],
      public readonly device: string[],
      public readonly client: string[],
    ) {}
  }
  