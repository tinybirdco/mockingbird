"use client";

import { Editor, type OnMount } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { presetSchemas } from "@tinybirdco/mockingbird/client";
import { TEMPLATE_OPTIONS } from "@/lib/constants";
import { useQueryState } from "nuqs";
import JSONCrush from "jsoncrush";

export function SchemaEditor() {
  const router = useRouter();
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("Custom");
  const [schema, setSchema] = useQueryState("schema", {
    parse: (value: string) => {
      const uncrushed = JSONCrush.uncrush(decodeURIComponent(value));
      return JSON.parse(uncrushed);
    },
    serialize: (value: object) => {
      const stringified = JSON.stringify(value);
      return encodeURIComponent(JSONCrush.crush(stringified));
    },
  });

  // Initialize editor value based on template or schema
  const getInitialValue = () => {
    if (schema) {
      return JSON.stringify(schema, null, 2);
    }
    return "{}";
  };

  const handleTemplateChange = (templateName: string) => {
    setSelectedTemplate(templateName);
    
    if (templateName === "Custom") {
      setSchema({});
    } else {
      setSchema(presetSchemas[templateName]);
    }
    
    if (editorRef.current) {
      editorRef.current.setValue(templateName === "Custom" ? "{}" : JSON.stringify(presetSchemas[templateName], null, 2));
    }
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    // Add change listener to detect when user modifies the schema
    editor.onDidChangeModelContent(() => {
      try {
        const value = editor.getValue();
        const parsed = JSON.parse(value);
        setSchema(parsed);
      } catch (e) {
        // If JSON is invalid, don't update the schema
        console.error("Invalid JSON:", e);
      }
    });
  };

  const handleSave = async () => {
    if (!editorRef.current) return;

    const value = editorRef.current.getValue();

    try {
      // Validate JSON
      const schemaValue = JSON.parse(value);
      await setSchema(schemaValue);
      setError(null);
      
      // Navigate to generate step with search params
      const searchParams = new URLSearchParams(window.location.search);
      router.push(`/generate?${searchParams.toString()}`);
    } catch (e) {
      if (e instanceof Error) {
        setError("Invalid JSON schema. Please check your syntax. " + e.message);
      } else {
        setError("Invalid JSON schema. Please check your syntax.");
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Select 
          value={selectedTemplate} 
          onValueChange={handleTemplateChange}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a template..." />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATE_OPTIONS.map((templateName) => (
              <SelectItem key={templateName} value={templateName}>
                {templateName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSave}>Save & Continue</Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex-1 overflow-hidden rounded-md border">
        <Editor
          defaultValue={getInitialValue()}
          onMount={handleEditorDidMount}
          language="json"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            wrappingStrategy: "advanced",
          }}
        />
      </div>
    </div>
  );
}
