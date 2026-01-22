"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { WofRecord, formatDate } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { WofFormDialog } from "./WofFormDialog";
import {
  AArrowDown,
  AArrowUp,
  Calendar03Icon,
  Delete02Icon,
  Edit02Icon,
  Car01Icon,
  Add01Icon,
  Search01Icon,
} from "@/lib/icons";

interface WofTableProps {
  data: WofRecord[];
  sortColumn: "clientName" | "plateNumber" | "expiryDate";
  sortOrder: "asc" | "desc";
  onSort: (column: "clientName" | "plateNumber" | "expiryDate") => void;
  onEdit: (record: WofRecord) => void;
  onDelete: (id: string) => void;
  onAdd?: (data: WofRecord) => void;
  hasAnyVehicles?: boolean;
}

export function WofTable({
  data,
  sortColumn,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onAdd,
  hasAnyVehicles = false,
}: WofTableProps) {
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [deleteClientName, setDeleteClientName] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WofRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleDeleteConfirm = () => {
    if (deleteRecordId) {
      onDelete(deleteRecordId);
      setDeleteRecordId(null);
      setDeleteClientName("");
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditClick = (record: WofRecord) => {
    setEditingRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (data: WofRecord) => {
    if (editingRecord) {
      onEdit({ ...data, id: editingRecord.id });
      setEditingRecord(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteClick = (record: WofRecord) => {
    setDeleteRecordId(record.id);
    setDeleteClientName(record.clientName);
    setIsDeleteDialogOpen(true);
  };

  const handleAddSubmit = (data: WofRecord) => {
    if (onAdd) {
      onAdd(data);
      setIsAddDialogOpen(false);
    }
  };

  if (data.length === 0) {
    return (
      <>
        <Empty className="py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon
                icon={hasAnyVehicles ? Search01Icon : Car01Icon}
                size={48}
              />
            </EmptyMedia>
            <EmptyTitle>
              {hasAnyVehicles ? "No Results Found" : "No Vehicles Added"}
            </EmptyTitle>
            <EmptyDescription>
              {hasAnyVehicles
                ? "Try clearing your search or adjusting your filters."
                : "You haven't added any vehicles yet. Get started by adding your first vehicle."}
            </EmptyDescription>
          </EmptyHeader>
          {!hasAnyVehicles && onAdd && (
            <EmptyContent>
              <WofFormDialog
                mode="add"
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSubmit={handleAddSubmit}
                trigger={
                  <Button
                    className="gap-2"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Icon icon={Add01Icon} size={20} />
                    Add Vehicle
                  </Button>
                }
              />
            </EmptyContent>
          )}
        </Empty>
      </>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort("clientName")}
            >
              <div className="flex items-center gap-2">
                Name
                {sortColumn === "clientName" && (
                  <Icon
                    icon={sortOrder === "asc" ? AArrowDown : AArrowUp}
                    size={16}
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort("plateNumber")}
            >
              <div className="flex items-center gap-2">
                License Plate
                {sortColumn === "plateNumber" && (
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
              onClick={() => onSort("expiryDate")}
            >
              <div className="flex items-center gap-1">
                <Icon icon={Calendar03Icon} size={16} />
                Expiry Date
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
          {data.map((wof) => (
            <TableRow key={wof.id}>
              <TableCell>{wof.clientName}</TableCell>
              <TableCell className="font-medium">{wof.plateNumber}</TableCell>
              <TableCell>{wof.make}</TableCell>
              <TableCell>{formatDate(wof.expiryDate)}</TableCell>
              <TableCell>
                <StatusBadge expiryTimestamp={wof.expiryDate} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <WofFormDialog
                    mode="edit"
                    open={isEditDialogOpen && editingRecord?.id === wof.id}
                    onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (!open) {
                        setEditingRecord(null);
                      }
                    }}
                    initialData={editingRecord}
                    onSubmit={handleEditSubmit}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditClick(wof)}
                      >
                        <Icon icon={Edit02Icon} size={16} />
                      </Button>
                    }
                  />

                  <DeleteConfirmDialog
                    open={isDeleteDialogOpen && deleteRecordId === wof.id}
                    onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open);
                      if (!open) {
                        setDeleteRecordId(null);
                        setDeleteClientName("");
                      }
                    }}
                    clientName={deleteClientName}
                    onConfirm={handleDeleteConfirm}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteClick(wof)}
                      >
                        <Icon icon={Delete02Icon} size={16} />
                      </Button>
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
