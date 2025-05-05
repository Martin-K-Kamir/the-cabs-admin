import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Wrapper } from "@/components/ui/wrapper";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { ErrorMessage } from "@/components/ui/error-message";
import {
    BookingDetailOperations,
    BookingDetailBadge,
    BookingDetailList,
    BookingDetailPaymentSummary,
    BookingDetailExpiry,
    getBookingById,
    assertBookingIdExists,
    createBookingDetailList,
    getArrivalOrDepartureMessage,
} from "@/features/bookings";
import { Badge } from "@/components/ui/badge";

export function BookingDetailPage() {
    const { booking: bookingId } = useParams();
    assertBookingIdExists(bookingId);
    const navigate = useNavigate();

    const { data, isPending, error } = useQuery({
        queryKey: ["booking", bookingId],
        queryFn: () => getBookingById(bookingId),
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

    const list = createBookingDetailList(data);
    const message = getArrivalOrDepartureMessage(
        new Date(data.startDate),
        new Date(data.endDate),
        data.status,
    );

    return (
        <Wrapper size="lg">
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl font-semibold" asChild>
                            <h1>Booking #{bookingId}</h1>
                        </CardTitle>
                        <CardDescription className="mt-1.5">
                            Created: {format(new Date(data.createdAt), "P")}
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeftIcon className="size-4 translate-y-[1px]" />
                        Back
                    </Button>
                </CardHeader>
                <CardContent className="mt-2 space-y-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <BookingDetailBadge
                            status={data.status}
                            className="capitalize"
                        />
                        {message && (
                            <Badge className="px-3 py-1">{message}</Badge>
                        )}
                    </div>
                    <BookingDetailList list={list} />
                    <BookingDetailPaymentSummary
                        data={data}
                        labels={[
                            "Confirmed",
                            "Pending",
                            data.status === "canceled"
                                ? "Refunded"
                                : "Refunded after Check out",
                        ]}
                    />
                    <BookingDetailOperations
                        bookingData={data}
                        className="empty:m-0"
                    />
                    <BookingDetailExpiry
                        endDate={data.endDate}
                        status={data.status}
                    />
                </CardContent>
            </Card>
        </Wrapper>
    );
}

export default BookingDetailPage;
