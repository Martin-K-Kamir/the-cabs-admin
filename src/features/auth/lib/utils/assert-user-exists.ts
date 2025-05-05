import { type User } from "@/features/auth";

export function assertUserExists(
    user: User | null | undefined,
): asserts user is User {
    if (!user) {
        throw new Error("User does not exist");
    }
}
