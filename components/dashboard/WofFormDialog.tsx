"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WofRecord, nzVehicleMakes } from "@/lib/utils";

interface WofFormDialogProps {
  mode: "add" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: WofRecord | null;
  onSubmit: (data: WofRecord) => void;
  trigger?: React.ReactNode;
}

export function WofFormDialog({
  mode,
  open,
  onOpenChange,
  initialData,
  onSubmit,
  trigger,
}: WofFormDialogProps) {
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

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        reset({
          name: initialData.name,
          licensePlate: initialData.licensePlate,
          vehicleMake: initialData.vehicleMake,
          expiryDate: initialData.expiryDate,
        });
      } else {
        reset({
          name: "",
          licensePlate: "",
          vehicleMake: "",
          expiryDate: new Date(),
        });
      }
    }
  }, [open, mode, initialData, reset]);

  const handleFormSubmit = (data: WofRecord) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New WOF Record" : "Edit WOF Record"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Enter details for a new client's WOF record."
              : "Update client's WOF record information."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${mode}-name`}>Client Name *</Label>
            <Input
              id={`${mode}-name`}
              placeholder="Enter client name"
              {...register("name", {
                required: "Client name is required",
              })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-licensePlate`}>License Plate *</Label>
            <Input
              id={`${mode}-licensePlate`}
              placeholder="e.g., ABC123"
              {...register("licensePlate", {
                required: "License plate is required",
                minLength: {
                  value: 3,
                  message: "License plate must be at least 3 characters",
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
            <Label htmlFor={`${mode}-vehicleMake`}>Vehicle Make *</Label>
            <select
              id={`${mode}-vehicleMake`}
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
            <Label htmlFor={`${mode}-expiryDate`}>Expiry Date *</Label>
            <input
              type="hidden"
              {...register("expiryDate", {
                required: "Expiry date is required",
              })}
            />
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={(date) => {
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
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "add" ? "Add WOF" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
