import { PRESET_SCHEMA_NAMES } from "@tinybirdco/mockingbird/client";

export const destinations = [
  {
    title: "Tinybird Events API",
    generator: "Tinybird",
    icon: "/destinations/tinybird.svg",
  },
  {
    title: "Ably",
    generator: "Ably",
    icon: "/destinations/ably.svg",
  },
  {
    title: "AWS SNS",
    generator: "AWSSNS",
    icon: "/destinations/awssns.svg",
  },
] as const;

export const TEMPLATE_OPTIONS = [...PRESET_SCHEMA_NAMES, "Custom"] as const;
