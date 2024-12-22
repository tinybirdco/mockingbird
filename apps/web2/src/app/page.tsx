"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-2xl mx-auto text-center">
      <Image
        src="/logo.svg"
        alt="Mockingbird Logo"
        width={64}
        height={64}
        className="mb-8"
      />
      <h1 className="text-4xl font-bold mb-4">
        Welcome to Mockingbird
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Generate realistic mock data for your applications. Define your schema,
        configure your destination, and start generating data in minutes.
      </p>
      <Button 
        size="lg"
        onClick={() => router.push("/schema")}
      >
        Get Started
      </Button>
    </div>
  );
}
