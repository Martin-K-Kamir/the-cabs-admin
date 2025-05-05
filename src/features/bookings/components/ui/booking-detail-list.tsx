import { cn } from "@/lib/utils";

type BookingDetailListProps = {
    list: {
        label: string;
        value: string;
        icon?: React.ReactNode;
    }[];
} & Omit<React.ComponentProps<"ul">, "children">;

export function BookingDetailList({
    list,
    className,
    ...props
}: BookingDetailListProps) {
    return (
        <ul {...props} className={cn("space-y-4 sm:space-y-3", className)}>
            {list.map(item => (
                <li
                    key={item.label}
                    className="space-x-2 text-balance text-zinc-800 dark:text-zinc-200"
                >
                    <div className="inline-block space-x-2">
                        <span className="inline-block translate-y-0.5">
                            {item.icon}
                        </span>
                        <span className="font-semibold">{item.label}:</span>
                    </div>
                    <span>{item.value}</span>
                </li>
            ))}
        </ul>
    );
}
