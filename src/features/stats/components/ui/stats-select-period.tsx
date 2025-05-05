import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PeriodRange } from "@/features/stats";
import { cn } from "@/lib/utils";

export type StatsSelectPeriodProps<TPeriod extends PeriodRange> = {
    value: NoInfer<TPeriod>;
    values: [TPeriod, ...TPeriod[]];
    labels?: Record<TPeriod, string>;
    placeholder?: string;
    classNameItem?: string;
    classNameTrigger?: string;
    children?: (value: TPeriod) => React.ReactNode;
    onChange?: (value: TPeriod) => void;
} & Omit<
    React.ComponentProps<typeof Select>,
    "value" | "children" | "onValueChange"
>;

export function StatsSelectPeriod<TPeriod extends PeriodRange>({
    value,
    values,
    classNameItem,
    classNameTrigger,
    labels,
    placeholder,
    children,
    onChange,
    ...props
}: StatsSelectPeriodProps<TPeriod>) {
    return (
        <Select value={value} onValueChange={onChange} {...props}>
            <SelectTrigger className={cn(classNameTrigger)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {values.map(value =>
                    children ? (
                        children(value)
                    ) : (
                        <SelectItem
                            key={value}
                            value={value}
                            className={cn(classNameItem)}
                        >
                            {labels ? labels[value as TPeriod] : value}
                        </SelectItem>
                    ),
                )}
            </SelectContent>
        </Select>
    );
}
