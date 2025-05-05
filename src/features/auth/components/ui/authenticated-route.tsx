import { Link, Navigate } from "react-router";
import { AppError } from "@/components/layout/app-error";
import { useTheme } from "@/features/theme";
import { Button } from "@/components/ui/button";
import { View } from "@/components/ui/view";
import { Loader } from "@/components/ui/loader";
import { useGetUser } from "@/features/auth";

export function AuthenticatedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    useTheme();

    const { user, error, isPending } = useGetUser();

    if (isPending) {
        return (
            <View>
                <Loader />
            </View>
        );
    }

    if (isPending) {
        return null;
    }

    if (error) {
        return (
            <AppError error={error}>
                <Button className="mt-6 w-full">
                    <Link to="/login">Go back to login page</Link>
                </Button>
            </AppError>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== "authenticated") {
        return <Navigate to="/login" />;
    }

    return children;
}
