"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = exports.Client = exports.OS = void 0;
class OS {
    constructor(name, short_name, version, platform, hits, family) {
        this.name = name;
        this.short_name = short_name;
        this.version = version;
        this.platform = platform;
        this.hits = hits;
        this.family = family;
    }
}
exports.OS = OS;
class Client {
    constructor(name, short_name, version, type, engine, engine_version, family, hits) {
        this.name = name;
        this.short_name = short_name;
        this.version = version;
        this.type = type;
        this.engine = engine;
        this.engine_version = engine_version;
        this.family = family;
        this.hits = hits;
    }
}
exports.Client = Client;
class Device {
    constructor(id, type, brand, model_, code, trusted, info, hits) {
        this.id = id;
        this.type = type;
        this.brand = brand;
        this.model_ = model_;
        this.code = code;
        this.trusted = trusted;
        this.info = info;
        this.hits = hits;
    }
}
exports.Device = Device;
