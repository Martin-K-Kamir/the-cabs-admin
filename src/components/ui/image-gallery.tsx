import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogScreen,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselDots,
    CarouselItem,
    CarouselLazyImage,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useMediaQuery } from "usehooks-ts";
import { isReactElement } from "@/lib/utils";

export function ImageGallery({
    images,
    ...props
}: { images: string[] } & React.ComponentProps<typeof Carousel>) {
    const is2xl = useMediaQuery("(min-width: 96rem)");

    return (
        <Carousel {...props}>
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem
                        key={index}
                        className="aspect-video basis-[85%]"
                    >
                        <CarouselLazyImage
                            key={index}
                            index={index}
                            src={image}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>

            {is2xl && <CarouselPrevious position="absolute" />}
            {is2xl && <CarouselNext position="absolute" />}
            {is2xl && <CarouselDots className="mt-4" />}

            {!is2xl && (
                <div className="mt-2 flex gap-2 px-4 sm:mt-4 sm:gap-4 sm:px-6">
                    <CarouselPrevious />
                    <CarouselNext />
                    <CarouselDots className="ml-auto" />
                </div>
            )}
        </Carousel>
    );
}

export function ImageGalleryDialog({
    images,
    children,
    ...props
}: {
    images: string[];
    children: React.ReactNode;
} & React.ComponentProps<typeof Dialog>) {
    const isTrigger =
        isReactElement(children) && isImageGalleryTrigger(children);

    return (
        <Dialog {...props}>
            {isTrigger ? children : <DialogTrigger>{children}</DialogTrigger>}
            <DialogScreen className="w-full max-w-7xl">
                <DialogHeader>
                    <DialogTitle className="sr-only">Image Gallery</DialogTitle>
                    <DialogDescription className="sr-only">
                        Browse through the gallery by clicking on the images.
                    </DialogDescription>
                </DialogHeader>
                <ImageGallery images={images} />
            </DialogScreen>
        </Dialog>
    );
}

export function ImageGalleryDialogTrigger(
    props: React.ComponentProps<typeof DialogTrigger>,
) {
    return <DialogTrigger {...props} />;
}

function isImageGalleryTrigger(children: React.ReactElement) {
    return (
        typeof children.type === "function" &&
        children.type.name === ImageGalleryDialogTrigger.name
    );
}
