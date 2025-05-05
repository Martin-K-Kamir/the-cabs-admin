import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useMediaQuery } from "usehooks-ts";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn, createBreadcrumbs } from "@/lib/utils";
import { Link, useLocation, useParams } from "react-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
    return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
    return (
        <ol
            data-slot="breadcrumb-list"
            className={cn(
                "flex flex-wrap items-center gap-1.5 text-sm break-words text-zinc-800 sm:gap-2.5 dark:text-zinc-400",
                className,
            )}
            {...props}
        />
    );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
    return (
        <li
            data-slot="breadcrumb-item"
            className={cn("inline-flex items-center gap-1.5", className)}
            {...props}
        />
    );
}

function BreadcrumbLink({
    asChild,
    className,
    ...props
}: React.ComponentProps<"a"> & {
    asChild?: boolean;
}) {
    const Comp = asChild ? Slot : "a";

    return (
        <Comp
            data-slot="breadcrumb-link"
            className={cn(
                "text-zinc-600 transition-colors outline-none hover:text-zinc-950 focus:text-zinc-950 focus:underline dark:text-zinc-400 dark:hover:text-zinc-100 dark:focus:text-zinc-100",
                className,
            )}
            {...props}
        />
    );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="breadcrumb-page"
            role="link"
            aria-disabled="true"
            aria-current="page"
            className={cn(
                "font-normal text-zinc-950 dark:text-zinc-100",
                className,
            )}
            {...props}
        />
    );
}

function BreadcrumbSeparator({
    children,
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="breadcrumb-separator"
            role="presentation"
            aria-hidden="true"
            className={cn("[&>svg]:size-3.5", className)}
            {...props}
        >
            {children ?? <ChevronRight />}
        </div>
    );
}

function BreadcrumbEllipsis({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="breadcrumb-ellipsis"
            role="presentation"
            aria-hidden="true"
            className={cn("flex size-9 items-center justify-center", className)}
            {...props}
        >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">More</span>
        </span>
    );
}

function BreadcrumbResponsive() {
    const location = useLocation();
    const params = useParams();
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [open, setOpen] = useState(false);
    const ITEMS_TO_DISPLAY = isDesktop ? 3 : 2;

    const items = createBreadcrumbs(location.pathname, params);

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    const startIndex =
        items.length - ITEMS_TO_DISPLAY < 0 ? 1 : -ITEMS_TO_DISPLAY + 1;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href={items[0]?.href}>
                        {items[0]?.label}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {items.length > ITEMS_TO_DISPLAY ? (
                    <>
                        <BreadcrumbItem>
                            {isDesktop ? (
                                <DropdownMenu
                                    open={open}
                                    onOpenChange={setOpen}
                                >
                                    <DropdownMenuTrigger
                                        className="flex items-center gap-1"
                                        aria-label="Toggle menu"
                                    >
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {items
                                            .slice(1, -2)
                                            .map((item, index) => (
                                                <DropdownMenuItem key={index}>
                                                    <Link
                                                        to={
                                                            item.href
                                                                ? item.href
                                                                : "#"
                                                        }
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Drawer
                                    open={open}
                                    onOpenChange={setOpen}
                                    autoFocus={open}
                                >
                                    <DrawerTrigger
                                        aria-label="Toggle Menu"
                                        className="cursor-pointer"
                                    >
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader className="text-left">
                                            <DrawerTitle>
                                                Navigate to
                                            </DrawerTitle>
                                            <DrawerDescription>
                                                Select a page to navigate to.
                                            </DrawerDescription>
                                        </DrawerHeader>
                                        <div className="grid gap-1 px-4">
                                            {items
                                                .slice(0, items.length - 1)
                                                .map((item, index) => (
                                                    <Link
                                                        key={index}
                                                        to={
                                                            item.href
                                                                ? item.href
                                                                : "#"
                                                        }
                                                        className="py-1 text-sm"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                        </div>
                                        <DrawerFooter className="pt-4">
                                            <DrawerClose asChild>
                                                <Button variant="outline">
                                                    Close
                                                </Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                            )}
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </>
                ) : null}
                {items.slice(startIndex).map((item, index) => (
                    <BreadcrumbItem key={index}>
                        {item.href ? (
                            <>
                                <BreadcrumbLink
                                    asChild
                                    className="max-w-20 truncate md:max-w-none"
                                >
                                    <Link to={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                                <BreadcrumbSeparator />
                            </>
                        ) : (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        )}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
    BreadcrumbResponsive,
};
