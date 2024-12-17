"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SchemaEditor } from "@/components/schema/schema-editor";
import { Button } from "@/components/ui/button";
import { validateNavigationState } from "@/lib/navigation";

export default function SchemaPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const { redirectPath } = validateNavigationState(pathname, searchParams);
    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [pathname, searchParams, router]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Schema Editor</h1>
        <Button>Save Schema</Button>
      </div>
      <SchemaEditor />
    </div>
  );
}
