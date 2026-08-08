export interface Options {
    expires: number;
  }
  
export class OptionsData implements Options {
    constructor(public expires: number) {}
  
    // Method to modify options
    modify(options: Partial<Options>) {
      Object.assign(this, options);
      return this;
    }
  }
  
export const defaultOptions = new OptionsData(1000 * 60 * 60 * 24 * 14);