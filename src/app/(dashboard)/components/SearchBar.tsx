"use client";
import { FC, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Task, SearchProps } from "@/types/index";


const SearchBar: FC<SearchProps> = ({
  tasks = [],
  isLoading = false,
  onSelect = () => {},
  placeholder = "Search...",
}) => {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.priority.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (task: Task) => {
    onSelect(task);
    setSearch("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearch("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="relative w-[220px] lg:w-[418px]">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-9 lg:h-[38px] rounded-[22px] bg-white border pl-[36px] pr-3 text-sm text-gray-900 placeholder:text-gray-500"
      />

      {search.length > 0 && (
        <div className="absolute z-20 top-full mt-1 w-full bg-white border rounded-md shadow-lg">
          <Command shouldFilter={false}>
            <CommandList>
              {isLoading && <CommandEmpty>Loading tasks...</CommandEmpty>}
              {!isLoading && filtered.length === 0 && (
                <CommandEmpty>No tasks found</CommandEmpty>
              )}
              {!isLoading &&
                filtered.map((task) => (
                  <CommandItem
                    key={task.id}
                    onSelect={() => handleSelect(task)}
                    className="flex justify-between items-center px-3 py-2 hover:bg-gray-100"
                  >
                    <span>{task.title}</span>
                    <Badge
                      variant={
                        task.priority === "Urgent"
                          ? "destructive"
                          : task.priority === "Warning"
                          ? "default"
                          : "secondary"
                      }
                      className="size-2"
                    >
                      {task.priority}
                    </Badge>
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
