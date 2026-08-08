"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
class EventManager {
    constructor() {
        this.events = {};
        this.filters = {};
        this.sharedContext = {
            req: null,
            res: null,
            err: null,
        };
    }
    // Register a new event with a callback function, optional priority, and expected argument length
    on(eventName, callback, priority = 10, expectedArgsLength = 1) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push({ callback, priority, expectedArgsLength, sharedContext: this.sharedContext });
        // Sort callbacks by priority in descending order
        this.events[eventName].sort((a, b) => b.priority - a.priority);
    }
    // Trigger all callbacks associated with a specific event
    trigger(eventName, ...args) {
        const eventCallbacks = this.events[eventName];
        if (eventCallbacks) {
            eventCallbacks.forEach(({ callback, expectedArgsLength, sharedContext }) => {
                if (args.length !== expectedArgsLength) {
                    console.error(`Mismatched number of arguments for '${eventName}' event.`);
                    return;
                }
                callback(sharedContext, ...args);
            });
        }
    }
    // Remove a specific callback from an event
    off(eventName, callback) {
        const eventCallbacks = this.events[eventName];
        if (eventCallbacks) {
            this.events[eventName] = eventCallbacks.filter(cb => cb.callback !== callback);
        }
    }
    // Register a new action with a callback function, optional priority, and expected argument length
    addAction(actionName, callback, priority = 10, expectedArgsLength = 1) {
        if (!this.events[actionName]) {
            this.events[actionName] = [];
        }
        this.events[actionName].push({ callback, priority, expectedArgsLength, sharedContext: this.sharedContext });
        // Sort callbacks by priority in descending order
        this.events[actionName].sort((a, b) => b.priority - a.priority);
    }
    // Trigger all callbacks associated with a specific action
    doAction(actionName, ...args) {
        const actionCallbacks = this.events[actionName];
        if (actionCallbacks) {
            actionCallbacks.forEach(({ callback, expectedArgsLength, sharedContext }) => {
                if (args.length !== expectedArgsLength) {
                    console.error(`Mismatched number of arguments for '${actionName}' action.`);
                    return;
                }
                callback(sharedContext, ...args);
            });
        }
    }
    // Register a new filter with a callback function, optional priority, and expected argument length
    addFilter(filterName, callback, priority = 10, expectedArgsLength = 1) {
        if (!this.filters[filterName]) {
            this.filters[filterName] = [];
        }
        this.filters[filterName].push({ callback, priority, expectedArgsLength: expectedArgsLength - 1, sharedContext: this.sharedContext });
        // Sort callbacks by priority in descending order
        this.filters[filterName].sort((a, b) => b.priority - a.priority);
    }
    // Apply all callbacks associated with a specific filter
    applyFilter(filterName, value, ...args) {
        const filterCallbacks = this.filters[filterName];
        if (filterCallbacks) {
            return filterCallbacks.reduce((result, { callback, expectedArgsLength, sharedContext }) => {
                if (args.length !== expectedArgsLength) {
                    console.error(`Mismatched number of arguments for '${filterName}' filter.`);
                    return result;
                }
                return callback(sharedContext, result, ...args);
            }, value);
        }
        return value;
    }
    // Set shared context objects
    setSharedContext(req, res, err) {
        this.sharedContext = { req, res, err };
    }
    // Get shared context objects
    getSharedContext() {
        return this.sharedContext;
    }
}
exports.EventManager = EventManager;
