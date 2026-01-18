"use client";

import { useEffect, useState } from "react";
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
import {
  WofRecord,
  nzVehicleMakes,
  reminderIntervalOptions,
  timestampToDate,
} from "@/lib/utils";

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
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (mode === "edit" && initialData?.expiryDate) {
      return timestampToDate(initialData.expiryDate);
    }
    return new Date();
  });

  const defaultExpiryTimestamp = useState<number>(() => Date.now())[0];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WofRecord>({
    defaultValues: {
      clientName: "",
      clientPhoneNumber: "",
      plateNumber: "",
      make: "",
      expiryDate: defaultExpiryTimestamp,
      reminderInterval: 7,
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        reset({
          clientName: initialData.clientName,
          clientPhoneNumber: initialData.clientPhoneNumber,
          plateNumber: initialData.plateNumber,
          make: initialData.make,
          expiryDate: initialData.expiryDate,
          reminderInterval: initialData.reminderInterval,
        });
      } else {
        reset({
          clientName: "",
          clientPhoneNumber: "",
          plateNumber: "",
          make: "",
          expiryDate: Date.now(),
          reminderInterval: 7,
        });
      }
    }
  }, [open, mode, initialData, reset]);

  const handleFormSubmit = (data: WofRecord) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog key={`${mode}-${open}`} open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Vehicle" : "Edit Vehicle"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Enter details for a new client's vehicle."
              : "Update vehicle information."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${mode}-clientName`}>Client Name *</Label>
            <Input
              id={`${mode}-clientName`}
              placeholder="Enter client name"
              {...register("clientName", {
                required: "Client name is required",
              })}
            />
            {errors.clientName && (
              <p className="text-sm text-destructive">
                {errors.clientName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-clientPhoneNumber`}>Phone Number *</Label>
            <Input
              id={`${mode}-clientPhoneNumber`}
              placeholder="e.g., 0211234567"
              {...register("clientPhoneNumber", {
                required: "Phone number is required",
              })}
            />
            {errors.clientPhoneNumber && (
              <p className="text-sm text-destructive">
                {errors.clientPhoneNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-plateNumber`}>License Plate *</Label>
            <Input
              id={`${mode}-plateNumber`}
              placeholder="e.g., ABC123"
              {...register("plateNumber", {
                required: "License plate is required",
                minLength: {
                  value: 3,
                  message: "License plate must be at least 3 characters",
                },
              })}
            />
            {errors.plateNumber && (
              <p className="text-sm text-destructive">
                {errors.plateNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-make`}>Vehicle Make *</Label>
            <select
              id={`${mode}-make`}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              {...register("make", {
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
            {errors.make && (
              <p className="text-sm text-destructive">{errors.make.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-expiryDate`}>WOF Expiry Date *</Label>
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
                if (date) {
                  setSelectedDate(date);
                  setValue("expiryDate", date.getTime());
                }
              }}
              className="rounded-md border w-[50%]"
            />
            {errors.expiryDate && (
              <p className="text-sm text-destructive">
                {errors.expiryDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${mode}-reminderInterval`}>
              Remind clients (starts 1 month before expiry date) *
            </Label>
            <select
              id={`${mode}-reminderInterval`}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              {...register("reminderInterval", {
                required: "Reminder interval is required",
              })}
            >
              {reminderIntervalOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} before expiry
                </option>
              ))}
            </select>
            {errors.reminderInterval && (
              <p className="text-sm text-destructive">
                {errors.reminderInterval.message}
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
              {mode === "add" ? "Add Vehicle" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
