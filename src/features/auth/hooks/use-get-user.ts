import { useQuery } from "@tanstack/react-query";
import { getUser, type User } from "@/features/auth";

export function useGetUser() {
    const { data, ...props } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });

    let user: User | null | undefined = null;

    if (data) {
        user = {
            ...data,
            name: data.user_metadata.name,
            avatar: data.user_metadata.avatar,
        };
    }

    return { user, ...props };
}
