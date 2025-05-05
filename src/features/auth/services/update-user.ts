import { supabase } from "@/services/supabase";
import { urlToUploadImages, type User, type UpdateUser } from "@/features/auth";
import { UploadableMapper } from "@/lib/utils";

export async function updateUser({
    password,
    avatar,
    removeAvatar,
    ...updatedUser
}: UpdateUser) {
    const emptyUpdatedUser = Object.keys(updatedUser).length === 0;

    const isAvatar = avatar && avatar.length > 0;
    let mapper: UploadableMapper | undefined;
    if (isAvatar && avatar) {
        mapper = new UploadableMapper(avatar, urlToUploadImages);
    }

    const { data, error } = await supabase.auth.updateUser({
        ...(password && { password }),
        ...(!emptyUpdatedUser && {
            data: {
                ...updatedUser,
                ...(isAvatar && mapper && { avatar: mapper.getUrlPaths()[0] }),
                ...(removeAvatar && { avatar: "" }),
            },
        }),
    });

    if (error) {
        throw error;
    }

    if (!isAvatar) {
        return data.user as User;
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

    return data.user as User;
}
