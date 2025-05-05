import { type Tables } from "@/services/supabase";

export type Settings = Omit<Tables<"settings">, "id" | "createdAt">;
export type UpdatedSettings = Partial<Settings>;
