import { usePromiseResolvers } from "@/hooks/use-promise-resolvers";
import { toastPromise } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, loginUser, updateUser } from "@/features/auth";
import { toast } from "sonner";

function useUserMutation<TUser extends Record<any, any>, TReturn>({
    mutationFn,
    toastMessages,
}: {
    mutationFn: (userData: TUser) => Promise<TReturn>;
    toastMessages: [pending: string, successful: string, rejected: string];
}) {
    const queryClient = useQueryClient();
    const [mutationPromise, resolveMutation, rejectMutation] =
        usePromiseResolvers<null>();

    return useMutation({
        mutationFn: (userData: TUser) => mutationFn(userData),
        onMutate: () =>
            toastPromise({ promise: mutationPromise, messages: toastMessages }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            resolveMutation(null);
        },
        onError: rejectMutation,
    });
}

export function useUpdateUserMutation() {
    return useUserMutation({
        mutationFn: updateUser,
        toastMessages: [
            "Updating user...",
            "User updated successfully.",
            "Failed to update user data.",
        ],
    });
}

export function useUpdateUserPasswordMutation() {
    return useUserMutation({
        mutationFn: updateUser,
        toastMessages: [
            "Updating user password...",
            "User password updated successfully.",
            "Failed to update user password.",
        ],
    });
}

export function useCreateUserMutation() {
    return useUserMutation({
        mutationFn: createUser,
        toastMessages: [
            "Creating user...",
            "User created successfully.",
            "Failed to create user.",
        ],
    });
}

export function useLoginUserMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: user => {
            queryClient.setQueryData(["user"], user);
        },
        onError: () => {
            toast.error(
                "Failed to login. Please check your email and password.",
                {
                    richColors: true,
                },
            );
        },
    });
}
