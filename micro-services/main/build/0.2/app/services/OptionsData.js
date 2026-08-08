"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = exports.OptionsData = void 0;
class OptionsData {
    constructor(expires) {
        this.expires = expires;
    }
    // Method to modify options
    modify(options) {
        Object.assign(this, options);
        return this;
    }
}
exports.OptionsData = OptionsData;
exports.defaultOptions = new OptionsData(1000 * 60 * 60 * 24 * 14);
