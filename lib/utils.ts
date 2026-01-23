import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// WOF-related definitions
export type WofRecord = {
  id: string;
  clientName: string;
  clientPhoneNumber: string;
  plateNumber: string;
  make: string;
  expiryDate: number; // Unix timestamp in milliseconds
  reminderInterval: number; // Days before expiry to send reminder
};

export type VehicleFromConvex = {
  _id: string;
  _creationTime: number;
  userId: string;
  clientName: string;
  clientPhoneNumber: string;
  make: string;
  plateNumber: string;
  expiryDate: number;
  reminderInterval: number;
};

export const vehicleFromConvexToWofRecord = (
  vehicle: VehicleFromConvex,
): WofRecord => ({
  id: vehicle._id,
  clientName: vehicle.clientName,
  clientPhoneNumber: vehicle.clientPhoneNumber,
  plateNumber: vehicle.plateNumber,
  make: vehicle.make,
  expiryDate: vehicle.expiryDate,
  reminderInterval: vehicle.reminderInterval,
});

export const reminderIntervalOptions = [
  { value: 7, label: "every 7 days" },
  { value: 14, label: "every 14 days" },
  { value: 21, label: "every 21 days" },
  { value: 30, label: "every 30 days" },
];

export const dateToTimestamp = (date: Date): number => date.getTime();

export const timestampToDate = (timestamp: number): Date => new Date(timestamp);

export const nzVehicleMakes = [
  "Toyota",
  "Honda",
  "Ford",
  "Mazda",
  "Nissan",
  "Subaru",
  "Mitsubishi",
  "Suzuki",
  "Kia",
  "Hyundai",
  "BMW",
  "Audi",
  "Mercedes-Benz",
  "Volkswagen",
  "Volvo",
  "Holden",
  "Peugeot",
  "Citroen",
  "Renault",
  "Skoda",
  "Fiat",
  "Mini",
  "Land Rover",
  "Jeep",
  "Tesla",
];

export const initialWofData: WofRecord[] = [
  {
    id: "1",
    clientName: "John Smith",
    clientPhoneNumber: "0211234567",
    plateNumber: "ABC123",
    make: "Toyota",
    expiryDate: new Date("2026-03-15").getTime(),
    reminderInterval: 7,
  },
  {
    id: "2",
    clientName: "Mary Johnson",
    clientPhoneNumber: "0221234567",
    plateNumber: "XYZ789",
    make: "Honda",
    expiryDate: new Date("2026-04-22").getTime(),
    reminderInterval: 7,
  },
  {
    id: "3",
    clientName: "David Williams",
    clientPhoneNumber: "0271234567",
    plateNumber: "LMN456",
    make: "Ford",
    expiryDate: new Date("2026-01-20").getTime(),
    reminderInterval: 7,
  },
  {
    id: "4",
    clientName: "Sarah Brown",
    clientPhoneNumber: "0212345678",
    plateNumber: "DEF321",
    make: "Mazda",
    expiryDate: new Date("2026-06-08").getTime(),
    reminderInterval: 14,
  },
  {
    id: "5",
    clientName: "Michael Davis",
    clientPhoneNumber: "0222345678",
    plateNumber: "GHI654",
    make: "Nissan",
    expiryDate: new Date("2026-01-05").getTime(),
    reminderInterval: 7,
  },
  {
    id: "6",
    clientName: "Emily Wilson",
    clientPhoneNumber: "0272345678",
    plateNumber: "JKL987",
    make: "Subaru",
    expiryDate: new Date("2026-08-30").getTime(),
    reminderInterval: 14,
  },
  {
    id: "7",
    clientName: "James Taylor",
    clientPhoneNumber: "0213456789",
    plateNumber: "PQR147",
    make: "Mitsubishi",
    expiryDate: new Date("2026-09-05").getTime(),
    reminderInterval: 7,
  },
  {
    id: "8",
    clientName: "Linda Anderson",
    clientPhoneNumber: "0223456789",
    plateNumber: "STU258",
    make: "Suzuki",
    expiryDate: new Date("2026-10-12").getTime(),
    reminderInterval: 14,
  },
  {
    id: "9",
    clientName: "Robert Martinez",
    clientPhoneNumber: "0273456789",
    plateNumber: "VWX369",
    make: "Kia",
    expiryDate: new Date("2026-11-20").getTime(),
    reminderInterval: 7,
  },
  {
    id: "10",
    clientName: "Jennifer Garcia",
    clientPhoneNumber: "0214567890",
    plateNumber: "YZA741",
    make: "Hyundai",
    expiryDate: new Date("2026-12-15").getTime(),
    reminderInterval: 30,
  },
];

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const parseDDMMYYYY = (dateString: string): Date | null => {
  if (!dateString.trim()) return null;
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  
  const [day, month, year] = parts.map(part => part.trim());
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) return null;
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > 2100) return null;
  
  const date = new Date(yearNum, monthNum - 1, dayNum);
  
  // Check if the date is valid (handles invalid dates like 31/02/2024)
  if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
    return null;
  }
  
  return date;
};

export const getDaysUntilExpiry = (expiryTimestamp: number): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryTimestamp);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

type DateValidationState = 'valid' | 'warning' | 'error' | 'past';

export const getDateValidation = (expiryTimestamp: number): DateValidationState => {
  const daysUntil = getDaysUntilExpiry(expiryTimestamp);
  if (daysUntil < 0) return 'past';
  if (daysUntil <= 30) return 'warning';
  return 'valid';
};

type StatusVariant = "success" | "warning" | "destructive";
type StatusIcon = "CheckmarkCircle01Icon" | "Clock03Icon" | "CancelCircleIcon";

export const getStatus = (
  expiryTimestamp: number,
): { status: string; variant: StatusVariant; icon: StatusIcon } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryTimestamp);
  expiry.setHours(0, 0, 0, 0);

  const daysDiff = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysDiff < 0) {
    return {
      status: "Expired",
      variant: "destructive",
      icon: "CancelCircleIcon",
    };
  } else if (daysDiff <= 30) {
    return { status: "Expiring Soon", variant: "warning", icon: "Clock03Icon" };
  } else {
    return {
      status: "Roadworthy",
      variant: "success",
      icon: "CheckmarkCircle01Icon",
    };
  }
};
