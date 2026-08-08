import { Channel } from "amqplib";

export type WorkerOrSender = "worker" | "sender";
// Define the type for the callback function
export type CallbackFunction = (channel: Channel,queue:string) => void;
export * from "./service-system";