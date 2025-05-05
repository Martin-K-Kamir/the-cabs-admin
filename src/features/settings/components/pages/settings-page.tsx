import { useQuery } from "@tanstack/react-query";
import { Wrapper } from "@/components/ui/wrapper";
import { Loader } from "@/components/ui/loader";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ErrorMessage } from "@/components/ui/error-message";
import { UpdateSettingsForm, getSettings } from "@/features/settings";

export function SettingsPage() {
    const { data, error, isPending } = useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    });

    if (isPending) {
        return (
            <Wrapper className="grid min-h-80 place-items-center">
                <Loader />
            </Wrapper>
        );
    }

    if (error) {
        return (
            <Wrapper className="grid min-h-80 place-items-center">
                <ErrorMessage error={error} />
            </Wrapper>
        );
    }

    return (
        <div>
            <Wrapper size="lg">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold" asChild>
                            <h1>Settings</h1>
                        </CardTitle>
                        <CardDescription>
                            Manage bookings and other settings here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4">
                        <UpdateSettingsForm defaultValues={data} />
                    </CardContent>
                </Card>
            </Wrapper>
        </div>
    );
}

export default SettingsPage;
