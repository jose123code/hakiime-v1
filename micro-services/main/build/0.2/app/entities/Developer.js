"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Developer = void 0;
class Developer {
    constructor(name, email, password, phone, born, address, applications, languages) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.born = born;
        this.address = address;
        this.applications = applications;
        this.languages = languages;
    }
}
exports.Developer = Developer;
