"use client";

import * as React from "react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { X } from "lucide-react";

export interface MultiSelectProps {
  options: { label: string; value: string }[];
  value: { label: string; value: string }[];
  onChange: (value: { label: string; value: string }[]) => void;
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
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace" && !searchQuery && value.length > 0) {
      const newValue = [...value];
      newValue.pop();
      onChange(newValue);
    }
  };

  // Filter options based on search query
  const filteredOptions = options.filter(
    option =>
      !value.some(val => val.value === option.value) &&
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle option selection
  const toggleOption = (option: { label: string; value: string }) => {
    const isSelected = value.some(val => val.value === option.value);
    
    if (isSelected) {
      onChange(value.filter(val => val.value !== option.value));
    } else {
      onChange([...value, option]);
    }
    
    setSearchQuery("");
  };

  // Remove selected option
  const removeOption = (e: React.MouseEvent, option: { label: string; value: string }) => {
    e.stopPropagation();
    onChange(value.filter(val => val.value !== option.value));
  };

  return (
    <div className="relative" {...props}>
      <div
        className={cn(
          "flex flex-wrap min-h-10 items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          open && "ring-2 ring-ring ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={() => !disabled && setOpen(true)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
      >
        {value.length === 0 && !searchQuery && (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        
        {value.map(option => (
          <Badge
            key={option.value}
            variant="secondary"
            className="flex items-center gap-1 px-2"
          >
            {option.label}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={e => !disabled && removeOption(e, option)}
            />
          </Badge>
        ))}
        
        {open && (
          <input
            className="flex-1 outline-none min-w-[80px] bg-transparent"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
            disabled={disabled}
          />
        )}
      </div>
      
      {open && !disabled && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md">
            <ul className="overflow-auto p-1 max-h-[200px]">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <li
                    key={option.value}
                    className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 hover:bg-accent"
                    onClick={() => {
                      toggleOption(option);
                      setOpen(true); // Keep the dropdown open after selection
                    }}
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="px-2 py-1.5 text-muted-foreground">
                  {searchQuery ? "No options found" : "No options available"}
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
