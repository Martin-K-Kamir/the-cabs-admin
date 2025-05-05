declare const brand: unique symbol;

export type Brand<T, TBrand> = T & { [brand]: TBrand };

export type Url = Brand<`https://${string}`, "Url">;

export type XOR<T, U> =
    | (T & { [K in Exclude<keyof U, keyof T>]?: never })
    | (U & { [K in Exclude<keyof T, keyof U>]?: never });

export type Replace<
    Str extends string,
    From extends string,
    To extends string,
> = Str extends `${infer Start}${From}${infer End}`
    ? `${Start}${To}${End}`
    : Str;

export type GetMutationHandlers<
    TOperation extends string,
    TSuccessData,
    TFormData,
    TErrorData extends Error = Error,
> = {
    [K in TOperation as `on${Capitalize<TOperation>}Success`]?: (
        data: TSuccessData,
    ) => void;
} & {
    [K in TOperation as `on${Capitalize<TOperation>}Error`]?: (
        error: TErrorData,
    ) => void;
} & {
    [K in TOperation as `on${Capitalize<TOperation>}`]?: (
        data: TFormData,
    ) => void;
};

type ExcludeByIndex<
    T extends readonly unknown[],
    I extends keyof T & (number | string),
> = {
    [X in keyof T]: X extends `${I}` | I ? never : T[X];
};

export type ExcludeNotUnique<T extends readonly unknown[]> = {
    [I in keyof T]-?: T[I] extends ExcludeByIndex<T, I>[number] ? never : T[I];
};
