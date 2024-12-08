export { default as simpleExample } from "./simpleExample";
export { default as ecommerceTransactions } from "./ecommerceTransactions";
export { default as stockPrices } from "./stockPrices";
export { default as contentTracking } from "./contentTracking";
export { default as webAnalytics } from "./webAnalytics";
export { default as logAnalytics } from "./logAnalytics";
export { default as flappybird } from "./flappybird";
export { default as sportsbetting } from "./sportsbetting";

import simpleExample from "./simpleExample";
import ecommerceTransactions from "./ecommerceTransactions";
import stockPrices from "./stockPrices";
import contentTracking from "./contentTracking";
import webAnalytics from "./webAnalytics";
import logAnalytics from "./logAnalytics";
import flappybird from "./flappybird";
import sportsbetting from "./sportsbetting";

export const presetSchemas = {
  "Simple Example": simpleExample,
  "eCommerce Transactions": ecommerceTransactions,
  "Stock Prices": stockPrices,
  "Content Tracking": contentTracking,
  "Web Analytics Starter Kit": webAnalytics,
  "Log Analytics Starter Kit": logAnalytics,
  Flappybird: flappybird,
  Sportsbetting: sportsbetting,
};
