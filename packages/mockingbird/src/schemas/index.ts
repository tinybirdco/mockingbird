export { default as simpleExample } from "./simpleExample";
export { default as ecommerceTransactions } from "./ecommerceTransactions";
export { default as stockPrices } from "./stockPrices";
export { default as contentTracking } from "./contentTracking";
export { default as webAnalytics } from "./webAnalytics";
export { default as logAnalytics } from "./logAnalytics";
export { default as flappybird } from "./flappybird";
export { default as sportsbetting } from "./sportsbetting";
export { default as flightBookings } from "./flightBookings";

import simpleExample from "./simpleExample";
import ecommerceTransactions from "./ecommerceTransactions";
import stockPrices from "./stockPrices";
import contentTracking from "./contentTracking";
import webAnalytics from "./webAnalytics";
import logAnalytics from "./logAnalytics";
import flappybird from "./flappybird";
import sportsbetting from "./sportsbetting";
import flightBookings from "./flightBookings";

import { Schema } from "../types";

export const presetSchemas: Record<string, Schema> = {
  "Simple Example": simpleExample,
  "eCommerce Transactions": ecommerceTransactions,
  "Stock Prices": stockPrices,
  "Content Tracking": contentTracking,
  "Web Analytics Starter Kit": webAnalytics,
  "Log Analytics Starter Kit": logAnalytics,
  Flappybird: flappybird,
  Sportsbetting: sportsbetting,
  "Flight Bookings": flightBookings,
};

export const PRESET_SCHEMA_NAMES = Object.keys(presetSchemas);
