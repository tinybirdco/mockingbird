"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ConfigForm } from "@/components/destination/config-form";
import {
  tinybirdConfigItems,
  ablyConfigItems,
  awsSnsConfigItems,
} from "@/lib/constants";
import { useQueryState } from "nuqs";

const configItems = {
  tinybird: tinybirdConfigItems,
  ably: ablyConfigItems,
  awssns: awsSnsConfigItems,
};

const destinationNames = {
  tinybird: "Tinybird",
  ably: "Ably",
  awssns: "AWS SNS",
};

export default function DestinationConfigPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = params.type as string;
  const [, setConfig] = useQueryState("config", { 
    parse: (value: string) => JSON.parse(value),
    serialize: (value: Record<string, string>) => JSON.stringify(value),
  });
  const [, setStep] = useQueryState("step");

  const items = configItems[type as keyof typeof configItems];
  const destinationName =
    destinationNames[type as keyof typeof destinationNames];

  if (!items) {
    return <div>Invalid destination type</div>;
  }

  const handleSave = async (config: Record<string, string>) => {
    await setConfig(config);
    await setStep("schema");
    
    // Create new URLSearchParams with current params
    const params = new URLSearchParams(searchParams);
    params.set("config", JSON.stringify(config));
    params.set("step", "schema");
    
    router.replace(`/schema?${params.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">
        Configure {destinationName}
      </h1>
      <p className="text-muted-foreground mb-6">
        Enter your {destinationName} credentials to start generating data
      </p>
      <ConfigForm items={items} onSave={handleSave} />
    </div>
  );
}
