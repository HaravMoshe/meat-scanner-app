import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";

export default function MeatScannerApp() {
  const [data, setData] = useState([]);
  const [samples, setSamples] = useState({});
  const [barcode, setBarcode] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers = jsonData[0];
      const rows = jsonData.slice(1);
      const formatted = rows.map((row) => {
        const item = {};
        headers.forEach((h, i) => {
          item[h] = i === 0 ? String(row[i]).padStart(4, "0") : row[i];
        });
        return item;
      });
      setData(formatted);
    };
    reader.readAsBinaryString(file);
  };

  const parseBarcode = (code) => {
    if (code.length !== 12 || !/^\d+$/.test(code)) return [null, null];
    const upc = code.slice(2, 6);
    const priceCents = parseInt(code.slice(6, 11), 10);
    const price = priceCents / 100;
    return [upc, price];
  };

  const roundHalf = (val) => Math.round(val * 2) / 2;

  const handleScan = () => {
    const [upc, price] = parseBarcode(barcode);
    setBarcode("");
    if (!upc || !price) return alert("Invalid barcode");
    const match = data.find((item) => item["UPC"] === upc);
    if (!match) return alert(`UPC ${upc} not found`);
    const pricePerLb = parseFloat(match["Price per lb."]);
    const weight = price / pricePerLb;
    setSamples((prev) => {
      const weights = prev[upc]?.weights || [];
      return {
        ...prev,
        [upc]: {
          description: match["Description"],
          weights: [...weights, weight]
        }
      };
    });
  };

  const exportToExcel = () => {
    const exportData = Object.entries(samples).map(([upc, obj]) => {
      const avg = obj.weights.reduce((a, b) => a + b, 0) / obj.weights.length;
      return {
        UPC: upc,
        Description: obj.description,
        "Avg Weight": roundHalf(avg),
        Samples: obj.weights.length
      };
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Export");
    XLSX.writeFile(wb, "meat_stats.xlsx");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-2 items-center">
            <Input type="file" onChange={handleFileUpload} className="max-w-sm" />
            <Upload className="w-5 h-5" />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Scan barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
            />
            <Button onClick={handleScan}>Scan</Button>
          </div>
          <Button onClick={exportToExcel} variant="outline">Export Results</Button>
        </CardContent>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UPC</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Avg Weight</TableHead>
            <TableHead>Samples</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(samples).map(([upc, { description, weights }]) => {
            const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
            return (
              <TableRow key={upc}>
                <TableCell>{upc}</TableCell>
                <TableCell>{description}</TableCell>
                <TableCell>{roundHalf(avg).toFixed(1)}</TableCell>
                <TableCell>{weights.length}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
