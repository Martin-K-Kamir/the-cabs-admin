import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
    ImageGalleryDialog,
    ImageGalleryDialogTrigger,
} from "@/components/ui/image-gallery";
import { LazyImage } from "@/components/ui/lazy-image";
import { type CabinItem } from "@/features/cabins";

export function CabinColumnImage({
    row,
    className,
    classNameLoader,
    ...props
}: {
    row: Row<CabinItem>;
} & React.ComponentProps<typeof LazyImage>) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const images = row.getValue("image");
    assertImagesExist(images);

    return (
        <ImageGalleryDialog images={images}>
            <ImageGalleryDialogTrigger className="block cursor-pointer outline-none focus-visible:[&_img]:outline-2">
                <LazyImage
                    {...props}
                    src={images[0]}
                    alt={`Image of ${row.original.name}`}
                    loading="lazy"
                    className={cn(
                        "static aspect-video w-32 min-w-18 rounded-md object-cover outline-offset-2 outline-zinc-600",
                        className,
                    )}
                    classNameLoader={cn(
                        "aspect-video min-w-32 min-w-18 rounded-md",
                        classNameLoader,
                    )}
                    isLoaded={isImageLoaded}
                    onLoad={() => setIsImageLoaded(true)}
                />
            </ImageGalleryDialogTrigger>
        </ImageGalleryDialog>
    );
}

function assertImagesExist(images: unknown): asserts images is string[] {
    if (!Array.isArray(images)) {
        throw new Error("Images must be an array with at least one image");
    }
}
