"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Created"] = "created";
    OrderStatus["Cancelled"] = "cancel";
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    OrderStatus["Completed"] = "complete";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
