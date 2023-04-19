import { PresetSchemaName, Schema } from "./types";

const presetSchemas: Record<PresetSchemaName, Schema> = {
  "Simple Example": {
    some_int: {
      type: "datatype.number",
    },
    some_values: {
      type: "mockingbird.pick",
      params: [
        {
          values: [123, 456],
        },
      ],
    },
    values_weighted: {
      type: "mockingbird.pickWeighted",
      params: [
        {
          values: [123, 456, 789],
          weights: [90, 7, 3],
        },
      ],
    },
  },
  "eCommerce Transactions": {
    timestamp: {
      type: "mockingbird.timestampNow",
    },
    store_id: {
      type: "datatype.number",
      params: [
        {
          min: 1,
          max: 6,
        },
      ],
    },
    browser: {
      type: "mockingbird.pickWeighted",
      params: [
        {
          values: ["Chrome", "Brave", "Firefox", "Safari"],
          weights: [65, 3, 8, 20],
        },
      ],
    },
    product_id: {
      type: "datatype.number",
      params: [
        {
          min: 3278123,
          max: 3378123,
        },
      ],
    },
    promo: {
      type: "mockingbird.pickWeighted",
      params: [
        {
          values: [0, 1],
          weights: [19, 1],
        },
      ],
    },
    sales: {
      type: "mockingbird.pickWeighted",
      params: [
        {
          values: [1, 2, 3, 4],
          weights: [50, 5, 2, 1],
        },
      ],
    },
    utm_source: {
      type: "mockingbird.pickWeighted",
      params: [
        {
          values: ["instagram", "newsletter", "tiktok", "search_engine"],
          weights: [65, 13, 18, 20],
        },
      ],
    },
  },
  "Stock Prices": {
    amount: {
      type: "datatype.float",
    },
    date: {
      type: "mockingbird.datetimeNow",
    },
    stock_symbol: {
      type: "mockingbird.pick",
      params: [
        {
          values: [
            "ABF:XLON",
            "ADS:XETR",
            "APG:XNYS",
            "APPS:XMAD",
            "BLNK:XNAS",
            "BNZL:XLON",
            "CGNX:XNAS",
            "COHR:XNAS",
            "DBX:XNAS",
            "DECK:XNYS",
            "DNN:XNYS",
            "DOM:XMAD",
            "DV:XNYS",
            "EDP:XLIS",
            "EIX:XNYS",
            "GFC:XPAR",
            "GRE:XMAD",
            "INO:XNAS",
            "LFG:XNYS",
            "LIN:XNYS",
            "LOGN:XSWX",
            "MAC:XNYS",
            "MAT:XNAS",
            "NMTR:XNAS",
            "NSC:XNYS",
            "PACW:XNAS",
            "RGA:XNYS",
            "SDR:XLON",
            "SGO:XPAR",
            "TMO:XNYS",
            "TRE:XMAD",
            "TRIP:XNAS",
            "TRV:XNYS",
            "WB:XNAS",
            "ZTO:XNYS",
          ],
        },
      ],
    },
  },
  "Flight Bookings": {
    timestamp: {
      type: "mockingbird.timestampNow",
    },
    transaction_id: {
      type: "datatype.uuid",
    },
    name: {
      type: "name.fullName",
    },
    email: {
      type: "internet.email",
    },
    age: {
      type: "datatype.number",
      params: [
        {
          min: 18,
          max: 99,
        },
      ],
    },
    passport_number: {
      type: "datatype.number",
      params: [
        {
          min: 3456789,
          max: 9876543,
        },
      ],
    },
    flight_from: {
      type: "address.cityName",
    },
    flight_to: {
      type: "address.cityName",
    },
    extra_bags: {
      type: "mockingbird.pickWeighted",
      params: [
        {
          values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          weights: [45, 35, 10, 4, 2, 1, 1, 1, 1],
        },
      ],
    },
    priority_boarding: {
      type: "datatype.boolean",
    },
    meal_choice: {
      type: "mockingbird.pickWeighted",
      params: [
        {
          values: ["none", "vegan", "vegetarian", "halal", "kosher", "gluten"],
          weights: [60, 5, 10, 10, 10, 5],
        },
      ],
    },
    airline: {
      type: "mockingbird.pickWeighted",
      params: [
        {
          values: [
            "BrianAir",
            "Fizz",
            "EasyPlane",
            "Skittish Airways",
            "GAS",
            "Ler Dingus",
            "Red Balloon",
          ],
          weights: [20, 5, 15, 20, 15, 10, 15],
        },
      ],
    },
  },
  "Content Tracking": {
    timestamp: {
      type: "mockingbird.timestampNow",
    },
    userId: {
      type: "datatype.uuid",
    },
    contentId: {
      type: "datatype.number",
      params: [
        {
          min: 12345,
          max: 36923,
        },
      ],
    },
    eventType: {
      type: "mockingbird.pickWeighted",
      params: [
        {
          values: [
            "click",
            "view more",
            "preview",
            "borrow",
            "place a hold",
            "share",
            "add to favorites",
            "add to list",
          ],
          weights: [60, 12, 33, 21, 20, 2, 5, 6],
        },
      ],
    },
    institutionID: {
      type: "datatype.number",
      params: [
        {
          min: 123,
          max: 369,
        },
      ],
    },
  },
  "Web Analytics Starter Kit": {
    timestamp: {
      type: "mockingbird.timestampNow",
    },
    session_id: {
      type: "datatype.uuid",
    },
    action: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["page_hit"],
        },
      ],
    },
    version: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["1"],
        },
      ],
    },
    payload: {
      type: "mockingbird.pick",
      params: [
        {
          values: [
            '{ "user-agent":"Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", "locale":"en-US", "referrer":"https://www.kike.io", "pathname":"/blog-posts/data-market-whitebox-replaces-4-data-stack-tools-with-tinybird", "href":"https://www.tinybird.co/blog-posts/data-market-whitebox-replaces-4-data-stack-tools-with-tinybird"}',
            '{ "user-agent":"Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/104.0.5112.79 Safari/537.36", "locale":"en-US", ocation":"IT", "referrer":"https://www.hn.com", "pathname":"/guide/fine-tuning-csvs-for-fast-ingestion", "href":"https://www.tinybird.co/guide/fine-tuning-csvs-for-fast-ingestion"}',
            '{ "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0", "locale":"en-GB", "location":"ES", "referrer":"", "pathname":"/", "href":"https://www.tinybird.co"}',
            '{ "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0", "locale":"en-US", "location":"US", "referrer":"https://www.google.com", "pathname":"/", "href":"https://www.tinybird.co"}',
            '{ "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36", "locale":"en-US", "location":"US", "referrer":"https://www.tinybird.co/why-tinybird", "pathname":"/pricing", "href":"https://www.tinybird.co/pricing"}',
            '{ "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36", "locale":"en-US", "location":"US", "referrer":"https://www.google.com", "pathname":"/product", "href":"https://www.tinybird.co/product"}',
            '{ "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36", "locale":"en-US", "location":"IL", "referrer":"https://www.google.com", "pathname":"/blog-posts/tips-5-adding-and-subtracting-intervals", "href":"https://www.tinybird.co/blog-posts/tips-5-adding-and-subtracting-intervals"}',
            '{ "user-agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1", "locale":"es-ES", "location":"ES", "referrer":"https://www.twitter.com", "pathname":"/", "href":"https://www.tinybird.co"}',
            '{ "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36", "locale":"en-US", "location":"GB", "referrer":"https://www.facebook.com", "pathname":"/", "href":"https://www.tinybird.co"}',
            '{ "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36", "locale":"en-US", "location":"CH", "referrer":"https://www.qq.ch", "pathname":"guides", "href":"https://www.tinybird.co/guides"}',
            '{ "user-agent":"Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.5249.118 Mobile Safari/537.36", "locale":"en-US", "location":"US", "referrer":"https://www.yandex.com", "pathname":"/product", "href":"https://www.tinybird.co/product"}',
            '{ "user-agent":"Mozilla/5.0 (Linux; Android 13; SM-A102U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.5249.118 Mobile Safari/537.36", "locale":"en-US", "location":"FR", "referrer":"https://www.github.com", "pathname":"/pricing", "href":"https://www.tinybird.co/pricing"}',
          ],
        },
      ],
    },
  },
  "Log Analytics Starter Kit": {
    acceptcharset: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["unknown"],
        },
      ],
    },
    acceptencoding: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["deflate, gzip", "gzip, deflate, br", "gzip"],
        },
      ],
    },
    acceptlanguage: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["en-GB,en-US;q=0.9,en;q=0.8", "unknown"],
        },
      ],
    },
    browsername: {
      type: "mockingbird.browserName",
    },
    browserversion: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["107.0", "107.0.0.0", "86.0.4240.80"],
        },
      ],
    },
    cachecontrol: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["max-age=0", "unknown", "no-cache"],
        },
      ],
    },
    city: {
      type: "address.cityName",
    },
    connection: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["Keep-Alive"],
        },
      ],
    },
    contentlength: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["unknown"],
        },
      ],
    },
    contenttype: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["unknown"],
        },
      ],
    },
    country: {
      type: "address.countryCode",
      params: ["alpha-2"]
    },
    cpuarchitecture: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["unknown", "amd64"],
        },
      ],
    },
    devicemodel: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["unknown"],
        },
      ],
    },
    devicetype: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["unknown"],
        },
      ],
    },
    devicevendor: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["unknown"],
        },
      ],
    },
    enginename: {
      type: "mockingbird.browserEngineName",
    },
    engineversion: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["107.0", "107.0.0.0", "86.0.4240.80"],
        },
      ],
    },
    event_ts: {
      type: "mockingbird.timestampNow",
    },
    from: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["unknown"],
        },
      ],
    },
    headers: {
      type: "mockingbird.pick",
      params: [
        {
          values: [
            "accept,accept-encoding,connection,host,user-agent,x-forwarded-for,x-forwarded-host,x-forwarded-proto,x-real-ip,x-vercel-edge-region,x-vercel-id,x-vercel-ip-city,x-vercel-ip-country,x-vercel-ip-country-region,x-vercel-ip-latitude,x-vercel-ip-longitude,x-vercel-ip-timezone,x-vercel-proxied-for",
            "accept,accept-encoding,accept-language,cache-control,connection,host,sec-ch-ua,sec-ch-ua-mobile,sec-ch-ua-platform,sec-fetch-dest,sec-fetch-mode,sec-fetch-site,sec-fetch-user,upgrade-insecure-requests,user-agent,x-forwarded-for,x-forwarded-host,x-forwarded-proto,x-real-ip,x-vercel-edge-region,x-vercel-id,x-vercel-ip-city,x-vercel-ip-country,x-vercel-ip-country-region,x-vercel-ip-latitude,x-vercel-ip-longitude,x-vercel-ip-timezone,x-vercel-proxied-for",
            "accept,accept-encoding,accept-language,connection,host,sec-ch-ua,sec-ch-ua-mobile,sec-ch-ua-platform,sec-fetch-dest,sec-fetch-mode,sec-fetch-site,sec-fetch-user,upgrade-insecure-requests,user-agent,x-forwarded-for,x-forwarded-host,x-forwarded-proto,x-real-ip,x-vercel-edge-region,x-vercel-id,x-vercel-ip-city,x-vercel-ip-country,x-vercel-ip-country-region,x-vercel-ip-latitude,x-vercel-ip-longitude,x-vercel-ip-timezone,x-vercel-proxied-for",
          ],
        },
      ],
    },
    host: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["https://log-analytics.tinybird.co"],
        },
      ],
    },
    ip_address: {
      type: "mockingbird.pick",
      params: [
        {
          values: [
            "131.193.63.35",
            "136.51.218.209",
            "114.199.206.246",
            "5.56.231.189",
            "63.186.41.153",
            "88.192.158.134",
            "223.101.73.170",
            "61.35.129.108",
            "132.224.105.232",
            "125.229.8.125",
            "35.116.15.55",
            "135.103.19.171",
            "12.234.10.230",
            "244.50.216.166",
            "92.106.31.254",
            "164.172.162.6",
            "169.139.2.145",
            "187.104.128.230",
            "146.231.248.20",
            "73.37.121.172",
            "46.233.101.221",
            "38.139.152.20",
            "221.132.91.129",
            "242.221.17.93",
            "212.39.236.181",
            "150.147.164.150",
            "19.235.215.252",
            "33.70.179.57",
            "0.199.1.195",
            "241.248.60.81",
            "87.89.154.186",
            "0.205.245.230",
            "191.101.56.147",
            "142.244.241.167",
            "221.73.118.23",
            "137.116.138.105",
            "193.57.80.248",
            "7.138.8.8",
            "19.190.78.24",
            "247.5.181.70",
            "67.67.187.20",
            "2.174.213.137",
            "154.48.101.180",
            "75.173.26.25",
            "84.72.65.209",
            "41.227.234.157",
            "82.158.16.245",
            "159.113.221.220",
            "155.212.16.126",
            "217.237.64.201",
            "214.199.246.230",
            "20.235.163.219",
            "107.137.129.13",
            "206.182.165.24",
            "232.177.172.195",
            "188.218.192.103",
            "111.200.211.74",
            "159.174.148.204",
            "194.46.159.208",
            "96.27.126.107",
            "92.194.105.174",
            "9.79.157.249",
            "215.97.251.180",
            "188.146.152.7",
            "13.146.15.73",
            "200.62.24.238",
            "26.229.48.75",
            "113.56.136.232",
            "165.45.202.122",
            "112.81.47.101",
            "158.109.206.235",
            "118.49.62.165",
            "158.248.78.235",
            "166.181.249.157",
            "54.154.19.54",
            "231.253.232.206",
            "18.29.56.81",
            "172.16.60.94",
            "55.225.63.165",
            "85.219.165.210",
            "216.78.134.3",
            "192.65.52.162",
            "130.106.168.81",
            "238.121.229.154",
            "208.217.159.180",
            "46.38.34.68",
            "59.236.49.50",
            "14.2.127.20",
            "111.198.231.103",
            "143.189.199.178",
            "6.7.246.74",
            "201.43.78.217",
            "49.106.69.76",
            "194.89.12.52",
            "142.159.132.142",
            "97.131.215.242",
            "111.128.5.86",
            "115.243.65.248",
            "198.205.143.144",
            "89.219.76.53",
          ],
        },
      ],
    },
    isbot: {
      type: "mockingbird.pick",
      params: [
        {
          values: [0],
        },
      ],
    },
    latitude: {
      type: "address.latitude",
    },
    log_level: {
      type: "mockingbird.pickWeighted",
      params: [
        {
          values: ["INFO", "WARN", "ERROR"],
          weights: [85, 12, 3],
        },
      ],
    },
    log_message: {
      type: "random.words",
      params: [10],
    },
    longitude: {
      type: "address.longitude",
    },
    method: {
      type: "internet.httpMethod",
    },
    origin: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["unknown"],
        },
      ],
    },
    osname: {
      type: "mockingbird.osName",
    },
    osversion: {
      type: "system.semver",
    },
    protocol: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["https"],
        },
      ],
    },
    referer: {
      type: "mockingbird.searchEngineName",
    },
    region: {
      type: "address.countryCode",
      params: ["alpha-3"]
    },
    url: {
      type: "mockingbird.pickWeighted",
      params: [
        {
          values: [
            "https://log-analytics.tinybird.co/api/dummy/item",
            "https://log-analytics.tinybird.co/api/dummy/search",
            "https://log-analytics.tinybird.co/api/dummy/checkout",
            "https://log-analytics.tinybird.co/api/dummy/login",
            "https://log-analytics.tinybird.co/api/dummy/register",
            "https://log-analytics.tinybird.co/api/dummy/secretAPI",
          ],
          weights: [40, 30, 10, 5, 5, 10],
        },
      ],
    },
    useragent: {
      type: "internet.userAgent",
    },
    via: {
      type: "mockingbird.pick",
      params: [
        {
          values: ["unknown"],
        },
      ],
    },
    xforwaredforip: {
      type: "mockingbird.pick",
      params: [
        {
          values: [
            "131.193.63.35",
            "136.51.218.209",
            "114.199.206.246",
            "5.56.231.189",
            "63.186.41.153",
            "88.192.158.134",
            "223.101.73.170",
            "61.35.129.108",
            "132.224.105.232",
            "125.229.8.125",
            "35.116.15.55",
            "135.103.19.171",
            "12.234.10.230",
            "244.50.216.166",
            "92.106.31.254",
            "164.172.162.6",
            "169.139.2.145",
            "187.104.128.230",
            "146.231.248.20",
            "73.37.121.172",
            "46.233.101.221",
            "38.139.152.20",
            "221.132.91.129",
            "242.221.17.93",
            "212.39.236.181",
            "150.147.164.150",
            "19.235.215.252",
            "33.70.179.57",
            "0.199.1.195",
            "241.248.60.81",
            "87.89.154.186",
            "0.205.245.230",
            "191.101.56.147",
            "142.244.241.167",
            "221.73.118.23",
            "137.116.138.105",
            "193.57.80.248",
            "7.138.8.8",
            "19.190.78.24",
            "247.5.181.70",
            "67.67.187.20",
            "2.174.213.137",
            "154.48.101.180",
            "75.173.26.25",
            "84.72.65.209",
            "41.227.234.157",
            "82.158.16.245",
            "159.113.221.220",
            "155.212.16.126",
            "217.237.64.201",
            "214.199.246.230",
            "20.235.163.219",
            "107.137.129.13",
            "206.182.165.24",
            "232.177.172.195",
            "188.218.192.103",
            "111.200.211.74",
            "159.174.148.204",
            "194.46.159.208",
            "96.27.126.107",
            "92.194.105.174",
            "9.79.157.249",
            "215.97.251.180",
            "188.146.152.7",
            "13.146.15.73",
            "200.62.24.238",
            "26.229.48.75",
            "113.56.136.232",
            "165.45.202.122",
            "112.81.47.101",
            "158.109.206.235",
            "118.49.62.165",
            "158.248.78.235",
            "166.181.249.157",
            "54.154.19.54",
            "231.253.232.206",
            "18.29.56.81",
            "172.16.60.94",
            "55.225.63.165",
            "85.219.165.210",
            "216.78.134.3",
            "192.65.52.162",
            "130.106.168.81",
            "238.121.229.154",
            "208.217.159.180",
            "46.38.34.68",
            "59.236.49.50",
            "14.2.127.20",
            "111.198.231.103",
            "143.189.199.178",
            "6.7.246.74",
            "201.43.78.217",
            "49.106.69.76",
            "194.89.12.52",
            "142.159.132.142",
            "97.131.215.242",
            "111.128.5.86",
            "115.243.65.248",
            "198.205.143.144",
            "89.219.76.53",
          ],
        },
      ],
    },
  },
};

export default presetSchemas;
