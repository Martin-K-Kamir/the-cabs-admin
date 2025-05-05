import React, { createContext, useContext, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useTableSearchParams } from "tanstack-table-search-params";
import {
    CheckIcon,
    PlusCircleIcon,
    ArrowUpDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    Settings2 as SettingsIcon,
} from "lucide-react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    VisibilityState,
    type ColumnDef,
    type Column,
    // type ColumnFiltersState,
    // type SortingState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { XOR } from "@/lib/types";

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
};

type DataTableContextValue<TData> = {
    table: ReturnType<typeof useReactTable<TData>>;
    columns: ColumnDef<TData, any>[];
};

const DataTableContext = createContext<DataTableContextValue<any> | null>(null);

export const useDataTable = <TData,>() => {
    const context = useContext(
        DataTableContext,
    ) as DataTableContextValue<TData> | null;

    if (!context) {
        throw new Error(
            "useDataTable must be used within a <DataTableProvider/>",
        );
    }

    return context;
};

function DataTableProvider<TData extends Record<string, any>, TValue>({
    columns,
    data,
    children,
}: DataTableProps<TData, TValue> & {
    className?: string;
    children: React.ReactNode;
}) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );

    const [rowSelection, setRowSelection] = useState({});

    // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    // const [sorting, setSorting] = useState<SortingState>([]);

    const [query] = useSearchParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const {
        onColumnFiltersChange,
        onColumnOrderChange,
        onGlobalFilterChange,
        onPaginationChange,
        onSortingChange,
        state,
    } = useTableSearchParams({
        query,
        pathname,
        replace: url => navigate(url, { replace: true }),
    });

    const table = useReactTable({
        data,
        columns,
        enableRowSelection: row => row.original.status === "canceled",
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        // onSortingChange: setSorting,
        // onColumnFiltersChange: setColumnFilters,
        onSortingChange,
        onColumnFiltersChange,
        onColumnOrderChange,
        onGlobalFilterChange,
        onPaginationChange,
        state: {
            ...state,
            // sorting,
            // columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <DataTableContext.Provider value={{ table, columns }}>
            {children}
        </DataTableContext.Provider>
    );
}

export function DataTable<TData extends Record<string, any>, TValue>({
    columns,
    data,
    children,
}: DataTableProps<TData, TValue> & {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <DataTableProvider columns={columns} data={data}>
            {children}
        </DataTableProvider>
    );
}

export function DataTableViewOptions({
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenu> & { className?: string }) {
    const { table } = useDataTable();

    return (
        <DropdownMenu {...props}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn("h-8", className)}
                >
                    <SettingsIcon />
                    View
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter(column => column.getCanHide())
                    .map(column => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={value =>
                                    column.toggleVisibility(!!value)
                                }
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function DataTablePageCounter({
    className,
    ...props
}: Omit<React.ComponentProps<"div">, "children">) {
    const { table } = useDataTable();

    return (
        <div {...props} className={cn(className)}>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
        </div>
    );
}

export function DataTableFirstPageButton({
    className,
    children,
    ...props
}: React.ComponentProps<typeof Button>) {
    const { table } = useDataTable();

    return (
        <Button
            {...props}
            className={cn(className)}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
        >
            {children}
        </Button>
    );
}

export function DataTableLastPageButton({
    className,
    children,
    ...props
}: React.ComponentProps<typeof Button>) {
    const { table } = useDataTable();

    return (
        <Button
            {...props}
            className={cn(className)}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
        >
            {children}
        </Button>
    );
}

export function DataTablePrevPageButton({
    className,
    children,
    ...props
}: React.ComponentProps<typeof Button>) {
    const { table } = useDataTable();

    return (
        <Button
            {...props}
            className={cn(className)}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
        >
            {children}
        </Button>
    );
}

export function DataTableNextPageButton({
    className,
    children,
    ...props
}: React.ComponentProps<typeof Button>) {
    const { table } = useDataTable();

    return (
        <Button
            {...props}
            className={cn(className)}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
        >
            {children}
        </Button>
    );
}

export function DataTableSizeSelector() {
    const { table } = useDataTable();

    return (
        <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => {
                table.setPageSize(Number(value));
            }}
        >
            <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                />
            </SelectTrigger>
            <SelectContent side="top">
                {[10, 20, 30, 40, 50].map(pageSize => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export function DataTableButtonPagination({
    className,
    ...props
}: Omit<React.ComponentProps<"div">, "children">) {
    return (
        <div
            {...props}
            className={cn("flex items-center space-x-2", className)}
        >
            <DataTableFirstPageButton
                className="hidden h-8 w-8 p-0 lg:flex"
                variant="outline"
            >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
            </DataTableFirstPageButton>
            <DataTablePrevPageButton className="h-8 w-8 p-0" variant="outline">
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
            </DataTablePrevPageButton>
            <DataTableNextPageButton className="h-8 w-8 p-0" variant="outline">
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
            </DataTableNextPageButton>
            <DataTableLastPageButton
                className="hidden h-8 w-8 p-0 lg:flex"
                variant="outline"
            >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
            </DataTableLastPageButton>
        </div>
    );
}

export function DataTablePagination({
    className,
    ...props
}: Omit<React.ComponentProps<"div">, "children">) {
    return (
        <div
            {...props}
            className={cn(
                "flex flex-wrap items-center justify-end gap-4 sm:gap-8",
                className,
            )}
        >
            <div className="flex items-center gap-2">
                <p className="text-sm">Rows per page</p>
                <DataTableSizeSelector />
            </div>
            <div className="flex items-center gap-4 sm:gap-8">
                <DataTablePageCounter className="text-sm" />
                <DataTableButtonPagination />
            </div>
        </div>
    );
}

export function DataTableSelectedRowsCounter({
    className,
    ...props
}: Omit<React.ComponentProps<"div">, "children">) {
    const { table } = useDataTable();

    return (
        <div {...props} className={cn("text-sm", className)}>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
    );
}

export function DataTableSelectedRows<TData>({
    children,
}: {
    children: (props: {
        selectedRows: TData;
        resetSelection: () => void;
    }) => React.ReactNode;
}) {
    const { table } = useDataTable<TData>();
    const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map(row => row.original) as TData;
    const resetSelection = () => table.resetRowSelection();

    return <>{children({ selectedRows, resetSelection })}</>;
}

export function DataTableSelectedButton({
    children,
    showOnSelected = 0,
    ...props
}: Omit<React.ComponentProps<typeof Button>, "children"> & {
    children: (selectedCount: number) => React.ReactNode;
    showOnSelected?: number;
}) {
    const { table } = useDataTable();
    const selectedCount = table.getFilteredSelectedRowModel().rows.length;

    if (selectedCount < showOnSelected) {
        return null;
    }

    return (
        <Button {...props} disabled={!selectedCount}>
            {children(selectedCount)}
        </Button>
    );
}

type DataTableColumnHeaderProps<TData, TValue> = {
    column: Column<TData, TValue>;
    className?: string;
} & Omit<
    React.ComponentProps<typeof Button>,
    "onClick" | "children" | "title"
> &
    XOR<{ title: string }, { children: React.ReactNode }>;

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    children,
    className,
    ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        throw new Error("Column must be sortable");
    }

    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className={cn("dark:text-zinc-300", className)}
            {...props}
        >
            {title && (
                <>
                    {title}
                    <ArrowUpDownIcon className="ml-1 h-4 w-4" />
                </>
            )}
            {children}
        </Button>
    );
}

export function DataTableFilterInput({
    columnId,
    className,
    placeholder = "Filter...",
    ...props
}: {
    columnId: string;
} & Omit<React.ComponentProps<typeof Input>, "value" | "onChange">) {
    const { table } = useDataTable();
    const column = table.getColumn(columnId);

    if (!column) {
        throw new Error(`Column with id ${columnId} not found`);
    }

    return (
        <div className="flex items-center">
            <Input
                {...props}
                placeholder={placeholder}
                value={(column?.getFilterValue() as string) ?? ""}
                onChange={event =>
                    table
                        .getColumn(columnId)
                        ?.setFilterValue(event.target.value)
                }
                className={cn("max-w-sm", className)}
            />
        </div>
    );
}

export function DataTableResetFilters({
    children,
    ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick">) {
    const { table } = useDataTable();
    const isFiltered = table.getState().columnFilters.length > 0;

    if (!isFiltered) {
        return null;
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="hover:bg-zinc-300/80"
            onClick={() => table.resetColumnFilters()}
            {...props}
        >
            {children ?? "Reset filters"}
        </Button>
    );
}

type DataTableFacetedFilterProps = {
    columnId: string;
    title?: string;
    options: {
        label: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
    classNameContent?: string;
};

export function DataTableFacetedFilter({
    columnId,
    title,
    options,
    classNameContent,
}: DataTableFacetedFilterProps) {
    const { table } = useDataTable();
    const column = table.getColumn(columnId);

    if (!column) {
        throw new Error(`Column with id ${columnId} not found`);
    }

    const facets = column?.getFacetedUniqueValues();
    const selectedValues = new Set(column?.getFilterValue() as string[]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-dashed border-zinc-300 bg-white"
                >
                    <PlusCircleIcon />
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator
                                orientation="vertical"
                                className="mx-2 h-4"
                            />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter(option =>
                                            selectedValues.has(option.value),
                                        )
                                        .map(option => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={cn("w-52 p-0", classNameContent)}
                align="start"
            >
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map(option => {
                                const isSelected = selectedValues.has(
                                    option.value,
                                );
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {
                                                selectedValues.delete(
                                                    option.value,
                                                );
                                            } else {
                                                selectedValues.add(
                                                    option.value,
                                                );
                                            }

                                            const filterValues =
                                                Array.from(selectedValues);

                                            column.setFilterValue(
                                                filterValues.length
                                                    ? filterValues
                                                    : undefined,
                                            );
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded border border-zinc-950 dark:border-zinc-100",
                                                isSelected
                                                    ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950"
                                                    : "opacity-50 [&_svg]:invisible",
                                            )}
                                        >
                                            <CheckIcon className="text-zinc-50 dark:text-zinc-950" />
                                        </div>
                                        {option.icon && (
                                            <option.icon className="mr-0.5 h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                                        )}
                                        <span>{option.label}</span>
                                        {facets?.get(option.value) && (
                                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-sm">
                                                {facets.get(option.value)}
                                            </span>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() =>
                                            column.setFilterValue(undefined)
                                        }
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export function DataTableContent({
    className,
    classNameWrapper,
    ...props
}: React.ComponentProps<typeof Table> & { classNameWrapper?: string }) {
    const { table, columns } = useDataTable();

    return (
        <div className="overflow-auto rounded-md shadow-xs">
            <div
                className={cn(
                    "overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700",
                    classNameWrapper,
                )}
            >
                <Table
                    className={cn("bg-white dark:bg-zinc-900", className)}
                    {...props}
                >
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
