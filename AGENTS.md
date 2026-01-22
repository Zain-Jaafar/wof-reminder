# AGENTS.md - Agent Coding Guidelines for wof-reminder

## Commands

### Development
- `npm run dev` - Start development server (http://localhost:3000)
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

## Import Style

Order imports in this sequence:
1. External library imports (React, Convex hooks)
2. Component imports (shadcn/ui, custom components)
3. Utility/type imports
4. Icon imports from @/lib/icons

Use `@/` alias for all internal imports:
```tsx
import { Button } from "@/components/ui/button";
import { WofRecord } from "@/lib/utils";
import { Car01Icon } from "@/lib/icons";
```

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

```tsx
interface DashboardHeaderProps {
  onAdd: (data: WofRecord) => void;
  isLoading?: boolean;
  hasVehicles?: boolean;
}
```

## Naming Conventions

- **Components**: PascalCase (e.g., `DashboardHeader`, `WofTable`)
- **Functions/Variables**: camelCase (e.g., `handleAdd`, `searchQuery`)
- **Types/Interfaces**: PascalCase (e.g., `WofRecord`, `VehicleFromConvex`)
- **Constants**: PascalCase for exported (e.g., `STATUS_ICONS`), camelCase for local
- **CSS classes**: kebab-case for custom, use Tailwind utilities

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
- Use semantic color tokens: `primary`, `secondary`, `muted`, `destructive`, `accent`

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class")} />
```

## Icons

Use HugeIcons from `@/lib/icons` with Icon wrapper component:
```tsx
import { Icon } from "@/components/ui/icon";
import { Add01Icon, Car01Icon } from "@/lib/icons";

<Icon icon={Car01Icon} size={24} className="text-primary" />
```

## Error Handling

**Convex functions (mutations/queries)**: Throw errors with descriptive messages
```tsx
if (!userId) {
  throw new Error("Unauthorised");
}
```

**Client components**: Use try-catch blocks and error states
```tsx
const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

try {
  await createVehicle(data);
  setStatus("success");
} catch (error) {
  setStatus("error");
  setErrorMessage(error instanceof Error ? error.message : "Failed to create vehicle");
}
```

## State Management Patterns

- **Local state**: `useState` for component state
- **Forms**: `react-hook-form` with `register`, `handleSubmit`, `errors`
- **Server data**: `useQuery` and `useMutation` from `convex/react`
- **Auth**: `useConvexAuth`, `Authenticated`, `Unauthenticated`, `AuthLoading`
- **Global state**: Convex for persistent data, React context for UI state

```tsx
const vehicles = useQuery(api.vehicles.getVehicles);
const createVehicle = useMutation(api.vehicles.createVehicle);
```

## Form Handling

Use React Hook Form for all forms:
```tsx
const { register, handleSubmit, formState: { errors } } = useForm<WofRecord>({
  defaultValues: { /* initial values */ }
});

<input {...register("field", { required: "Field is required" })} />
{errors.field && <p className="text-destructive">{errors.field.message}</p>}
```

## Folder Structure

- `app/` - Next.js App Router pages and layouts
- `components/ui/` - Reusable UI components (shadcn/ui)
- `components/dashboard/` - Dashboard-specific components
- `components/waitlist/` - Waitlist page components
- `components/login/` - Authentication components
- `convex/` - Backend logic (schema, mutations, queries, auth config)
- `lib/` - Utilities, types, and icon exports
- `public/` - Static assets

## Convex Backend Patterns

- Define schemas in `convex/schema.ts`
- Create mutations with validation using `v` from `convex/values`
- Use `getAuthUserId` for authorization checks
- Query with filters and indexes as needed

```tsx
export const createVehicle = mutation({
  args: {
    clientName: v.string(),
    // ... other fields
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorised");
    await ctx.db.insert("vehicles", { userId, ...args });
  },
});
```

## Best Practices

- Keep components focused and single-purpose
- Extract reusable logic to `lib/utils.ts`
- Use proper TypeScript types - avoid `any`
- Always handle loading and error states in UI
- Use dialog components for forms (add/edit)
- Implement confirmation dialogs for destructive actions
- Use status badges with semantic variants
- Validate Convex args with schema validation
- Use proper index names in Convex schema
- Maintain consistent spacing and padding in layouts
