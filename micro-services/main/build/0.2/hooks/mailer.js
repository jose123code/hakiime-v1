"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const https_1 = require("https");
const path_1 = __importDefault(require("path"));
const inversify_config_1 = require("../inversify.config");
const utils_1 = require("../utils");
const config = inversify_config_1.container.get(utils_1.INTERFACE_TYPE.ConfigurationManager).getConfig();
const emailConfig = config.emailConfig;
const agent = new https_1.Agent({
    rejectUnauthorized: false, // Bypass hostname verification (Not recommended for production)
});
emailConfig.tls = Object.assign(Object.assign({}, emailConfig.tls), { agent });
const emailTimeout = 15000; // 15 seconds timeout for email sending
const defaultHeaders = {
    "Content-Type": "text/plain; charset=UTF-8",
    // reply_to: "no-reply@example.com"
};
// Create a transporter with the security options
const transporter = nodemailer_1.default.createTransport(emailConfig);
function sendEmail(emailOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        // Validate required fields
        if (!emailOptions.from)
            throw new Error('Missing "from" field');
        if (!emailOptions.subject)
            throw new Error('Missing "subject" field');
        if (!emailOptions.to)
            throw new Error('Missing "to" field');
        // Set default values for optional fields if they are not provided
        emailOptions.variables = (_a = emailOptions.variables) !== null && _a !== void 0 ? _a : [];
        emailOptions.headers = (_b = emailOptions.headers) !== null && _b !== void 0 ? _b : defaultHeaders;
        var transporterUser = (_c = emailOptions.transporter) !== null && _c !== void 0 ? _c : null;
        var html = (_d = emailOptions.html) !== null && _d !== void 0 ? _d : false;
        // Define the email options
        const mailOptions = {
            from: emailOptions.from,
            to: emailOptions.to,
            subject: emailOptions.subject
        };
        // Set HTML content if content type is HTML, otherwise set plain text body
        if (html) {
            if (!emailOptions.template)
                throw new Error('Missing "template" field');
            mailOptions.html = yield renderEmailTemplate(emailOptions.template, emailOptions.variables);
        }
        else {
            if (!emailOptions.body)
                throw new Error('Missing "body" field');
            mailOptions.text = emailOptions.body;
        }
        var headers = emailOptions.headers;
        if ((0, utils_1.isString)(emailOptions.replyTo)) {
            mailOptions.replyTo = emailOptions.replyTo;
        }
        if ((0, utils_1.isSet)(emailOptions, 'cc')) {
            mailOptions.cc = emailOptions.cc;
        }
        if ((0, utils_1.isSet)(emailOptions, 'bcc')) {
            mailOptions.bcc = emailOptions.bcc;
        }
        // mailOptions.headers = headers;
        try {
            // Wrap the email sending in a promise with a timeout
            const sendMailPromise = new Promise((resolve, reject) => {
                var transporterModif = transporter;
                if ((0, utils_1.isNotNull)(transporterUser)) {
                    const modifiedConfig = Object.assign(Object.assign({}, emailConfig), { host: transporterUser.host, port: transporterUser.port, auth: {
                            user: transporterUser.user,
                            pass: transporterUser.pass,
                        } });
                    transporterModif = nodemailer_1.default.createTransport(modifiedConfig);
                }
                transporterModif.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(info);
                    }
                });
            });
            // Wait for the email sending with the specified timeout
            const info = yield Promise.race([sendMailPromise, delay(emailTimeout)]);
            // console.log(info);
            return info;
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    });
}
function renderEmailTemplate(templateName, variables) {
    return __awaiter(this, void 0, void 0, function* () {
        // Read and render the email template using ejs with the provided variables
        const templatePath = path_1.default.join(__dirname, `/../../templates/${templateName}.ejs`);
        try {
            const template = yield ejs_1.default.renderFile(templatePath, variables);
            return template;
        }
        catch (error) {
            console.error('Error rendering email template:', error);
            throw error;
        }
    });
}
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.default = sendEmail;
