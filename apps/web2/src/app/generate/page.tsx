"use client";

import { useState, useEffect } from "react";
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
import { useQueryState } from "nuqs";
import { destinations } from "@/lib/constants";
import Image from "next/image";
import { Settings2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  validateDestinationConfig,
  getDestinationFields,
  type DestinationType,
} from "@/lib/types";
import JSONCrush from "jsoncrush";

export default function GeneratePage() {
  const [destination, setDestination] = useQueryState<DestinationType | null>(
    "destination",
    {
      parse: (value) => value as DestinationType,
    }
  );
  const [config, setConfig] = useQueryState("config", {
    parse: (value: string) => {
      const uncrushed = JSONCrush.uncrush(decodeURIComponent(value));
      return JSON.parse(uncrushed);
    },
    serialize: (value: object) => {
      const stringified = JSON.stringify(value);
      return encodeURIComponent(JSONCrush.crush(stringified));
    },
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const selectedConfig = destination ? getDestinationFields(destination) : null;

  useEffect(() => {
    if (!config || !destination) return;
    for (const [key, value] of Object.entries(config)) {
      handleInputChange(key, value);
    }
  }, [config, destination]);

  const handleConfigSave = () => {
    if (!destination || !selectedConfig) return;

    const result = validateDestinationConfig(destination, formData);

    if (result.success) {
      setConfig(result.data);
      setFormErrors({});
      setIsDrawerOpen(false);
    } else {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path[0]] = err.message;
        }
      });
      setFormErrors(errors);
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Destination</Label>
          <Select value={destination || ""} onValueChange={setDestination}>
            <SelectTrigger>
              <SelectValue placeholder="Select a destination">
                {destination && (
                  <div className="flex items-center gap-2">
                    <Image
                      src={`/destinations/${destination.toLowerCase()}.svg`}
                      alt={destination}
                      width={20}
                      height={20}
                    />
                    <span>{destination}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {destinations.map((dest) => (
                <SelectItem
                  key={dest.generator}
                  value={dest.generator}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={`/destinations/${dest.generator.toLowerCase()}.svg`}
                    alt={dest.title}
                    width={20}
                    height={20}
                    className="inline mr-2"
                  />
                  <span>{dest.title}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            onClick={() => setIsDrawerOpen(true)}
            disabled={!destination}
            className="w-full"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      <GenerateStats />

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Configure {selectedConfig?.name}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            {selectedConfig?.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <Input
                  id={field.id}
                  type={field.type || "text"}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={formErrors[field.id] ? "border-red-500" : ""}
                />
                {formErrors[field.id] && (
                  <p className="text-sm text-red-500">{formErrors[field.id]}</p>
                )}
              </div>
            ))}
          </div>
          <DrawerFooter>
            <Button onClick={handleConfigSave}>Save Configuration</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
