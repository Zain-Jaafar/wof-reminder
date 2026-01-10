"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import {
  Car01Icon,
  Add01Icon,
  Search01Icon,
  AArrowDown,
  AArrowUp,
  Calendar03Icon,
  Edit02Icon,
  Delete02Icon,
  CheckmarkCircle01Icon,
  Clock03Icon,
  CancelCircleIcon,
} from "@/lib/icons";

const iconMap = {
  CheckmarkCircle01Icon,
  Clock03Icon,
  CancelCircleIcon,
} as const;
import {
  WofRecord,
  nzVehicleMakes,
  initialWofData,
  formatDate,
  getStatus,
} from "@/lib/utils";

export default function Dashboard() {
  const [wofData, setWofData] = useState<WofRecord[]>(initialWofData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<
    "name" | "licensePlate" | "expiryDate"
  >("expiryDate");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WofRecord | null>(null);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WofRecord>({
    defaultValues: {
      name: "",
      licensePlate: "",
      vehicleMake: "",
      expiryDate: new Date(),
    },
  });

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

  const handleAddSubmit = (data: WofRecord) => {
    const maxId = Math.max(...wofData.map((r) => parseInt(r.id)), 0);
    const newId = (maxId + 1).toString();

    const newRecord: WofRecord = {
      ...data,
      id: newId,
      expiryDate: selectedDate || data.expiryDate,
    };
    setWofData([...wofData, newRecord]);
    reset();
    setSelectedDate(undefined);
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (data: WofRecord) => {
    if (!editingRecord) return;

    const updatedData = wofData.map((record) =>
      record.id === editingRecord.id
        ? { ...record, ...data, expiryDate: selectedDate || data.expiryDate }
        : record,
    );
    setWofData(updatedData);
    reset();
    setSelectedDate(undefined);
    setEditingRecord(null);
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteRecordId) {
      setWofData(wofData.filter((record) => record.id !== deleteRecordId));
      setDeleteRecordId(null);
    }
  };

  const closeDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    reset();
    setSelectedDate(undefined);
    setEditingRecord(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon={Car01Icon} size={24} className="text-foreground" />
              <CardTitle>WoF Management Dashboard</CardTitle>
            </div>
            <Dialog
              open={isAddDialogOpen}
              onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (open) {
                  reset({
                    name: "",
                    licensePlate: "",
                    vehicleMake: "",
                    expiryDate: new Date(),
                  });
                  setSelectedDate(undefined);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Icon icon={Add01Icon} size={20} />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New WOF Record</DialogTitle>
                  <DialogDescription>
                    Enter details for a new client&apos;s WOF record.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(handleAddSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Client Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter client name"
                      {...register("name", {
                        required: "Client name is required",
                      })}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licensePlate">License Plate *</Label>
                    <Input
                      id="licensePlate"
                      placeholder="e.g., ABC123"
                      {...register("licensePlate", {
                        required: "License plate is required",
                        minLength: {
                          value: 3,
                          message:
                            "License plate must be at least 3 characters",
                        },
                      })}
                    />
                    {errors.licensePlate && (
                      <p className="text-sm text-destructive">
                        {errors.licensePlate.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">Vehicle Make *</Label>
                    <select
                      id="vehicleMake"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...register("vehicleMake", {
                        required: "Vehicle make is required",
                      })}
                    >
                      <option value="">Select vehicle make</option>
                      {nzVehicleMakes.map((make) => (
                        <option key={make} value={make}>
                          {make}
                        </option>
                      ))}
                    </select>
                    {errors.vehicleMake && (
                      <p className="text-sm text-destructive">
                        {errors.vehicleMake.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <input
                      type="hidden"
                      {...register("expiryDate", {
                        required: "Expiry date is required",
                      })}
                    />
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) setValue("expiryDate", date);
                      }}
                      className="rounded-md border w-[50%]"
                    />
                    {errors.expiryDate && (
                      <p className="text-sm text-destructive">
                        {errors.expiryDate.message}
                      </p>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeDialogs}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add WOF</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Icon
                icon={Search01Icon}
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Search by name or license plate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Name
                    {sortColumn === "name" && (
                      <Icon
                        icon={sortOrder === "asc" ? AArrowDown : AArrowUp}
                        size={16}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("licensePlate")}
                >
                  <div className="flex items-center gap-2">
                    License Plate
                    {sortColumn === "licensePlate" && (
                      <Icon
                        icon={sortOrder === "asc" ? AArrowDown : AArrowUp}
                        size={16}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead>Vehicle Make</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("expiryDate")}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Icon icon={Calendar03Icon} size={16} />
                      Expiry Date
                    </div>
                    {sortColumn === "expiryDate" && (
                      <Icon
                        icon={sortOrder === "asc" ? AArrowDown : AArrowUp}
                        size={16}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((wof) => (
                <TableRow key={wof.id}>
                  <TableCell>{wof.name}</TableCell>
                  <TableCell className="font-medium">
                    {wof.licensePlate}
                  </TableCell>
                  <TableCell>{wof.vehicleMake}</TableCell>
                  <TableCell>{formatDate(wof.expiryDate)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        getStatus(wof.expiryDate).variant as
                          | "success"
                          | "warning"
                          | "destructive"
                      }
                    >
                      <Icon
                        icon={iconMap[getStatus(wof.expiryDate).icon]}
                        size={14}
                        className="mr-1"
                      />
                      {getStatus(wof.expiryDate).status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open);
                          if (!open) {
                            setEditingRecord(null);
                            reset();
                            setSelectedDate(undefined);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingRecord(wof);
                              setSelectedDate(wof.expiryDate);
                              reset({
                                name: wof.name,
                                licensePlate: wof.licensePlate,
                                vehicleMake: wof.vehicleMake,
                                expiryDate: wof.expiryDate,
                              });
                            }}
                          >
                            <Icon icon={Edit02Icon} size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit WOF Record</DialogTitle>
                            <DialogDescription>
                              Update client&apos;s WOF record information.
                            </DialogDescription>
                          </DialogHeader>
                          <form
                            onSubmit={handleSubmit(handleEditSubmit)}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Client Name *</Label>
                              <Input
                                id="edit-name"
                                placeholder="Enter client name"
                                {...register("name", {
                                  required: "Client name is required",
                                })}
                              />
                              {errors.name && (
                                <p className="text-sm text-destructive">
                                  {errors.name.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-licensePlate">
                                License Plate *
                              </Label>
                              <Input
                                id="edit-licensePlate"
                                placeholder="e.g., ABC123"
                                {...register("licensePlate", {
                                  required: "License plate is required",
                                  minLength: {
                                    value: 3,
                                    message:
                                      "License plate must be at least 3 characters",
                                  },
                                })}
                              />
                              {errors.licensePlate && (
                                <p className="text-sm text-destructive">
                                  {errors.licensePlate.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-vehicleMake">
                                Vehicle Make *
                              </Label>
                              <select
                                id="edit-vehicleMake"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                {...register("vehicleMake", {
                                  required: "Vehicle make is required",
                                })}
                              >
                                <option value="">Select vehicle make</option>
                                {nzVehicleMakes.map((make) => (
                                  <option key={make} value={make}>
                                    {make}
                                  </option>
                                ))}
                              </select>
                              {errors.vehicleMake && (
                                <p className="text-sm text-destructive">
                                  {errors.vehicleMake.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-expiryDate">
                                Expiry Date *
                              </Label>
                              <input
                                type="hidden"
                                {...register("expiryDate", {
                                  required: "Expiry date is required",
                                })}
                              />
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                  setSelectedDate(date);
                                  if (date) setValue("expiryDate", date);
                                }}
                                className="rounded-md border w-[50%]"
                              />
                              {errors.expiryDate && (
                                <p className="text-sm text-destructive">
                                  {errors.expiryDate.message}
                                </p>
                              )}
                            </div>

                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={closeDialogs}
                              >
                                Cancel
                              </Button>
                              <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog
                        open={!!deleteRecordId}
                        onOpenChange={(open) =>
                          !open && setDeleteRecordId(null)
                        }
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setDeleteRecordId(wof.id)}
                          >
                            <Icon icon={Delete02Icon} size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete WOF Record
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {wof.name}&apos;s
                              WOF record? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
