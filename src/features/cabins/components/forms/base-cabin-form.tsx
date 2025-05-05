import { ChevronsUpDownIcon, ImageUp as ImageUpIcon } from "lucide-react";
import { z } from "zod";
import { type UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormDropBox,
    FormDropInput,
    FormField,
    FormImageUploadPreview,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cabinFormSchema, getAllCountryNames } from "@/features/cabins";
import { useQuery } from "@tanstack/react-query";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VirtualizedCommand } from "@/components/ui/virtualized-combobox";
import { useState } from "react";

type BaseCabinFormProps<
    TForm extends UseFormReturn<z.infer<typeof cabinFormSchema>>,
> = {
    form: TForm;
    error?: Error | null;
};

export function BaseCabinForm<
    TForm extends UseFormReturn<z.infer<typeof cabinFormSchema>>,
>({ form, error }: BaseCabinFormProps<TForm>) {
    const [isCountryFieldOpen, setIsCountryFieldOpen] = useState(false);
    const {
        data: countriesData,
        error: countriesError,
        isPending: countriesIsPending,
    } = useQuery({
        queryKey: ["countries"],
        queryFn: getAllCountryNames,
    });

    return (
        <>
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name of the Cabin</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Enter the cabin name"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="location.address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Enter the cabin address"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 items-start gap-4">
                <FormField
                    control={form.control}
                    name="location.city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter the city name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location.postalCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter the postal code"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {countriesIsPending && (
                <FormField
                    control={form.control}
                    name="location.country"
                    render={() => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-full justify-between bg-zinc-50 font-normal dark:border-zinc-700 dark:bg-zinc-925 dark:hover:bg-zinc-925",
                                )}
                                disabled
                            >
                                Loading countries...
                                <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 text-zinc-700 dark:text-zinc-500" />
                            </Button>
                        </FormItem>
                    )}
                />
            )}

            {countriesError && (
                <FormField
                    control={form.control}
                    name="location.country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter the country name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {countriesData && (
                <FormField
                    control={form.control}
                    name="location.country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Popover
                                open={isCountryFieldOpen}
                                onOpenChange={setIsCountryFieldOpen}
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
                                            {field.value || "Select Country"}
                                            <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 text-zinc-700 dark:text-zinc-500" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                                    <VirtualizedCommand
                                        className="border-zinc-300 dark:border-zinc-700 dark:bg-zinc-925"
                                        height="200px"
                                        options={
                                            countriesData?.map(({ name }) => ({
                                                value: name.common,
                                                label: name.common,
                                            })) ?? []
                                        }
                                        placeholder="Search country..."
                                        selectedOption={field.value}
                                        onSelectOption={currentValue => {
                                            field.onChange(currentValue);
                                            setIsCountryFieldOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <div className="grid grid-cols-3 items-start gap-4">
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price per Night</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter the price per night in USD"
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
                    name="discount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount per Night</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter the discount per night in USD"
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
                    name="maxNumOfGuests"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Guests Capacity</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter the maximum capacity of guests"
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
            </div>

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description about the Cabin</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Enter a description about the cabin"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                    <FormItem>
                        <FormDropBox className="grid place-items-center gap-1 text-center font-normal text-balance">
                            <ImageUpIcon className="size-4.5 text-current" />
                            Drop cabin images here or click to upload
                        </FormDropBox>
                        <FormControl>
                            <FormDropInput
                                multiple
                                accept="image/jpeg, image/jpg, image/webp"
                                size={1024 * 1024 * 5}
                                {...field}
                            />
                        </FormControl>
                        <FormImageUploadPreview classNameImage="aspect-video" />
                        <FormMessage />
                    </FormItem>
                )}
            />

            {error && <FormMessage> {error.message} </FormMessage>}
        </>
    );
}
