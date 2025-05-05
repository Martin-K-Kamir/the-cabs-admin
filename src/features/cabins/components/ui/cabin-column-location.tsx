import type { Row } from "@tanstack/react-table";
import { type CabinLocation, type CabinItem } from "@/features/cabins";
import { cn } from "@/lib/utils";

type CabinColumnLocationProps = {
    row: Row<CabinItem>;
} & Omit<React.ComponentProps<"span">, "children">;

export function CabinColumnLocation({
    row,
    className,
    ...props
}: CabinColumnLocationProps) {
    const location = row.getValue("location");
    assertLocationExists(location);

    return (
        <span
            {...props}
            className={cn(
                "inline-block max-w-[24ch] truncate lg:max-w-[32ch]",
                className,
            )}
        >
            {`${location.country}, ${location.city}, ${location.address}, ${location.postalCode}`}
        </span>
    );
}

export function assertLocationExists(
    location: unknown,
): asserts location is CabinLocation {
    if (typeof location !== "object" || location === null) {
        throw new Error("Cabin location must be an object");
    }
    if (!("country" in location)) {
        throw new Error("Cabin location must have a country property");
    }
    if (!("city" in location)) {
        throw new Error("Cabin location must have a city property");
    }
    if (!("address" in location)) {
        throw new Error("Cabin location must have a address property");
    }
    if (!("postalCode" in location)) {
        throw new Error("Cabin location must have a postalCode property");
    }
}
