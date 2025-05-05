import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

type Option = {
    value: string;
    label: string;
};

interface VirtualizedCommandProps {
    height: string;
    options: Option[];
    placeholder: string;
    selectedOption: string;
    className?: string;
    messageEmpty?: string;
    onSelectOption?: (option: string) => void;
}

export function VirtualizedCommand({
    height,
    options,
    placeholder,
    selectedOption,
    className,
    messageEmpty = "No results found.",
    onSelectOption,
}: VirtualizedCommandProps) {
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [isKeyboardNavActive, setIsKeyboardNavActive] = useState(false);

    const parentRef = useRef(null);

    const virtualizer = useVirtualizer({
        count: filteredOptions.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35,
    });

    const virtualOptions = virtualizer.getVirtualItems();

    function scrollToIndex(index: number) {
        virtualizer.scrollToIndex(index, {
            align: "center",
        });
    }

    const handleSearch = (search: string) => {
        setIsKeyboardNavActive(false);
        setFilteredOptions(
            options.filter(option =>
                option.value.toLowerCase().includes(search.toLowerCase() ?? []),
            ),
        );
    };

    function handleKeyDown(event: React.KeyboardEvent) {
        switch (event.key) {
            case "ArrowDown": {
                event.preventDefault();
                setIsKeyboardNavActive(true);
                setFocusedIndex(prev => {
                    const newIndex =
                        prev === -1
                            ? 0
                            : Math.min(prev + 1, filteredOptions.length - 1);
                    scrollToIndex(newIndex);
                    return newIndex;
                });
                break;
            }
            case "ArrowUp": {
                event.preventDefault();
                setIsKeyboardNavActive(true);
                setFocusedIndex(prev => {
                    const newIndex =
                        prev === -1
                            ? filteredOptions.length - 1
                            : Math.max(prev - 1, 0);
                    scrollToIndex(newIndex);
                    return newIndex;
                });
                break;
            }
            case "Enter": {
                event.preventDefault();
                if (filteredOptions[focusedIndex]) {
                    onSelectOption?.(filteredOptions[focusedIndex].value);
                }
                break;
            }
            default:
                break;
        }
    }

    useEffect(() => {
        if (selectedOption) {
            const option = filteredOptions.find(
                option => option.value === selectedOption,
            );
            if (option) {
                const index = filteredOptions.indexOf(option);
                setFocusedIndex(index);
                virtualizer.scrollToIndex(index, {
                    align: "center",
                });
            }
        }
    }, [selectedOption, filteredOptions, virtualizer]);

    return (
        <Command
            shouldFilter={false}
            onKeyDown={handleKeyDown}
            className={className}
        >
            <CommandInput
                onValueChange={handleSearch}
                placeholder={placeholder}
            />
            <CommandList
                ref={parentRef}
                style={{
                    height: height,
                    width: "100%",
                    overflow: "auto",
                }}
                onMouseDown={() => setIsKeyboardNavActive(false)}
                onMouseMove={() => setIsKeyboardNavActive(false)}
            >
                <CommandEmpty>{messageEmpty}</CommandEmpty>
                <CommandGroup>
                    <div
                        style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        {virtualOptions.map(virtualOption => (
                            <CommandItem
                                key={filteredOptions[virtualOption.index].value}
                                disabled={isKeyboardNavActive}
                                className={cn(
                                    "absolute top-0 left-0 w-full bg-transparent !opacity-100",
                                    focusedIndex === virtualOption.index &&
                                        "bg-zinc-800 text-zinc-50",
                                    isKeyboardNavActive &&
                                        focusedIndex !== virtualOption.index &&
                                        "aria-selected:!bg-transparent aria-selected:text-zinc-50",
                                )}
                                style={{
                                    height: `${virtualOption.size}px`,
                                    transform: `translateY(${virtualOption.start}px)`,
                                }}
                                value={
                                    filteredOptions[virtualOption.index].value
                                }
                                onMouseEnter={() =>
                                    !isKeyboardNavActive &&
                                    setFocusedIndex(virtualOption.index)
                                }
                                onMouseLeave={() =>
                                    !isKeyboardNavActive && setFocusedIndex(-1)
                                }
                                onSelect={onSelectOption}
                            >
                                {filteredOptions[virtualOption.index].label}
                                <Check
                                    className={cn(
                                        "ml-auto size-4",
                                        selectedOption ===
                                            filteredOptions[virtualOption.index]
                                                .value
                                            ? "opacity-100"
                                            : "opacity-0",
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </div>
                </CommandGroup>
            </CommandList>
        </Command>
    );
}

interface VirtualizedComboboxProps {
    options: string[];
    searchPlaceholder?: string;
    width?: string;
    height?: string;
}

export function VirtualizedCombobox({
    options,
    searchPlaceholder = "Search items...",
    width = "400px",
    height = "400px",
}: VirtualizedComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [selectedOption, setSelectedOption] = React.useState("");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                    style={{
                        width: width,
                    }}
                >
                    {selectedOption
                        ? options.find(option => option === selectedOption)
                        : searchPlaceholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{ width: width }}>
                <VirtualizedCommand
                    height={height}
                    options={options.map(option => ({
                        value: option,
                        label: option,
                    }))}
                    placeholder={searchPlaceholder}
                    selectedOption={selectedOption}
                    onSelectOption={currentValue => {
                        setSelectedOption(
                            currentValue === selectedOption ? "" : currentValue,
                        );
                        setOpen(false);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
