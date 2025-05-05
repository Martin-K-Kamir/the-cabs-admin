import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { type PeriodRange } from "@/features/stats";

export type StatsTogglePeriodProps<TPeriod extends PeriodRange> = {
    value: NoInfer<TPeriod>;
    values: [TPeriod, ...TPeriod[]];
    labels?: Record<TPeriod, string>;
    classNameItem?: string;
    children?: (value: TPeriod) => React.ReactNode;
    onChange?: (value: TPeriod) => void;
} & Omit<
    React.ComponentProps<typeof ToggleGroup>,
    | "type"
    | "value"
    | "onValueChange"
    | "defaultValue"
    | "children"
    | "onChange"
>;

export function StatsTogglePeriod<TPeriod extends PeriodRange>({
    value,
    values,
    labels,
    className,
    classNameItem,
    children,
    onChange,
    ...props
}: StatsTogglePeriodProps<TPeriod>) {
    return (
        <ToggleGroup
            type="single"
            value={value}
            onValueChange={v => {
                onChange?.(v === "" ? value : (v as TPeriod));
            }}
            variant="outline"
            className={cn(className)}
            {...props}
        >
            {values.map(value =>
                children ? (
                    children(value)
                ) : (
                    <ToggleGroupItem
                        key={value}
                        value={value}
                        className={cn("h-8 px-5", classNameItem)}
                    >
                        {labels ? labels[value as TPeriod] : value}
                    </ToggleGroupItem>
                ),
            )}
        </ToggleGroup>
    );
}
