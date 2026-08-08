"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventTrigger = exports.applyFilters = exports.doAction = exports.addFilter = exports.addAction = exports.addEvent = exports.eventManager = void 0;
const event_manager_1 = require("../../services/event.manager");
__exportStar(require("./base-listener"), exports);
__exportStar(require("./base-publisher"), exports);
__exportStar(require("./payment-created-event"), exports);
__exportStar(require("./expiration-complete-event"), exports);
__exportStar(require("./order-cancelled-event"), exports);
__exportStar(require("./order-created-event"), exports);
__exportStar(require("./subjects"), exports);
__exportStar(require("./ticket-created-event"), exports);
__exportStar(require("./ticket-updated-event"), exports);
__exportStar(require("./types/order-status"), exports);
__exportStar(require("../../services/event.manager"), exports);
// Create an instance of EventManager
exports.eventManager = new event_manager_1.EventManager();
/**
 * Register an event with a callback function.
 * @param {string} eventName - The name of the event.
 * @param {Function} callback - The callback function to be executed when the event is triggered.
 * @param {number} [priority=10] - The priority of the event callback (higher priority is executed first).
 * @param {number} [expectedArgsLength=1] - The expected number of arguments for the callback function.
 */
const addEvent = (eventName, callback, priority = 10, expectedArgsLength = 1) => {
    exports.eventManager.on(eventName, callback, priority, expectedArgsLength);
};
exports.addEvent = addEvent;
/**
 * Register an action with a callback function.
 * @param {string} actionName - The name of the action.
 * @param {Function} callback - The callback function to be executed when the action is performed.
 * @param {number} [priority=10] - The priority of the action callback (higher priority is executed first).
 * @param {number} [expectedArgsLength=1] - The expected number of arguments for the callback function.
 */
const addAction = (actionName, callback, priority = 10, expectedArgsLength = 1) => {
    exports.eventManager.addAction(actionName, callback, priority, expectedArgsLength);
};
exports.addAction = addAction;
/**
 * Register a filter with a callback function.
 * @param {string} filterName - The name of the filter.
 * @param {Function} callback - The callback function to be executed when the filter is applied.
 * @param {number} [priority=10] - The priority of the filter callback (higher priority is executed first).
 * @param {number} [expectedArgsLength=1] - The expected number of arguments for the callback function.
 */
const addFilter = (filterName, callback, priority = 10, expectedArgsLength = 1) => {
    exports.eventManager.addFilter(filterName, callback, priority, expectedArgsLength);
};
exports.addFilter = addFilter;
/**
 * Perform an action by triggering all associated callbacks.
 * @param {string} actionName - The name of the action to be performed.
 * @param {...any} params - Additional parameters to be passed to the action callbacks.
 */
const doAction = (actionName, ...params) => {
    exports.eventManager.doAction(actionName, ...params);
};
exports.doAction = doAction;
/**
 * Apply filters to a value by executing all associated callbacks.
 * @param {string} filterName - The name of the filter to be applied.
 * @param {any} value - Additional parameters to be passed to the filter callbacks.
 * @param {...any} params - Additional parameters to be passed to the filter callbacks.
 * @returns {any} - The original value after applying all filters.
 */
const applyFilters = (filterName, value, ...params) => {
    return exports.eventManager.applyFilter(filterName, value, ...params);
};
exports.applyFilters = applyFilters;
/**
 * Manually trigger an event by executing all associated callbacks.
 * @param {string} eventName - The name of the event to be triggered.
 * @param {...any} params - Additional parameters to be passed to the event callbacks.
 */
const eventTrigger = (eventName, ...params) => {
    exports.eventManager.trigger(eventName, ...params);
};
exports.eventTrigger = eventTrigger;
