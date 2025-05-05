import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useState,
} from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
    FormProvider,
    FormProviderProps,
    useFormContext,
    useFormState,
} from "react-hook-form";
import { XIcon } from "lucide-react";
import { cn, eventEmitter, isFileArray, type EventEmitter } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/lazy-image";

// const Form = FormProvider;

type EmmiterEvent = "reset"; // fix later

const FormEmmitterContext = createContext<EventEmitter<EmmiterEvent> | null>(
    null,
);

function useFormEmitter() {
    const context = useContext(FormEmmitterContext);

    if (!context) {
        throw new Error("useFormEmitter should be used within <FormEmmitter/>");
    }

    return context;
}

function Form<TFieldValues extends FieldValues>({
    emitter,
    children,
    ...props
}: FormProviderProps<TFieldValues> & {
    emitter?: EventEmitter<EmmiterEvent>;
}) {
    return (
        <FormEmmitterContext.Provider value={emitter ?? eventEmitter()}>
            <FormProvider {...props}>{children}</FormProvider>
        </FormEmmitterContext.Provider>
    );
}

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
    {} as FormFieldContextValue,
);

type FormFilesContextValue = {
    files: File[];
    addFiles: (files: File | File[]) => void;
    setFiles: (files: File[]) => void;
    removeFile: (file: File) => void;
    clearFiles: () => void;
};

const FormFilesContext = createContext<FormFilesContextValue | null>(null);

function FormFilesProvider({ children }: React.PropsWithChildren<{}>) {
    const [files, setFiles] = useState<File[]>([]);

    const addFiles = useCallback((files: File | File[]) => {
        setFiles(prevFiles => {
            const newFiles = Array.isArray(files) ? files : [files];
            return [...prevFiles, ...newFiles].filter(
                (file, index, self) =>
                    index === self.findIndex(f => f.name === file.name),
            );
        });
    }, []);

    const removeFile = useCallback((file: File) => {
        setFiles(prevFiles => prevFiles.filter(f => f.name !== file.name));
    }, []);

    const clearFiles = useCallback(() => {
        setFiles([]);
    }, []);

    return (
        <FormFilesContext.Provider
            value={{ files, addFiles, removeFile, clearFiles, setFiles }}
        >
            {children}
        </FormFilesContext.Provider>
    );
}

const useFormFiles = () => {
    const context = useContext(FormFilesContext);

    if (!context) {
        throw new Error(
            "useFormFiles should be used within <FormFilesProvider/>",
        );
    }

    return context;
};

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <FormFilesProvider>
                <Controller {...props} />
            </FormFilesProvider>
        </FormFieldContext.Provider>
    );
};

const useFormField = () => {
    const fieldContext = useContext(FormFieldContext);
    const itemContext = useContext(FormItemContext);
    const { getFieldState } = useFormContext();
    const formState = useFormState({ name: fieldContext.name });
    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField/>");
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        defaultValue: formState.defaultValues?.[fieldContext.name] as unknown,
        ...fieldState,
    };
};

type FormItemContextValue = {
    id: string;
};

const FormItemContext = createContext<FormItemContextValue>(
    {} as FormItemContextValue,
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
    const id = useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div
                data-slot="form-item"
                className={cn("group/item grid gap-2", className)}
                {...props}
            />
        </FormItemContext.Provider>
    );
}

function FormLabel({
    className,
    ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
    const { error, formItemId } = useFormField();

    return (
        <Label
            data-slot="form-label"
            data-error={!!error}
            className={cn("w-fit", className)}
            htmlFor={formItemId}
            {...props}
        />
    );
}

function FormDropBox({
    className,
    single,
    children,
    onDragLeave,
    onDragOver,
    onDrop,
    ...props
}: Omit<React.ComponentProps<typeof LabelPrimitive.Root>, "children"> & {
    children: React.ReactNode | ((files: File[]) => React.ReactNode);
    single?: boolean;
}) {
    const { files, clearFiles, addFiles, setFiles } = useFormFiles();
    const [isDragOver, setIsDragOver] = useState(false);
    const { error, formItemId } = useFormField();

    useEffect(() => {
        return () => {
            clearFiles();
        };
    }, [clearFiles]);

    function handleDragLeave(event: React.DragEvent<HTMLLabelElement>) {
        setIsDragOver(false);
        onDragLeave?.(event);
    }

    function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(true);
        onDragOver?.(event);
    }

    function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver?.(false);
        onDrop?.(event);

        if (single) {
            setFiles(Array.from(event.dataTransfer.files).slice(0, 1));
        } else {
            addFiles(Array.from(event.dataTransfer.files));
        }
    }

    return (
        <Label
            data-slot="form-label"
            data-error={!!error}
            className={cn(
                "cursor-pointer rounded-md border border-dashed border-zinc-400 p-4 text-sm text-zinc-800 ring-zinc-800/70 transition-all group-has-[input:focus]/item:border-zinc-700 group-has-[input:focus]/item:bg-zinc-100 group-has-[input:focus-visible]/item:ring-2 hover:bg-zinc-100 data-[drag-over='true']:border-zinc-700 data-[drag-over='true']:bg-zinc-100 data-[error='true']:!border-rose-600 data-[error='true']:ring-rose-500/50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-300/30 dark:group-has-[input:focus]/item:border-zinc-400 dark:group-has-[input:focus]/item:bg-zinc-800 dark:hover:bg-zinc-800 dark:data-[drag-over='true']:border-zinc-400 dark:data-[drag-over='true']:bg-zinc-800 dark:data-[error='true']:!border-rose-600 dark:data-[error='true']:ring-rose-800",
                className,
            )}
            htmlFor={formItemId}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-drag-over={isDragOver}
            {...props}
        >
            {typeof children === "function" ? children(files) : children}
        </Label>
    );
}

function FormDropInput({
    value,
    className,
    multiple,
    onChange,
    ...props
}: Omit<React.ComponentProps<"input">, "onChange" | "value"> & {
    value?: File[];
    onChange?: (files: File[]) => void;
}) {
    const { files, clearFiles, addFiles, setFiles } = useFormFiles();
    const { on, off } = useFormEmitter();
    const { name, defaultValue } = useFormField();
    const { watch } = useFormContext();
    const watchedValues = watch(name) as File[] | undefined;
    const [inputKey, setInputKey] = useState(0);

    useEffect(() => {
        if (watchedValues && watchedValues.length > 0) {
            setFiles(watchedValues);
        }
    }, []);

    useEffect(() => {
        if (watchedValues?.length === 0) {
            clearFiles();
        }
    }, [watchedValues, clearFiles]);

    useEffect(() => {
        if (files.length > 0) {
            onChange?.(files);
        }
    }, [files]);

    useEffect(() => {
        const handleReset = () => {
            if (!isFileArray(defaultValue)) {
                return;
            }

            setFiles(defaultValue);
        };

        on("reset", handleReset);

        return () => {
            off("reset", handleReset);
        };
    }, [off, on]);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const targetFiles = Array.from(event.target.files || []);

        if (multiple) {
            const availableFiles =
                targetFiles.length === 0 && files.length > 0
                    ? files
                    : targetFiles;

            addFiles(availableFiles);
            onChange?.(availableFiles);
        } else {
            setFiles(targetFiles);
            onChange?.(targetFiles);
        }

        setInputKey(prevKey => prevKey + 1);
    }

    return (
        <input
            key={inputKey}
            type="file"
            data-slot="input"
            className={cn("sr-only", className)}
            multiple={multiple}
            {...props}
            onChange={handleChange}
        />
    );
}

function FormImageUploadPreview({
    className,
    classNameImage,
}: React.ComponentProps<"div"> & {
    classNameImage?: string;
}) {
    const { files, removeFile, setFiles } = useFormFiles();
    const { name } = useFormField();
    const { setValue } = useFormContext();
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [imagesOrder, setImagesOrder] = useState(files);
    const isDraggable = files.length > 1;

    useEffect(() => {
        setImagesOrder(files);
    }, [files]);

    function handleDragStart(
        event: React.DragEvent<HTMLDivElement>,
        index: number,
        image: File,
    ) {
        if (!isDraggable) return;

        setDraggedIndex(index);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.items.add(image);
    }

    function handleDragOver(
        event: React.DragEvent<HTMLDivElement>,
        index: number,
    ) {
        if (!isDraggable) return;
        event.preventDefault();

        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...imagesOrder];
        const [draggedItem] = newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedItem);

        setImagesOrder(newImages);
        setDraggedIndex(index);
    }

    function handleDrop() {
        if (!isDraggable) return;
        setDraggedIndex(null);
        setFiles(imagesOrder);
        setValue(name, imagesOrder);
    }

    function handleDragEnd() {
        if (!isDraggable) return;
        setDraggedIndex(null);
    }

    function handleRemoveFile(file: File) {
        removeFile(file);

        setValue(
            name,
            imagesOrder.filter(image => image.name !== file.name),
        );
    }

    return (
        <div className={cn(!className && "grid grid-cols-4 gap-2", className)}>
            {imagesOrder.map((image, index) => (
                <FormImagePreviewItem
                    key={image.name}
                    index={index}
                    draggedIndex={draggedIndex}
                    image={image}
                    className={classNameImage}
                    onDragStart={event => handleDragStart(event, index, image)}
                    onDragOver={event => handleDragOver(event, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                    onRemoveFile={handleRemoveFile}
                    isDraggable={isDraggable}
                />
            ))}
        </div>
    );
}

type FormImagePreviewItemProps = {
    index: number;
    draggedIndex: number | null;
    image: File;
    className?: string;
    isDraggable?: boolean;
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd: () => void;
    onDrop: () => void;
    onRemoveFile: (file: File) => void;
};

function FormImagePreviewItem({
    image,
    index,
    draggedIndex,
    isDraggable,
    className,
    onDragEnd,
    onDragOver,
    onDrop,
    onDragStart,
    onRemoveFile,
}: FormImagePreviewItemProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    if (image.name === "") {
        return null;
    }

    return (
        <div
            className={cn(
                "group relative rounded-md border border-dashed border-transparent transition-all duration-200",
                draggedIndex === index &&
                    "border-zinc-400 bg-zinc-100 dark:border-zinc-400 dark:bg-zinc-800",
            )}
            draggable={isDraggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
        >
            <LazyImage
                src={
                    image.name.startsWith("https://")
                        ? image.name
                        : URL.createObjectURL(image)
                }
                alt={`Preview of ${image.name}`}
                className={cn(
                    "h-full w-full rounded-md object-cover transition-[opacity,filter]",
                    draggedIndex === index && "opacity-0",
                    isDraggable &&
                        draggedIndex === null &&
                        "hover:brightness-80",
                    isDraggable && "cursor-move",
                    className,
                )}
                classNameLoader={className}
                isLoaded={isImageLoaded}
                onLoad={() => setIsImageLoaded(true)}
            />

            {isImageLoaded && (
                <Button
                    variant="outline"
                    type="button"
                    size="icon"
                    className={cn(
                        "absolute top-1.5 right-1.5 size-6 rounded-full hover:bg-zinc-200 lg:hidden lg:group-hover:flex",
                        draggedIndex !== null && "opacity-0",
                    )}
                    onClick={() => onRemoveFile(image)}
                >
                    <XIcon className="size-3.5" />
                </Button>
            )}
        </div>
    );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
    const { error, formItemId, formDescriptionId, formMessageId } =
        useFormField();

    return (
        <Slot
            data-slot="form-control"
            id={formItemId}
            aria-describedby={
                !error
                    ? `${formDescriptionId}`
                    : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...props}
        />
    );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
    const { formDescriptionId } = useFormField();

    return (
        <p
            data-slot="form-description"
            id={formDescriptionId}
            className={cn(
                "text-sm text-zinc-500 dark:text-zinc-400",
                className,
            )}
            {...props}
        />
    );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
    const { error, formMessageId } = useFormField();

    const body = Array.isArray(error)
        ? error
              .filter(Boolean)
              .map(e => e.message)
              .join("\n")
        : error
          ? String(error?.message)
          : props.children;

    if (!body) {
        return null;
    }

    return (
        <p
            data-slot="form-message"
            id={formMessageId}
            className={cn(
                "text-sm whitespace-pre-wrap text-rose-600 dark:text-rose-500",
                className,
            )}
            {...props}
        >
            {body}
        </p>
    );
}

export {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
    FormDropBox,
    FormDropInput,
    FormImageUploadPreview,
};
