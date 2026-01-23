"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { WofRecord, vehicleFromConvexToWofRecord } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SearchInput } from "@/components/dashboard/SearchInput";
import { WofTable } from "@/components/dashboard/WofTable";
import { Loading03Icon } from "@/lib/icons";
import { Icon } from "@/components/ui/icon";
import { Id } from "@/convex/_generated/dataModel";

function LoadingScreen() {
  return (
    <div className="grow flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <Icon
          icon={Loading03Icon}
          size={48}
          strokeWidth={1}
          className="animate-spin text-primary"
        />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function UnauthenticatedScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-4">
          <p className="text-muted-foreground">
            Please sign in to access the dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const vehicles = useQuery(api.vehicles.getVehicles);
  const createVehicle = useMutation(api.vehicles.createVehicle);
  const updateVehicle = useMutation(api.vehicles.updateVehicle);
  const deleteVehicle = useMutation(api.vehicles.deleteVehicle);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<
    "clientName" | "plateNumber" | "expiryDate"
  >("expiryDate");

  const isDataLoading = vehicles === undefined;

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <UnauthenticatedScreen />;
  }

  const wofData: WofRecord[] = (vehicles || []).map(
    vehicleFromConvexToWofRecord,
  );

  const filteredData = wofData.filter(
    (wof) =>
      wof.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wof.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const hasVehicles = sortedData.length > 0;
  const hasAnyVehicles = wofData.length > 0;

  const handleSort = (column: "clientName" | "plateNumber" | "expiryDate") => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleAdd = async (data: WofRecord) => {
    await createVehicle({
      clientName: data.clientName,
      clientPhoneNumber: data.clientPhoneNumber,
      plateNumber: data.plateNumber,
      make: data.make,
      expiryDate: data.expiryDate,
      reminderInterval: data.reminderInterval,
    });
  };

  const handleEdit = async (record: WofRecord) => {
    if (!record.id) return;
    await updateVehicle({
      id: record.id as Id<"vehicles">,
      clientName: record.clientName,
      clientPhoneNumber: record.clientPhoneNumber,
      plateNumber: record.plateNumber,
      make: record.make,
      expiryDate: record.expiryDate,
      reminderInterval: record.reminderInterval,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteVehicle({ id: id as Id<"vehicles"> });
  };

  return (
    <div className="grow flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl">
        <DashboardHeader
          onAdd={handleAdd}
          isLoading={isDataLoading}
          hasVehicles={hasVehicles}
        />
        <CardContent>
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
          <WofTable
            data={sortedData}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            hasAnyVehicles={hasAnyVehicles}
          />
        </CardContent>
      </Card>
    </div>
  );
}
