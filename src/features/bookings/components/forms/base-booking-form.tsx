import { z } from "zod";
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, formatDateRange } from "@/lib/utils";

import { bookingFormSchema } from "@/features/bookings/lib";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

type BaseBookingFormProps<
    TForm extends UseFormReturn<z.infer<typeof bookingFormSchema>>,
> = {
    form: TForm;
    isUpdateMode?: boolean;
    fromDate?: Date;
};

export function BaseBookingForm<
    TForm extends UseFormReturn<z.infer<typeof bookingFormSchema>>,
>({ form, isUpdateMode, fromDate }: BaseBookingFormProps<TForm>) {
    const [openSelectedCabinId, setOpenSelectedCabinId] = useState(false);

    return (
        <>
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name of Guest</FormLabel>
                        <FormControl>
                            <Input
                                disabled={isUpdateMode}
                                placeholder="Enter the full name"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Address of Guest</FormLabel>
                        <FormControl>
                            <Input
                                disabled={isUpdateMode}
                                placeholder="Enter the email address"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone Number of Guest</FormLabel>
                        <FormControl>
                            <Input
                                disabled={isUpdateMode}
                                placeholder="Enter the phone number"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="numOfGuests"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Guests </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="Enter the number of guests"
                                {...field}
                                onChange={e =>
                                    field.onChange(Number(e.target.value))
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="selectedCabinId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Select a Cabin</FormLabel>
                        <Popover
                            open={openSelectedCabinId}
                            onOpenChange={setOpenSelectedCabinId}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "justify-between bg-zinc-50 font-normal dark:border-zinc-700 dark:bg-zinc-925 dark:hover:bg-zinc-925",
                                            !field.value &&
                                                "text-zinc-500 dark:text-zinc-400",
                                        )}
                                    >
                                        {field.value
                                            ? form
                                                  .watch("cabins")
                                                  ?.find(
                                                      cabin =>
                                                          cabin.id.toString() ===
                                                          field.value,
                                                  )?.name
                                            : "Select Cabin"}
                                        <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 text-zinc-700 dark:text-zinc-500" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                                <Command className="border-zinc-300 dark:border-zinc-700 dark:bg-zinc-925">
                                    <CommandInput placeholder="Search cabin..." />
                                    <CommandList>
                                        <CommandEmpty>
                                            No language found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {form
                                                .watch("cabins")
                                                ?.map(cabin => (
                                                    <CommandItem
                                                        value={cabin.name}
                                                        key={cabin.id}
                                                        onSelect={() => {
                                                            form.setValue(
                                                                "selectedCabinId",
                                                                cabin.id.toString(),
                                                            );
                                                            setOpenSelectedCabinId(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        {cabin.name}
                                                        <CheckIcon
                                                            className={cn(
                                                                "ml-auto",
                                                                cabin.id.toString() ===
                                                                    field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="dates"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Booking Dates</FormLabel>
                        <Popover
                            onOpenChange={isOpen => {
                                if (!isOpen) {
                                    form.setValue("selectedDate", new Date());
                                }
                            }}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "justify-between bg-zinc-50 font-normal dark:border-zinc-700 dark:bg-zinc-925 dark:hover:bg-zinc-925",
                                            !field.value.from &&
                                                !field.value.to &&
                                                "text-zinc-500 dark:text-zinc-400",
                                        )}
                                    >
                                        {formatDateRange(
                                            field.value.from,
                                            field.value.to,
                                        )}
                                        <CalendarIcon className="ml-2 size-4 shrink-0 text-zinc-700 dark:text-zinc-500" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto border-zinc-300 p-0 dark:border-zinc-700 dark:bg-zinc-925"
                                align="center"
                            >
                                <Calendar
                                    initialFocus
                                    excludeDisabled
                                    mode="range"
                                    onSelect={field.onChange}
                                    onMonthChange={date =>
                                        form.setValue("selectedDate", date)
                                    }
                                    numberOfMonths={2}
                                    selected={{
                                        from: field.value.from,
                                        to: field.value.to,
                                    }}
                                    defaultMonth={fromDate ?? new Date()}
                                    fromDate={new Date()}
                                    toYear={new Date().getFullYear() + 1}
                                    disabled={form.watch("bookingDates")}
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="observations"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Special Observations</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Enter any special observations"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="isBreakfast"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-1">
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <FormLabel>Include Breakfast</FormLabel>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}
