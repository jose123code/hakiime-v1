import { EventManager } from "../../services/event.manager";
export * from "./base-listener";
export * from "./base-publisher";
export * from "./payment-created-event";
export * from "./expiration-complete-event";
export * from "./order-cancelled-event";
export * from "./order-created-event";
export * from "./subjects";
export * from "./ticket-created-event";
export * from "./ticket-updated-event";
export * from "./types/order-status";
export * from "../../services/event.manager";

// Create an instance of EventManager
export const eventManager = new EventManager();


/**
 * Register an event with a callback function.
 * @param {string} eventName - The name of the event.
 * @param {Function} callback - The callback function to be executed when the event is triggered.
 * @param {number} [priority=10] - The priority of the event callback (higher priority is executed first).
 * @param {number} [expectedArgsLength=1] - The expected number of arguments for the callback function.
 */
export const addEvent = (eventName:string, callback:Function, priority:number = 10, expectedArgsLength:number = 1) => {
    eventManager.on(eventName, callback, priority, expectedArgsLength);
};

/**
 * Register an action with a callback function.
 * @param {string} actionName - The name of the action.
 * @param {Function} callback - The callback function to be executed when the action is performed.
 * @param {number} [priority=10] - The priority of the action callback (higher priority is executed first).
 * @param {number} [expectedArgsLength=1] - The expected number of arguments for the callback function.
 */
export const addAction = (actionName:string, callback:Function, priority:number = 10, expectedArgsLength:number = 1) => {
    eventManager.addAction(actionName, callback, priority, expectedArgsLength);
};

/**
 * Register a filter with a callback function.
 * @param {string} filterName - The name of the filter.
 * @param {Function} callback - The callback function to be executed when the filter is applied.
 * @param {number} [priority=10] - The priority of the filter callback (higher priority is executed first).
 * @param {number} [expectedArgsLength=1] - The expected number of arguments for the callback function.
 */
export const addFilter = (filterName:string, callback:Function, priority:number = 10, expectedArgsLength:number = 1) => {
    eventManager.addFilter(filterName, callback, priority, expectedArgsLength);
};

/**
 * Perform an action by triggering all associated callbacks.
 * @param {string} actionName - The name of the action to be performed.
 * @param {...any} params - Additional parameters to be passed to the action callbacks.
 */
export const doAction = (actionName:string, ...params:any) => {
    eventManager.doAction(actionName, ...params);
};

/**
 * Apply filters to a value by executing all associated callbacks.
 * @param {string} filterName - The name of the filter to be applied.
 * @param {any} value - Additional parameters to be passed to the filter callbacks.
 * @param {...any} params - Additional parameters to be passed to the filter callbacks.
 * @returns {any} - The original value after applying all filters.
 */
export const applyFilters = (filterName:string, value:any, ...params:any) => {
    return eventManager.applyFilter(filterName, value, ...params);
};

/**
 * Manually trigger an event by executing all associated callbacks.
 * @param {string} eventName - The name of the event to be triggered.
 * @param {...any} params - Additional parameters to be passed to the event callbacks.
 */
export const eventTrigger = (eventName:string, ...params:any) => {
    eventManager.trigger(eventName, ...params);
};



