import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// WOF-related definitions
export type WofRecord = {
  id: string;
  name: string;
  licensePlate: string;
  vehicleMake: string;
  expiryDate: Date;
};

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
    name: "John Smith",
    licensePlate: "ABC123",
    vehicleMake: "Toyota",
    expiryDate: new Date("2026-03-15"),
  },
  {
    id: "2",
    name: "Mary Johnson",
    licensePlate: "XYZ789",
    vehicleMake: "Honda",
    expiryDate: new Date("2026-04-22"),
  },
  {
    id: "3",
    name: "David Williams",
    licensePlate: "LMN456",
    vehicleMake: "Ford",
    expiryDate: new Date("2026-05-10"),
  },
  {
    id: "4",
    name: "Sarah Brown",
    licensePlate: "DEF321",
    vehicleMake: "Mazda",
    expiryDate: new Date("2026-06-08"),
  },
  {
    id: "5",
    name: "Michael Davis",
    licensePlate: "GHI654",
    vehicleMake: "Nissan",
    expiryDate: new Date("2026-07-19"),
  },
  {
    id: "6",
    name: "Emily Wilson",
    licensePlate: "JKL987",
    vehicleMake: "Subaru",
    expiryDate: new Date("2026-08-30"),
  },
  {
    id: "7",
    name: "James Taylor",
    licensePlate: "PQR147",
    vehicleMake: "Mitsubishi",
    expiryDate: new Date("2026-09-05"),
  },
  {
    id: "8",
    name: "Linda Anderson",
    licensePlate: "STU258",
    vehicleMake: "Suzuki",
    expiryDate: new Date("2026-10-12"),
  },
  {
    id: "9",
    name: "Robert Martinez",
    licensePlate: "VWX369",
    vehicleMake: "Kia",
    expiryDate: new Date("2026-11-20"),
  },
  {
    id: "10",
    name: "Jennifer Garcia",
    licensePlate: "YZA741",
    vehicleMake: "Hyundai",
    expiryDate: new Date("2026-12-15"),
  },
];

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

type StatusVariant = "success" | "warning" | "destructive";
type StatusIcon = "CheckmarkCircle01Icon" | "Clock03Icon" | "CancelCircleIcon";

export const getStatus = (expiryDate: Date): { status: string; variant: StatusVariant; icon: StatusIcon } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const daysDiff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) {
    return { status: "Expired", variant: "destructive", icon: "CancelCircleIcon" };
  } else if (daysDiff <= 30) {
    return { status: "Expiring Soon", variant: "warning", icon: "Clock03Icon" };
  } else {
    return { status: "Roadworthy", variant: "success", icon: "CheckmarkCircle01Icon" };
  }
};
