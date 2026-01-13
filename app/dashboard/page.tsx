"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WofRecord, initialWofData } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SearchInput } from "@/components/dashboard/SearchInput";
import { WofTable } from "@/components/dashboard/WofTable";

export default function Dashboard() {
  const [wofData, setWofData] = useState<WofRecord[]>(initialWofData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<
    "name" | "licensePlate" | "expiryDate"
  >("expiryDate");

  const filteredData = wofData.filter(
    (wof) =>
      wof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wof.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const handleSort = (column: "name" | "licensePlate" | "expiryDate") => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleAdd = (data: WofRecord) => {
    const maxId = Math.max(...wofData.map((r) => parseInt(r.id)), 0);
    const newId = (maxId + 1).toString();

    const newRecord: WofRecord = {
      ...data,
      id: newId,
    };
    setWofData([...wofData, newRecord]);
  };

  const handleEdit = (record: WofRecord) => {
    const updatedData = wofData.map((r) => (r.id === record.id ? record : r));
    setWofData(updatedData);
  };

  const handleDelete = (id: string) => {
    setWofData(wofData.filter((record) => record.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl">
        <DashboardHeader onAdd={handleAdd} />
        <CardContent>
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <WofTable
            data={sortedData}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
