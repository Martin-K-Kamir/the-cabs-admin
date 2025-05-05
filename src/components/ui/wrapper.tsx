import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const wrapperVariants = cva("mx-auto px-4 lg:px-10", {
    variants: {
        size: {
            default: "lg:container",
            sm: "max-w-sm w-full",
            md: "max-w-lg w-full",
            lg: "max-w-3xl w-full",
        },
    },
    defaultVariants: {
        size: "default",
    },
});

export function Wrapper({
    className,
    size,
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof wrapperVariants>) {
    return (
        <div {...props} className={cn(wrapperVariants({ size, className }))} />
    );
}
