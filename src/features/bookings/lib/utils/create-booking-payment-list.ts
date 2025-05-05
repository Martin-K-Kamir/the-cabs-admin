import {
    type BookingPaymentItem,
    type BookingPaymentProps,
} from "@/features/bookings";

type CreateBookingPaymentListReturn = readonly [
    confirmed: BookingPaymentItem[],
    pending: BookingPaymentItem[],
    refunded: BookingPaymentItem[],
];

export function createBookingPaymentList({
    cabinPrice,
    newCabinPrice,
    cabinPaid,
    cabinRefund,
    isNewBreakfast,
    isBreakfast,
    breakfastPrice,
    newBreakfastPrice,
    breakfastPaid,
    breakfastRefund,
}: BookingPaymentProps): CreateBookingPaymentListReturn {
    const isInEditMode = typeof newCabinPrice === "number";
    const isInViewMode =
        cabinPrice !== undefined &&
        cabinPaid !== undefined &&
        breakfastPrice !== undefined &&
        breakfastPaid !== undefined &&
        cabinRefund !== undefined &&
        breakfastRefund !== undefined;

    const confirmed = new Map<string, BookingPaymentItem>();
    const pending = new Map<string, BookingPaymentItem>();
    const refunded = new Map<string, BookingPaymentItem>();

    const addPayment = (
        map: Map<string, BookingPaymentItem>,
        label: string,
        price: number,
    ) => map.set(label, { label, price });

    const addConfirmed = (label: string, price: number) =>
        addPayment(confirmed, label, price);
    const addPending = (label: string, price: number) =>
        addPayment(pending, label, price);
    const addRefunded = (label: string, price: number) =>
        addPayment(refunded, label, price);

    if (isInViewMode && cabinPrice > cabinPaid) {
        addPending("Cabin", cabinPrice - cabinPaid);
    }

    if (
        isInViewMode &&
        !isInEditMode &&
        isBreakfast &&
        breakfastPrice > breakfastPaid
    ) {
        addPending("Breakfast", breakfastPrice - breakfastPaid);
    }

    if (isInViewMode && cabinPaid > 0) {
        addConfirmed("Cabin", cabinPaid);
    }

    if (isInViewMode && breakfastPaid > 0) {
        addConfirmed("Breakfast", breakfastPaid);
    }

    if (newCabinPrice && newCabinPrice > 0) {
        addPending("Cabin", newCabinPrice - (cabinPaid || 0));
    }

    if (isNewBreakfast && newBreakfastPrice && newBreakfastPrice > 0) {
        addPending("Breakfast", newBreakfastPrice - (breakfastPaid || 0));
    }

    if (isInViewMode && newCabinPrice && newCabinPrice < cabinPaid) {
        addRefunded("Cabin", cabinPaid - newCabinPrice);
    }

    if (
        isInViewMode &&
        isNewBreakfast &&
        newBreakfastPrice &&
        newBreakfastPrice < breakfastPaid
    ) {
        addRefunded("Breakfast", breakfastPaid - newBreakfastPrice);
    }

    if (
        isInViewMode &&
        isInEditMode &&
        isBreakfast &&
        !isNewBreakfast &&
        breakfastPaid > 0
    ) {
        addRefunded("Breakfast", breakfastPaid);
    }

    if (isInViewMode && !isInEditMode && cabinRefund > 0) {
        addRefunded("Cabin", cabinRefund);
    }

    if (isInViewMode && !isNewBreakfast && !isBreakfast && breakfastPaid > 0) {
        addRefunded("Breakfast", breakfastPaid);
    }

    if (isInViewMode && !isInEditMode && breakfastRefund > 0) {
        addRefunded("Breakfast", breakfastRefund);
    }

    return [
        Array.from(confirmed.values()),
        Array.from(pending.values()),
        Array.from(refunded.values()),
    ] as const;
}
