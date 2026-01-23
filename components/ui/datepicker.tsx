"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { Calendar03Icon } from "@/lib/icons";
import {
  formatDate,
  parseDDMMYYYY,
  dateToTimestamp,
  timestampToDate,
  getDateValidation,
  getDaysUntilExpiry,
} from "@/lib/utils";

interface DatePickerInputProps {
  value: number | null;
  onChange: (timestamp: number) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export function DatePickerInput({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  disabled = false,
  error,
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [inputError, setInputError] = React.useState("");

  const selectedDate = value ? timestampToDate(value) : undefined;

  // Sync input with value changes
  React.useEffect(() => {
    if (value) {
      setInputValue(formatDate(value));
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setInputError("");

    // Parse DD/MM/YYYY format
    if (newValue.length === 10) {
      // DD/MM/YYYY format length
      const parsedDate = parseDDMMYYYY(newValue);
      if (parsedDate) {
        const timestamp = dateToTimestamp(parsedDate);
        onChange(timestamp);
      } else {
        setInputError("Invalid date format. Use DD/MM/YYYY");
      }
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const timestamp = date.getTime();
      onChange(timestamp);
      setInputValue(formatDate(timestamp));
      setOpen(false);
    }
  };

  const handleQuickPreset = (daysToAdd: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    const timestamp = date.getTime();
    onChange(timestamp);
    setInputValue(formatDate(timestamp));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" && inputValue.length === 10) {
      // Try to parse the current input on Enter
      const parsedDate = parseDDMMYYYY(inputValue);
      if (parsedDate) {
        const timestamp = parsedDate.getTime();
        onChange(timestamp);
        setInputValue(formatDate(timestamp));
      }
    }
  };

  // Determine visual validation state
  const validationState = value ? getDateValidation(value) : null;
  const borderClass =
    validationState === "past"
      ? "border-yellow-500 focus:ring-yellow-500"
      : validationState === "warning"
        ? "border-yellow-500 focus:ring-yellow-500"
        : validationState === "valid"
          ? "border-green-500 focus:ring-green-500"
          : inputError
            ? "border-destructive focus:ring-destructive"
            : "";

  return (
    <div className="w-full">
      <div className="flex w-full">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="Date input in DD/MM/YYYY format"
          className={cn(
            "rounded-r-none border-r-0",
            borderClass,
            disabled && "cursor-not-allowed",
          )}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-l-none border-l-0",
                borderClass,
                disabled && "cursor-not-allowed"
              )}
              disabled={disabled}
              type="button"
              aria-label="Open date picker"
            >
              <Icon icon={Calendar03Icon} size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="flex flex-col sm:flex-row">
              <div className="p-2 border-r sm:w-1/2">
                <p className="text-sm font-medium mb-2">Quick Add</p>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 text-xs"
                    onClick={() => handleQuickPreset(180)}
                  >
                    6 months from today
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 text-xs"
                    onClick={() => handleQuickPreset(365)}
                  >
                    1 year from today
                  </Button>
                </div>
              </div>
              <div className="sm:w-1/2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="w-full"
                  initialFocus
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Error messages */}
      {(inputError || error) && (
        <p className="text-sm text-destructive mt-1">{inputError || error}</p>
      )}

      {/* Validation status */}
      {value && validationState && !inputError && (
        <div className="mt-1">
          {validationState === "past" && (
            <p className="text-sm text-yellow-600">This date has passed</p>
          )}
          {validationState === "warning" && (
            <p className="text-sm text-yellow-600">
              Expires in {getDaysUntilExpiry(value)} days
            </p>
          )}
          {validationState === "valid" && (
            <p className="text-sm text-green-600">Valid expiry date</p>
          )}
        </div>
      )}
    </div>
  );
}
