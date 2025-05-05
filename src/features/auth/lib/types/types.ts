import { type User as ApiUser } from "@supabase/supabase-js";

export type UserId = ApiUser["id"];

export type UserData = {
    name: string;
    avatar: string;
};

export type User = UserData & ApiUser;

export type NewUser = {
    name: string;
    email: string;
    password: string;
    avatar: File[];
};

export type UpdateUser = Partial<
    NewUser & {
        removeAvatar: boolean;
    }
>;
