"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { WofFormDialog } from "./WofFormDialog";
import { WofRecord } from "@/lib/utils";
import { Add01Icon, Car01Icon } from "@/lib/icons";

interface DashboardHeaderProps {
  onAdd: (data: WofRecord) => void;
}

export function DashboardHeader({ onAdd }: DashboardHeaderProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center gap-2">
        <Icon icon={Car01Icon} size={24} className="text-foreground" />
        <CardTitle>WoF Management Dashboard</CardTitle>
      </div>
      <WofFormDialog
        mode="add"
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={(data) => {
          onAdd(data);
          setIsAddDialogOpen(false);
        }}
        trigger={
          <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Icon icon={Add01Icon} size={20} />
            Add Vehicle
          </Button>
        }
      />
    </div>
  );
}
