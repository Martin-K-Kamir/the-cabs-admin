import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { NotFoundPage } from "@/pages";
import { AppError } from "@/components/layout/app-error";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { CabinsPage } from "@/features/cabins";
import { SettingsPage } from "@/features/settings";
import { BookingDetailPage, BookingsPage } from "@/features/bookings";
import {
    LoginUserPage,
    CreateUserPage,
    UpdateUserPage,
    AuthenticatedRoute,
} from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
import { useTheme } from "@/features/theme";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
        },
    },
});

export function App() {
    useTheme();

    return (
        <ErrorBoundary
            fallback={
                <AppError error="An error occurred while rendering the application. Please refresh the page and try again.">
                    <Button
                        onClick={() => window.location.replace("/")}
                        className="mt-6 w-full"
                    >
                        Refresh the page
                    </Button>
                </AppError>
            }
        >
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />

                <BrowserRouter>
                    <Routes>
                        <Route
                            element={
                                <AuthenticatedRoute>
                                    <AppLayout />
                                </AuthenticatedRoute>
                            }
                        >
                            <Route
                                index
                                element={<Navigate replace to="dashboard" />}
                            />
                            <Route
                                path="dashboard"
                                element={<DashboardPage />}
                            />
                            <Route path="bookings" element={<BookingsPage />} />
                            <Route
                                path="bookings/:booking"
                                element={<BookingDetailPage />}
                            />
                            <Route path="cabins" element={<CabinsPage />} />
                            <Route
                                path="create-user"
                                element={<CreateUserPage />}
                            />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route
                                path="account"
                                element={<UpdateUserPage />}
                            />
                        </Route>

                        <Route path="login" element={<LoginUserPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </BrowserRouter>

                <Toaster position="top-right" />
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
