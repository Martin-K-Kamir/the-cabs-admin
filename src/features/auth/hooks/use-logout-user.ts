import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/features/auth";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useLogoutUser() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, ...props } = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.clear();
            navigate("/login", { replace: true });
        },
        onError: () => {
            toast.error("Failed to logout", { richColors: true });
        },
    });

    return { logout: mutate, ...props };
}
