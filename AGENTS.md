# AGENTS.md - Agent Coding Guidelines for wof-reminder

## Commands

### Development
- `npm run dev` - Start development server (http://localhost:3000) (never run `npm run dev` as an AI Agent, instead tell the user when they need to run it)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

### Testing
This project does not have a test framework configured. No single test command available.

## Project Stack
- Next.js 16 with App Router and TypeScript (strict mode)
- Tailwind CSS v4 with shadcn/ui components (Radix UI)
- Convex for backend/database/authentication
- React Hook Form for form management
- HugeIcons for iconography
- Date-fns for date utilities

## Import Style

Order imports in this sequence:
1. External library imports (React, Next.js navigation, Convex hooks)
2. Component imports (shadcn/ui, custom components)
3. Utility/type imports
4. Icon imports from @/lib/icons

Use `@/` alias for all internal imports:
```tsx
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WofRecord, formatDate } from "@/lib/utils";
import { Car01Icon } from "@/lib/icons";
```

## Navigation Patterns

### Link Component Usage
Use `next/link` for client-side navigation in menus and sidebars:
```tsx
import Link from "next/link";

<SidebarMenuButton asChild>
  <Link href={item.url}>
    <Icon icon={item.icon} strokeWidth={1.5} />
    <span>{item.title}</span>
  </Link>
</SidebarMenuButton>
```

### Programmatic Navigation
Use `useRouter` for programmatic navigation:
```tsx
import { useRouter } from "next/navigation";

const router = useRouter();
router.push("/login"); // Always use push(), not replace()
```

### External Links
Use standard `<a>` tags with security attributes:
```tsx
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>
```

### Authentication-Based Navigation
- Use `useEffect` for auth-based redirects
- Handle loading states during navigation
- Include redirect URLs in auth functions

## Code Formatting

- 2-space indentation
- Use ESLint (Next.js config) for linting
- Run `npm run lint` after changes to ensure code quality
- No explicit formatter (Prettier) configured

## Type Safety

- TypeScript strict mode enabled
- Use `import type` for type-only imports when possible
- Define component props as interfaces
- Use Convex Id types: `Id<"tableName">`
- Type form data with shared types (e.g., `WofRecord`)
- Use date-fns for date operations instead of native Date methods

```tsx
interface DashboardHeaderProps {
  onAdd: (data: WofRecord) => void;
  isLoading?: boolean;
  hasVehicles?: boolean;
}

// Use proper Convex types
import { Id } from "@/convex/_generated/dataModel";
type VehicleId = Id<"vehicles">;
```

## Naming Conventions

- **Components**: PascalCase (e.g., `DashboardHeader`, `WofTable`)
- **Functions/Variables**: camelCase (e.g., `handleAdd`, `searchQuery`, `isAuthLoading`)
- **Types/Interfaces**: PascalCase (e.g., `WofRecord`, `VehicleFromConvex`)
- **Constants**: PascalCase for exported (e.g., `STATUS_ICONS`), camelCase for local
- **CSS classes**: kebab-case for custom, use Tailwind utilities
- **Status Types**: Use union types for status states

## Client Components

All components using hooks or interactivity must start with `"use client"`:
```tsx
"use client";

import { useState } from "react";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  return <div>...</div>;
}
```

## Styling Guidelines

- Use Tailwind CSS classes for styling
- Combine conflicting classes with `cn()` utility from `@/lib/utils`
- Prefer Tailwind over custom CSS
- Use semantic color tokens: `primary`, `secondary`, `muted`, `destructive`, `accent`, `border`
- Use `bg-border` for skeleton components (darker than `bg-accent`)

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class")} />

// Skeleton styling
<Skeleton className="h-4 w-24 bg-border" />
```

## Icons

Use HugeIcons from `@/lib/icons` with Icon wrapper component:
```tsx
import { Icon } from "@/components/ui/icon";
import { Add01Icon, Car01Icon, Loading03Icon } from "@/lib/icons";

// Standard usage
<Icon icon={Car01Icon} size={24} className="text-primary" />

// Loading spinner
<Icon icon={Loading03Icon} size={48} className="animate-spin text-primary" />
```

## Loading State Patterns

### Authentication Loading
Use Convex auth components for conditional rendering:
```tsx
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

<AuthLoading>
  <NavUserSkeleton />
</AuthLoading>
<Authenticated>
  <NavUser user={userObject} />
</Authenticated>
<Unauthenticated>
  {null}
</Unauthenticated>
```

### Query Loading
Check for `undefined` to detect loading state:
```tsx
const vehicles = useQuery(api.vehicles.getVehicles);
const isDataLoading = vehicles === undefined;
```

### Form Loading
Use status union types for form states:
```tsx
const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

// Loading button
<Button disabled={status === "loading"}>
  {status === "loading" ? "Saving..." : "Save"}
</Button>
```

### Loading Skeletons
Create skeleton components for consistent loading states:
```tsx
export function NavUserSkeleton() {
  return (
    <SidebarMenuButton size="lg" className="pointer-events-none">
      <Skeleton className="h-8 w-8 rounded-lg bg-border" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-24 bg-border" />
        <Skeleton className="h-3 w-32 bg-border" />
      </div>
    </SidebarMenuButton>
  );
}
```

## Component Architecture

### Directory Structure
```
components/
├── ui/                    # Reusable UI primitives (shadcn/ui)
├── dashboard/            # Dashboard-specific components
├── login/               # Authentication components
├── waitlist/            # Waitlist page components
├── sidebar/             # Navigation sidebar components
└── settings/            # Settings-related components
```

### Component Hierarchy
- **UI Layer**: Low-level, reusable primitives (Button, Input, Dialog)
- **Feature Layer**: Domain-specific components that compose UI primitives
- **Page Layer**: Routes that orchestrate feature components

### Props Interface Patterns
```tsx
// Always define interfaces before component
interface ComponentProps {
  requiredProp: string;
  optionalProp?: number;
  callback?: (data: SomeType) => void;
  children?: React.ReactNode;
}

// Callback naming: onAction
interface DashboardHeaderProps {
  onAdd: (data: WofRecord) => void;
  onEdit?: (record: WofRecord) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}
```

### Component Composition
- Compose smaller components rather than creating monolithic ones
- Use compound component patterns (Dialog, Form, Table)
- Prefer composition over inheritance

## Error Handling

### Convex Functions
Use generic error messages for security:
```tsx
export const createVehicle = mutation({
  args: { /* validated args */ },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorised");
    }
    
    const existing = await ctx.db.query("vehicles")
      .filter(q => q.eq(q.field("plateNumber"), args.plateNumber))
      .first();
    if (existing) {
      throw new Error("Vehicle with this plate number already exists");
    }
  },
});
```

### Client Components
Use try-catch with proper error states:
```tsx
const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
const [errorMessage, setErrorMessage] = useState("");

try {
  await createVehicle(data);
  setStatus("success");
} catch (error) {
  setStatus("error");
  setErrorMessage(error instanceof Error ? error.message : "Failed to create vehicle");
}

// Display error
{status === "error" && (
  <p className="text-sm text-destructive">{errorMessage}</p>
)}
```

## Security Patterns

### Authentication & Authorization
- Always verify user authentication in Convex functions
- Use ownership checks for data mutations
- Implement user-scoped data queries

```tsx
// Standard authorization pattern
const userId = await getAuthUserId(ctx);
if (!userId) {
  throw new Error("Unauthorised");
}

// Ownership verification
const vehicle = await ctx.db.get(args.id);
if (!vehicle || vehicle.userId !== userId) {
  throw new Error("Vehicle not found or unauthorized");
}

// User-scoped queries
export const getVehicles = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("vehicles")
      .filter(q => q.eq(q.field("userId"), userId))
      .collect();
  },
});
```

### Input Validation
- Validate both client-side (React Hook Form) and server-side (Convex schema)
- Use specific validation rules
- Never trust client-side input

```tsx
// Server-side validation
export const createVehicle = mutation({
  args: {
    clientName: v.string(),
    clientPhoneNumber: v.string(),
    make: v.string(),
    plateNumber: v.string(),
    expiryDate: v.number(),
    reminderInterval: v.number(),
  },
  handler: async (ctx, args) => { /* implementation */ }
});

// Client-side validation
const { register, formState: { errors } } = useForm<WofRecord>();
register("plateNumber", {
  required: "License plate is required",
  minLength: { value: 3, message: "Must be at least 3 characters" }
});
```

## State Management Patterns

### Local State
```tsx
// Boolean states
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);

// Union type states
const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

// Authentication state
const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
```

### Server Data
```tsx
const vehicles = useQuery(api.vehicles.getVehicles);
const createVehicle = useMutation(api.vehicles.createVehicle);
const updateVehicle = useMutation(api.vehicles.updateVehicle);
```

### Form Management
Use React Hook Form for all forms:
```tsx
const { 
  register, 
  handleSubmit, 
  reset, 
  setValue,
  formState: { errors } 
} = useForm<WofRecord>({
  defaultValues: { /* initial values */ }
});

// Validation and error display
<input 
  {...register("field", { required: "Field is required" })} 
  disabled={isLoading}
/>
{errors.field && (
  <p className="text-sm text-destructive">{errors.field.message}</p>
)}
```

## Form Handling

### Standard Form Pattern
```tsx
const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<WofRecord>({
  defaultValues: initialData || {
    clientName: "",
    clientPhoneNumber: "",
    plateNumber: "",
    make: "",
    expiryDate: Date.now(),
    reminderInterval: 7,
  },
});

const onSubmit = async (data: WofRecord) => {
  setStatus("loading");
  try {
    await onSubmit(data);
    reset();
    setIsDialogOpen(false);
    setStatus("success");
  } catch (error) {
    setStatus("error");
    setErrorMessage(error instanceof Error ? error.message : "Failed to save");
  }
};
```

### Form Validation Patterns
- Use semantic validation rules
- Provide clear error messages
- Handle disabled states during submission

## Data Transformation Patterns

### Convex ↔ UI Data Conversion
Use transformation functions for data layering:
```tsx
// In lib/utils.ts
export const vehicleFromConvexToWofRecord = (
  vehicle: VehicleFromConvex,
): WofRecord => ({
  id: vehicle._id,
  clientName: vehicle.clientName,
  // ... map other fields
});

// In components
const wofData: WofRecord[] = (vehicles || []).map(vehicleFromConvexToWofRecord);
```

### Date Handling
Use utility functions for date operations:
```tsx
// Use timestamps for storage
expiryDate: v.number(), // Unix timestamp in milliseconds

// Use utilities for conversion
export const dateToTimestamp = (date: Date): number => date.getTime();
export const timestampToDate = (timestamp: number): Date => new Date(timestamp);

// Display formatting
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
};
```

## Status Management

### Status Type Patterns
```tsx
type LoadingStatus = "idle" | "loading" | "success" | "error";
type StatusVariant = "success" | "warning" | "destructive";
type StatusIcon = "CheckmarkCircle01Icon" | "Clock03Icon" | "CancelCircleIcon";
```

### Status Logic Patterns
```tsx
export const getStatus = (
  expiryTimestamp: number,
): { status: string; variant: StatusVariant; icon: StatusIcon } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryTimestamp);
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
```

## Folder Structure

- `app/` - Next.js App Router pages and layouts
  - `(dashboard)/` - Protected route group with shared layout
- `components/ui/` - Reusable UI components (shadcn/ui)
- `components/dashboard/` - Dashboard-specific components
- `components/waitlist/` - Waitlist page components
- `components/login/` - Authentication components
- `components/sidebar/` - Navigation sidebar components
- `components/settings/` - Settings-related components
- `convex/` - Backend logic (schema, mutations, queries, auth config)
- `lib/` - Utilities, types, icon exports, and shared constants
- `public/` - Static assets

## Convex Backend Patterns

### Schema Definition
```tsx
export default defineSchema({
  ...authTables,
  vehicles: defineTable({
    userId: v.id("users"),
    clientName: v.string(),
    // ... other fields
  }).index("by_plateNumber", ["plateNumber"]),
});
```

### Mutation Pattern
```tsx
export const createVehicle = mutation({
  args: {
    clientName: v.string(),
    // ... validated fields
  },
  handler: async (ctx, args) => {
    // 1. Authenticate
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorised");
    
    // 2. Business logic
    await ctx.db.insert("vehicles", { userId, ...args });
  },
});
```

### Query Pattern
```tsx
export const getVehicles = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return []; // Return empty, don't throw
    
    return await ctx.db
      .query("vehicles")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});
```

## Environment Variables

### Client Variables
Use `NEXT_PUBLIC_` prefix for client-side variables:
```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Server Variables
Omit prefix for server-only variables:
```bash
CONVEX_DEPLOYMENT=dev:your-deployment
CONVEX_SITE_URL=https://your-domain.com
```

### Usage Patterns
```tsx
// Client-side
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Server-side (convex files)
export default {
  providers: [{
    domain: process.env.CONVEX_SITE_URL,
    applicationID: "convex",
  }],
};
```

## Best Practices

### Component Design
- Keep components focused and single-purpose
- Extract reusable logic to `lib/utils.ts`
- Use proper TypeScript types - avoid `any`
- Maintain consistent component interfaces

### State Management
- Always handle loading and error states in UI
- Use loading skeletons for better UX during data fetching
- Implement confirmation dialogs for destructive actions
- Use proper form validation both client and server side

### Performance
- Use Next.js Link for navigation to avoid full page reloads
- Leverage Convex's real-time capabilities efficiently
- Implement proper loading states to prevent UI jank

### Security
- Never expose sensitive data to client-side code
- Use generic error messages for security failures
- Implement proper ownership checks for all data operations
- Validate inputs both client and server side

### Code Organization
- Follow established naming conventions consistently
- Use semantic color tokens for styling consistency
- Maintain proper import order and organization
- Document component interfaces and complex logic
