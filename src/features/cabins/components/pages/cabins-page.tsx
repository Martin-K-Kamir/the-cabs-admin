import { useQuery } from "@tanstack/react-query";
import {
    DataTable,
    DataTableContent,
    DataTablePagination,
    DataTableViewOptions,
} from "@/components/ui/data-table";
import { Wrapper } from "@/components/ui/wrapper";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { ErrorMessage } from "@/components/ui/error-message";
import {
    cabinColumns,
    CreateCabinDialog,
    CreateCabinDialogTrigger,
    getAllCabins,
} from "@/features/cabins";

export function CabinsPage() {
    const { data, error, isPending } = useQuery({
        queryKey: ["cabins"],
        queryFn: getAllCabins,
    });

    if (isPending) {
        return (
            <Wrapper className="grid min-h-80 place-items-center">
                <Loader />
            </Wrapper>
        );
    }

    if (error) {
        return (
            <Wrapper className="grid min-h-80 place-items-center">
                <ErrorMessage error={error} />
            </Wrapper>
        );
    }

    return (
        <Wrapper className="space-y-5">
            <DataTable columns={cabinColumns} data={data}>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">All Cabins</h1>
                    <DataTableViewOptions />
                </div>

                <DataTableContent />

                <div className="flex flex-col-reverse items-end gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CreateCabinDialog>
                        <CreateCabinDialogTrigger asChild>
                            <Button>Create Cabin</Button>
                        </CreateCabinDialogTrigger>
                    </CreateCabinDialog>

                    <DataTablePagination />
                </div>
            </DataTable>
        </Wrapper>
    );
}

export default CabinsPage;
