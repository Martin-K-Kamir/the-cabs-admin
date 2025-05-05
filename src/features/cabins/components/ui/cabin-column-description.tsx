import type { Row } from "@tanstack/react-table";
import { type CabinItem } from "@/features/cabins";
import { cn } from "@/lib/utils";

type CabinColumnDescriptionProps = {
    row: Row<CabinItem>;
} & Omit<React.ComponentProps<"span">, "children">;

export function CabinColumnDescription({
    row,
    className,
    ...props
}: CabinColumnDescriptionProps) {
    const description = row.getValue("description")
    assertDescriptionExists(description);


    return (
        <span
            {...props}
            className={cn(
                "truncate max-w-[30ch] lg:max-w-[45ch] inline-block",
                className,
            )}
        >
            {description}
        </span>
    );
}

function assertDescriptionExists(description: unknown): asserts description is string {
    if (typeof description !== "string") {
        throw new Error("Description must be a string");
    }
}