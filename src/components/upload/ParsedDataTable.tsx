
import { useState } from "react";
import { Table, TableBody, TableRow, TableCell, TableHead, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle } from "lucide-react";

interface ParsedDataTableProps {
  data: any[];
  onSave: () => void;
}

export function ParsedDataTable({ data, onSave }: ParsedDataTableProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave();
    setSaved(true);
  };

  if (!data.length) {
    return null;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Preview ({data.length} items)</h2>
        <Button
          onClick={handleSave}
          disabled={saved}
          className="gap-2"
        >
          {saved ? <Check className="h-4 w-4" /> : null}
          {saved ? "Imported Successfully" : "Import Data"}
        </Button>
      </div>

      {data.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.slice(0, 5).map((header) => (
                    <TableHead key={header}>
                      {header.replace(/_/g, ' ')}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slice(0, 10).map((row, i) => (
                  <TableRow key={i}>
                    {headers.slice(0, 5).map((header) => (
                      <TableCell key={header}>
                        {row[header] || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {data.length > 10 && (
            <div className="p-2 text-center text-sm text-muted-foreground">
              <AlertCircle className="inline mr-1 h-3 w-3" />
              Showing 10 of {data.length} records
            </div>
          )}
        </div>
      )}
    </div>
  );
}
