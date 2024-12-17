"use client";

import { Editor } from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";
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

export function SchemaEditor() {
  const router = useRouter();
  const editorRef = useRef(null);
  const [error, setError] = useState<string | null>(null);
  const [isEdited, setIsEdited] = useState(false);

  const [template, setTemplate] = useQueryState("template");
  const [schema, setSchema] = useQueryState("schema", {
    parse: (value: string) => JSON.parse(value),
    serialize: (value: object) => JSON.stringify(value),
  });

  // Initialize editor value based on template or schema
  const getInitialValue = () => {
    if (template && template !== "Custom") {
      return JSON.stringify(presetSchemas[template], null, 2);
    }
    if (schema) {
      return JSON.stringify(schema, null, 2);
    }
    return "{}";
  };

  const handleTemplateChange = async (templateName: string) => {
    setIsEdited(false);
    
    if (templateName === "Custom") {
      await setTemplate(null);
      await setSchema({});
    } else {
      await setTemplate(templateName);
      await setSchema(null);
    }
    
    if (editorRef.current) {
      const editor = editorRef.current as any;
      editor.setValue(templateName === "Custom" ? "{}" : JSON.stringify(presetSchemas[templateName], null, 2));
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Add change listener to detect when user modifies the schema
    editor.onDidChangeModelContent(() => {
      if (!isEdited) {
        setIsEdited(true);
        
        // If editing a template, convert it to a custom schema
        if (template) {
          const handleSchemaChange = async () => {
            await setTemplate(null);
            try {
              const value = editor.getValue();
              await setSchema(JSON.parse(value));
            } catch (e) {
              // If JSON is invalid, don't update the schema
              console.error("Invalid JSON:", e);
            }
          };
          handleSchemaChange();
        }
      }
    });
  };

  const handleSave = async () => {
    if (!editorRef.current) return;

    const editor = editorRef.current as any;
    const value = editor.getValue();

    try {
      // Validate JSON
      const schemaValue = JSON.parse(value);

      // Update URL with new schema
      await setTemplate(null);
      await setSchema(schemaValue);
      setError(null);
      setIsEdited(false);
    } catch (e) {
      setError("Invalid JSON schema. Please check your syntax.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Select 
          value={template || "Custom"} 
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
          defaultValue={getInitialValue()}
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
