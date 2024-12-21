"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GenerateStats({
  isGenerating = false,
  rowsSent = 0,
}: {
  isGenerating: boolean;
  rowsSent: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {isGenerating ? "Running" : "Idle"}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Rows Sent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rowsSent.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
