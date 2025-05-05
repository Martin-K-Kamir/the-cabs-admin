type Country = {
    name: {
        common: string;
        official: string;
        nativeName: {
            [key: string]: {
                common: string;
                official: string;
            };
        };
    };
};

export async function getAllCountryNames(): Promise<Country[]> {
    const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name",
    );
    const data = await response.json();

    return data.sort((a: Country, b: Country) => {
        return a.name.common.localeCompare(b.name.common, undefined, {
            sensitivity: "base",
        });
    });
}
