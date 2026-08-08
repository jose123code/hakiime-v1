const {EventManager} = require('../core-service');

// Create an instance of EventManager
const eventManager = new EventManager();


/**
 * Register an event with a callback function.
 * @param {string} eventName - The name of the event.
 * @param {Function} callback - The callback function to be executed when the event is triggered.
 * @param {number} [priority=10] - The priority of the event callback (higher priority is executed first).
 * @param {number} [expectedArgsLength=1] - The expected number of arguments for the callback function.
 */
const addEvent = (eventName, callback, priority = 10, expectedArgsLength = 1) => {
    eventManager.on(eventName, callback, priority, expectedArgsLength);
};

/**
 * Register an action with a callback function.
 * @param {string} actionName - The name of the action.
 * @param {Function} callback - The callback function to be executed when the action is performed.
 * @param {number} [priority=10] - The priority of the action callback (higher priority is executed first).
 * @param {number} [expectedArgsLength=1] - The expected number of arguments for the callback function.
 */
const addAction = (actionName, callback, priority = 10, expectedArgsLength = 1) => {
    eventManager.addAction(actionName, callback, priority, expectedArgsLength);
};

/**
 * Register a filter with a callback function.
 * @param {string} filterName - The name of the filter.
 * @param {Function} callback - The callback function to be executed when the filter is applied.
 * @param {number} [priority=10] - The priority of the filter callback (higher priority is executed first).
 * @param {number} [expectedArgsLength=1] - The expected number of arguments for the callback function.
 */
const addFilter = (filterName, callback, priority = 10, expectedArgsLength = 1) => {
    eventManager.addFilter(filterName, callback, priority, expectedArgsLength);
};

/**
 * Perform an action by triggering all associated callbacks.
 * @param {string} actionName - The name of the action to be performed.
 * @param {...any} params - Additional parameters to be passed to the action callbacks.
 */
const doAction = (actionName, ...params) => {
    eventManager.doAction(actionName, ...params);
};

/**
 * Apply filters to a value by executing all associated callbacks.
 * @param {string} filterName - The name of the filter to be applied.
 * @param {...any} params - Additional parameters to be passed to the filter callbacks.
 * @returns {any} - The original value after applying all filters.
 */
const applyFilters = (filterName, ...params) => {
    return eventManager.applyFilter(filterName, ...params);
};

/**
 * Manually trigger an event by executing all associated callbacks.
 * @param {string} eventName - The name of the event to be triggered.
 * @param {...any} params - Additional parameters to be passed to the event callbacks.
 */
const eventTrigger = (eventName, ...params) => {
    eventManager.trigger(eventName, ...params);
};

  module.exports = {
    addEvent,
    addAction,
    applyFilters,
    doAction,
    addFilter,
    eventTrigger,
    eventManager
  };
  