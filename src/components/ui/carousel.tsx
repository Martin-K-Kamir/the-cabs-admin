import * as React from "react";
import { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import useEmblaCarousel, {
    type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { LazyImage } from "./lazy-image";

const numberWithinRange = (number: number, min: number, max: number): number =>
    Math.min(Math.max(number, min), max);

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    api: ReturnType<typeof useEmblaCarousel>[1];
    canScrollPrev: boolean;
    canScrollNext: boolean;
    slidesInView: number[];
    selectedIndex: number;
    scrollSnaps: number[];
    handleDotClick: (index: number) => void;
    handleScrollNext: () => void;
    handleScrollPrev: () => void;
} & CarouselProps;

const CarouselContext = createContext<CarouselContextProps | null>(null);

function useCarousel() {
    const context = useContext(CarouselContext);

    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }

    return context;
}

const TWEEN_FACTOR_BASE = 0.5;

function Carousel({
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    ...props
}: React.ComponentProps<"div"> & CarouselProps) {
    const tweenFactor = useRef(0);
    const [carouselRef, api] = useEmblaCarousel(
        {
            ...opts,
            axis: orientation === "horizontal" ? "x" : "y",
        },
        plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [slidesInView, setSlidesInView] = useState<number[]>([]);

    const handleDotClick = useCallback(
        (index: number) => {
            if (!api) return;
            api.scrollTo(index);
        },
        [api],
    );

    const onInit = useCallback((api: EmblaCarouselType) => {
        setScrollSnaps(api.scrollSnapList());
    }, []);

    const onSelect = useCallback((api: CarouselApi) => {
        if (!api) return;
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
        setSelectedIndex(api.selectedScrollSnap());
    }, []);

    const handleScrollPrev = useCallback(() => {
        api?.scrollPrev();
    }, [api]);

    const handleScrollNext = useCallback(() => {
        api?.scrollNext();
    }, [api]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                handleScrollPrev();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                handleScrollNext();
            }
        },
        [handleScrollPrev, handleScrollNext],
    );

    const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
        tweenFactor.current =
            TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
    }, []);

    const tweenOpacity = useCallback(
        (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
            const engine = emblaApi.internalEngine();
            const scrollProgress = emblaApi.scrollProgress();
            const slidesInView = emblaApi.slidesInView();
            const isScrollEvent = eventName === "scroll";

            emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
                let diffToTarget = scrollSnap - scrollProgress;
                const slidesInSnap = engine.slideRegistry[snapIndex];

                slidesInSnap.forEach(slideIndex => {
                    if (isScrollEvent && !slidesInView.includes(slideIndex))
                        return;

                    if (engine.options.loop) {
                        engine.slideLooper.loopPoints.forEach(loopItem => {
                            const target = loopItem.target();

                            if (slideIndex === loopItem.index && target !== 0) {
                                const sign = Math.sign(target);

                                if (sign === -1) {
                                    diffToTarget =
                                        scrollSnap - (1 + scrollProgress);
                                }
                                if (sign === 1) {
                                    diffToTarget =
                                        scrollSnap + (1 - scrollProgress);
                                }
                            }
                        });
                    }

                    const tweenValue =
                        1 - Math.abs(diffToTarget * tweenFactor.current);
                    const opacity = numberWithinRange(
                        tweenValue,
                        0,
                        1,
                    ).toString();
                    emblaApi.slideNodes()[slideIndex].style.filter =
                        `brightness(${opacity})`;
                });
            });
        },
        [],
    );

    const updateSlidesInView = useCallback((emblaApi: EmblaCarouselType) => {
        setSlidesInView(slidesInView => {
            if (slidesInView.length === emblaApi.slideNodes().length) {
                emblaApi.off("slidesInView", updateSlidesInView);
            }
            const inView = emblaApi
                .slidesInView()
                .filter(index => !slidesInView.includes(index));
            return slidesInView.concat(inView);
        });
    }, []);

    useEffect(() => {
        if (!api || !setApi) return;
        setApi(api);
    }, [api, setApi]);

    useEffect(() => {
        if (!api) return;
        onInit(api);
        onSelect(api);
        api.on("reInit", onSelect);
        api.on("select", onSelect);

        api.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
        return () => {
            api?.off("select", onSelect);
            api?.off("reInit", onInit);
        };
    }, [api, onSelect, onInit]);

    useEffect(() => {
        if (!api) return;

        setTweenFactor(api);
        tweenOpacity(api);
        api.on("reInit", setTweenFactor)
            .on("reInit", tweenOpacity)
            .on("scroll", tweenOpacity)
            .on("slideFocus", tweenOpacity);

        return () => {
            api.off("reInit", setTweenFactor);
            api.off("reInit", tweenOpacity);
            api.off("scroll", tweenOpacity);
            api.off("slideFocus", tweenOpacity);
        };
    }, [api, tweenOpacity]);

    useEffect(() => {
        if (!api) return;

        updateSlidesInView(api);
        api.on("slidesInView", updateSlidesInView);
        api.on("reInit", updateSlidesInView);

        return () => {
            api.off("slidesInView", updateSlidesInView);
            api.off("reInit", updateSlidesInView);
        };
    }, [api, updateSlidesInView]);

    return (
        <CarouselContext.Provider
            value={{
                carouselRef,
                api,
                opts,
                orientation:
                    orientation ||
                    (opts?.axis === "y" ? "vertical" : "horizontal"),
                canScrollPrev,
                canScrollNext,
                slidesInView,
                selectedIndex,
                scrollSnaps,
                handleScrollPrev,
                handleScrollNext,
                handleDotClick,
            }}
        >
            <div
                onKeyDownCapture={handleKeyDown}
                className={cn("relative grid items-center", className)}
                role="region"
                aria-roledescription="carousel"
                data-slot="carousel"
                {...props}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
    const { carouselRef, orientation } = useCarousel();

    return (
        <div
            ref={carouselRef}
            className="overflow-hidden px-4 sm:px-6 2xl:px-0"
            data-slot="carousel-content"
        >
            <div
                className={cn(
                    "flex",
                    orientation === "vertical" && "flex-col",
                    className,
                )}
                {...props}
            />
        </div>
    );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
    const { orientation } = useCarousel();

    return (
        <div
            role="group"
            aria-roledescription="slide"
            data-slot="carousel-item"
            className={cn(
                "min-w-0 shrink-0 grow-0 basis-full only:!basis-full",
                orientation === "horizontal"
                    ? "not-first:pl-2 sm:not-first:pl-6"
                    : "not-first:pt-2 sm:not-first:pt-6",
                className,
            )}
            {...props}
        />
    );
}

const PLACEHOLDER_SRC = `data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D`;

function CarouselLazyImage({
    className,
    index,
    src,
    ...props
}: React.ComponentProps<typeof LazyImage> & {
    index: number;
}) {
    const [isLoaded, setIsLoaded] = useState(false);

    const { slidesInView } = useCarousel();
    const inView = slidesInView.indexOf(index) > -1;

    const handleLoad = useCallback(() => {
        if (inView) setIsLoaded(true);
    }, [inView, setIsLoaded]);

    return (
        <LazyImage
            alt={`Image ${index + 1}`}
            isLoaded={isLoaded}
            onLoad={handleLoad}
            src={inView ? src : PLACEHOLDER_SRC}
            classNameLoader="[&_svg]:size-10"
            classNameWrapper="size-full"
            {...props}
        />
    );
}

const carouselButtonVariants = cva(
    "!pointer-events-auto size-8 rounded-full disabled:cursor-auto",
    {
        variants: {
            position: {
                static: "static",
                absolute: "absolute",
            },
        },
    },
);

export type CarouselButtonProps = React.ComponentProps<typeof Button> &
    VariantProps<typeof carouselButtonVariants> & {
        isHiddenForSingleSlide?: boolean;
    };

function CarouselPrevious({
    className,
    position,
    variant = "outline",
    size = "icon",
    isHiddenForSingleSlide = true,
    ...props
}: CarouselButtonProps) {
    const { handleScrollPrev, canScrollPrev, slidesInView } = useCarousel();

    if (isHiddenForSingleSlide && slidesInView.length < 2) {
        return null;
    }

    return (
        <Button
            data-slot="carousel-previous"
            variant={variant}
            size={size}
            className={cn(
                carouselButtonVariants({ position }),
                position === "absolute" &&
                    "-left-6 -translate-x-full justify-self-start",
                className,
            )}
            disabled={!canScrollPrev}
            onClick={handleScrollPrev}
            {...props}
        >
            <ArrowLeft />
            <span className="sr-only">Previous slide</span>
        </Button>
    );
}

function CarouselNext({
    className,
    position,
    variant = "outline",
    size = "icon",
    isHiddenForSingleSlide = true,
    ...props
}: CarouselButtonProps) {
    const { handleScrollNext, canScrollNext, slidesInView } = useCarousel();

    if (isHiddenForSingleSlide && slidesInView.length < 2) {
        return null;
    }

    return (
        <Button
            data-slot="carousel-next"
            variant={variant}
            size={size}
            className={cn(
                carouselButtonVariants({ position }),
                position === "absolute" &&
                    "-right-6 translate-x-full justify-self-end",

                className,
            )}
            disabled={!canScrollNext}
            onClick={handleScrollNext}
            {...props}
        >
            <ArrowRight />
            <span className="sr-only">Next slide</span>
        </Button>
    );
}

function CarouselDots({
    className,
    isHiddenForSingleSlide = true,
    ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
    isHiddenForSingleSlide?: boolean;
}) {
    const { scrollSnaps } = useCarousel();

    if (isHiddenForSingleSlide && scrollSnaps.length < 2) {
        return null;
    }

    return (
        <div {...props} className={cn("flex justify-center", className)}>
            {scrollSnaps.map((_, index) => (
                <CarouselDot key={index} index={index} />
            ))}
        </div>
    );
}

function CarouselDot({
    children,
    index,
    className,
    variant = "ghost",
    size = "icon",
    ...props
}: React.ComponentProps<typeof Button> & { index: number }) {
    const { handleDotClick, selectedIndex } = useCarousel();

    return (
        <Button
            onClick={() => handleDotClick(index)}
            variant={variant}
            size={size}
            className={cn(
                "size-5.5 hover:bg-transparent dark:hover:bg-transparent [&_svg:not([class*='size-'])]:size-2/3 [&_svg:not([class*='stroke-'])]:stroke-3 [&_svg:not([class*='text-'])]:text-white",
                selectedIndex !== index && "opacity-50",
                className,
            )}
            {...props}
        >
            {children ?? <CircleIcon />}
            <span className="sr-only">Go to slide {index + 1}</span>
        </Button>
    );
}

export {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselLazyImage,
    CarouselDots,
    CarouselDot,
};
