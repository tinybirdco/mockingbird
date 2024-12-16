"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { destinations } from "@/lib/constants";

export function DestinationPicker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (generator: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("destination", generator.toLowerCase());
    router.replace(`/?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {destinations.map((destination) => (
        <Card
          key={destination.generator}
          className="p-6 cursor-pointer hover:bg-muted transition-colors"
          onClick={() => handleSelect(destination.generator)}
        >
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 shrink-0">
              <Image
                src={destination.icon}
                alt={`${destination.title} logo`}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{destination.title}</h3>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
