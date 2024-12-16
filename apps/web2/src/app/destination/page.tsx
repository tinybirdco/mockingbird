"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DestinationPicker } from "@/components/destination/destination-picker";
import { ConfigForm } from "@/components/destination/config-form";
import {
  tinybirdConfigItems,
  ablyConfigItems,
  awsSnsConfigItems,
  destinations,
} from "@/lib/constants";
import { validateNavigationState } from "@/lib/navigation";

const configItems = {
  tinybird: tinybirdConfigItems,
  ably: ablyConfigItems,
  awssns: awsSnsConfigItems,
};

export default function DestinationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedDestination = searchParams.get("destination");

  useEffect(() => {
    const { redirectPath } = validateNavigationState(pathname, searchParams);
    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [pathname, searchParams, router]);

  // If no destination is selected, show the picker
  if (!selectedDestination) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Select Destination</h1>
        <DestinationPicker />
      </div>
    );
  }

  // Get configuration items for selected destination
  const items = configItems[selectedDestination as keyof typeof configItems];
  const destinationInfo = destinations.find(
    (d) => d.generator.toLowerCase() === selectedDestination
  );

  if (!items || !destinationInfo) {
    return <div>Invalid destination selected</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">
        Configure {destinationInfo.title}
      </h1>
      <p className="text-muted-foreground mb-6">
        Enter your {destinationInfo.title} credentials to start generating data
      </p>
      <ConfigForm items={items} />
    </div>
  );
}
