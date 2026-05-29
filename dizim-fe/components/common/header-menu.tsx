"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

interface HeaderMenuProps {
  children: React.ReactNode;
}

export default function HeaderMenu({ children }: HeaderMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        className="p-2"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? (
          <X className="text-foreground h-6 w-6" />
        ) : (
          <Menu className="text-foreground h-6 w-6" />
        )}
      </button>
      {open && (
        <div className="fixed left-0 top-16 z-50 w-full border-t bg-white shadow-lg">
          <div
            className="flex flex-col gap-4 px-4 py-4"
            onClick={() => setOpen(false)}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
