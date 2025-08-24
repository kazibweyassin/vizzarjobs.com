"use client";

import * as React from "react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { X } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: MultiSelectOption[];
  onChange: (value: MultiSelectOption[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);

  const handleRemove = (option: MultiSelectOption) => {
    onChange(value.filter((item) => item.value !== option.value));
  };

  const handleSelect = (option: MultiSelectOption) => {
    if (value.find((item) => item.value === option.value)) {
      onChange(value.filter((item) => item.value !== option.value));
    } else {
      onChange([...value, option]);
    }
    setSearch("");
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  // Filter options based on search
  const filteredOptions = options.filter((option) => 
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={cn("relative", className)} ref={ref}>
      <div
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-text",
          className
        )}
      >
        {value.length > 0 ? (
          <>
            {value.map((item) => (
              <Badge
                key={item.value}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {item.label}
                {!disabled && (
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item);
                    }}
                  />
                )}
              </Badge>
            ))}
            {!disabled && (
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none min-w-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
                placeholder={value.length > 0 ? "" : placeholder}
              />
            )}
          </>
        ) : (
          <>
            {!disabled && (
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
                placeholder={placeholder}
              />
            )}
            {disabled && <span className="text-muted-foreground">{placeholder}</span>}
          </>
        )}
      </div>

      {open && !disabled && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-1 text-sm text-gray-500">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm",
                    value.some((item) => item.value === option.value)
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted"
                  )}
                >
                  {option.label}
                  {value.some((item) => item.value === option.value) && (
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
