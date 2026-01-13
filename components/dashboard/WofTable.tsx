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
import { WofRecord, formatDate } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { WofFormDialog } from "./WofFormDialog";
import { AArrowDown, AArrowUp, Calendar03Icon, Delete02Icon, Edit02Icon } from "@/lib/icons";

interface WofTableProps {
  data: WofRecord[];
  sortColumn: "name" | "licensePlate" | "expiryDate";
  sortOrder: "asc" | "desc";
  onSort: (column: "name" | "licensePlate" | "expiryDate") => void;
  onEdit: (record: WofRecord) => void;
  onDelete: (id: string) => void;
}

export function WofTable({
  data,
  sortColumn,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}: WofTableProps) {
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [deleteClientName, setDeleteClientName] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WofRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
    setDeleteClientName(record.name);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSort("name")}
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
              onClick={() => onSort("licensePlate")}
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
              <TableCell>{wof.name}</TableCell>
              <TableCell className="font-medium">{wof.licensePlate}</TableCell>
              <TableCell>{wof.vehicleMake}</TableCell>
              <TableCell>{formatDate(wof.expiryDate)}</TableCell>
              <TableCell>
                <StatusBadge expiryDate={wof.expiryDate} />
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
