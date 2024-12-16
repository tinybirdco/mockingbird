"use client";

import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

const templates = [
  {
    name: "Simple User",
    schema: {
      name: "string",
      age: "number",
      email: "email",
    },
  },
  {
    name: "Product",
    schema: {
      id: "uuid",
      name: "string",
      price: "number",
      description: "string",
      inStock: "boolean",
    },
  },
];

export function SchemaEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editorRef = useRef(null);
  const [error, setError] = useState<string | null>(null);

  // Try to load existing schema from URL
  const existingSchema = searchParams.get("schema");
  const defaultValue = existingSchema 
    ? JSON.stringify(JSON.parse(existingSchema), null, 2)
    : "{}";

  const handleTemplateChange = (value: string) => {
    const template = templates.find((t) => t.name === value);
    if (template && editorRef.current) {
      const editor = editorRef.current as any;
      editor.setValue(JSON.stringify(template.schema, null, 2));
      setError(null);
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleSave = () => {
    if (!editorRef.current) return;

    const editor = editorRef.current as any;
    const value = editor.getValue();

    try {
      // Validate JSON
      const schema = JSON.parse(value);

      // Additional validation could go here
      // For example, checking that all fields have valid types

      // Update URL with new schema
      const params = new URLSearchParams(searchParams);
      params.set("schema", JSON.stringify(schema));
      router.replace(`/?${params.toString()}`);
      setError(null);
    } catch (e) {
      setError("Invalid JSON schema. Please check your syntax.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Select onValueChange={handleTemplateChange}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a template..." />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.name} value={template.name}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSave}>Save Schema</Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex-1 border rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="json"
          defaultValue={defaultValue}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
}
