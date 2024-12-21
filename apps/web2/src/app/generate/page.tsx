"use client";

import { useState } from "react";
import { GenerateStats } from "@/components/generate/generate-stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfigForm } from "@/components/destination/config-form";
import { destinations } from "@/lib/constants";
import { useQueryState } from "nuqs";

export default function GeneratePage() {
  const [destination, setDestination] = useQueryState("destination");
  const [schema] = useQueryState("schema");
  const [eventsPerSecond, setEventsPerSecond] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartGeneration = () => {
    setIsGenerating(true);
    // TODO: Start the web worker with the selected configuration
  };

  const canGenerate = destination && schema && !isGenerating;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Generate Data</h1>
        <Button 
          onClick={handleStartGeneration}
          disabled={!canGenerate}
        >
          Start Generation
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label>Destination</Label>
          <Select
            value={destination || ""}
            onValueChange={setDestination}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a destination" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((dest) => (
                <SelectItem key={dest.generator} value={dest.generator}>
                  {dest.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {destination && (
          <>
            <div className="space-y-2">
              <Label>Events Per Second</Label>
              <Input
                type="number"
                min={1}
                max={1000}
                value={eventsPerSecond}
                onChange={(e) => setEventsPerSecond(parseInt(e.target.value, 10))}
              />
            </div>

            <ConfigForm />
          </>
        )}
      </div>

      <GenerateStats />
    </div>
  );
}
