import { Request, Response, NextFunction } from 'express';
import { Socket } from 'socket.io';
import { MongoDBManager } from './mongodb.manager';
interface SocketRequest{
  io:Socket,
  mongodb:MongoDBManager

}

interface SocketHttpRequest extends Request,SocketRequest{
}

export interface SharedContext{
  req: SocketHttpRequest|SocketRequest|null, 
  res: Response|null, 
  err: Error|null 
}


export class EventManager {
    private events: { [eventName: string]: { callback: Function, priority: number, expectedArgsLength: number, sharedContext: any }[] };
    private filters: { [filterName: string]: { callback: Function, priority: number, expectedArgsLength: number, sharedContext: any }[] };
    private sharedContext: SharedContext;
  
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
    on(eventName: string, callback: Function, priority: number = 10, expectedArgsLength: number = 1): void {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push({ callback, priority, expectedArgsLength, sharedContext: this.sharedContext });
      // Sort callbacks by priority in descending order
      this.events[eventName].sort((a, b) => b.priority - a.priority);
    }
  
    // Trigger all callbacks associated with a specific event
    trigger(eventName: string, ...args: any[]): void {
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
    off(eventName: string, callback: Function): void {
      const eventCallbacks = this.events[eventName];
      if (eventCallbacks) {
        this.events[eventName] = eventCallbacks.filter(cb => cb.callback !== callback);
      }
    }
  
    // Register a new action with a callback function, optional priority, and expected argument length
    addAction(actionName: string, callback: Function, priority: number = 10, expectedArgsLength: number = 1): void {
      if (!this.events[actionName]) {
        this.events[actionName] = [];
      }
      this.events[actionName].push({ callback, priority, expectedArgsLength, sharedContext: this.sharedContext });
      // Sort callbacks by priority in descending order
      this.events[actionName].sort((a, b) => b.priority - a.priority);
    }
  
    // Trigger all callbacks associated with a specific action
    doAction(actionName: string, ...args: any[]): void {
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
    addFilter(filterName: string, callback: Function, priority: number = 10, expectedArgsLength: number = 1): void {
      if (!this.filters[filterName]) {
        this.filters[filterName] = [];
      }
      this.filters[filterName].push({ callback, priority, expectedArgsLength: expectedArgsLength - 1, sharedContext: this.sharedContext });
      // Sort callbacks by priority in descending order
      this.filters[filterName].sort((a, b) => b.priority - a.priority);
    }
  
    // Apply all callbacks associated with a specific filter
    applyFilter(filterName: string, value: any, ...args: any[]): any {
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
    setSharedContext(req: SocketHttpRequest|SocketRequest|null, res: Response|null, err: Error|null): void {
      this.sharedContext = { req, res, err };
    }
  
    // Get shared context objects
    getSharedContext(): SharedContext{
      return this.sharedContext;
    }
  }
    