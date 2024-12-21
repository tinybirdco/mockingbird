"use client";

import { Suspense } from "react";
import { SchemaEditor } from "@/components/schema/schema-editor";

export default function SchemaPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <Suspense>
        <SchemaEditor />
      </Suspense>
    </div>
  );
}
