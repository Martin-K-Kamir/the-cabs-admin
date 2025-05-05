import {
    useForm as useReactHookForm,
    type UseFormReturn,
    type UseFormProps,
    type FieldValues,
} from "react-hook-form";
import { eventEmitter } from "@/lib/utils";

const emitter = eventEmitter<"reset">();

export function useForm<TFormValues extends FieldValues>(
    options?: UseFormProps<TFormValues>,
): UseFormReturn<TFormValues> & { emitter: typeof emitter } {
    const form = useReactHookForm<TFormValues>(options);

    function handleReset(values?: Parameters<typeof form.reset>[0]) {
        emitter.emit("reset", form.formState.defaultValues);
        form.reset(values);
    }
    return {
        ...form,
        emitter,
        reset: handleReset,
    };
}
