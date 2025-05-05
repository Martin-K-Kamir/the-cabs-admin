import { supabase } from "@/services/supabase";
import { urlToUploadImages, type NewUser } from "@/features/auth";
import { UploadableMapper } from "@/lib/utils";

export async function createUser({ name, email, password, avatar }: NewUser) {
    const isAvatar = avatar && avatar.length > 0;
    let mapper: UploadableMapper | undefined;
    if (isAvatar && avatar) {
        mapper = new UploadableMapper(avatar, urlToUploadImages);
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                avatar: isAvatar && mapper && mapper.getUrlPaths()[0],
            },
        },
    });

    if (error) {
        throw error;
    }

    if (!isAvatar) {
        return data.user;
    }

    if (mapper && mapper.getFilesToUpload().length > 0) {
        const { name, file } = mapper.getFilesToUpload()[0];

        const { error } = await supabase.storage
            .from("avatars")
            .upload(name, file);

        if (error) {
            throw error;
        }
    }

    return data.user;
}
