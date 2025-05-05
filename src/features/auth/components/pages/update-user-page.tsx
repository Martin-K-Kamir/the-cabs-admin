import { Wrapper } from "@/components/ui/wrapper";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    UpdateUserForm,
    UpdateUserPasswordForm,
    useGetUser,
} from "@/features/auth";
import { Separator } from "@/components/ui/separator";

export function UpdateUserPage() {
    const { user } = useGetUser();

    if (!user) {
        return null;
    }

    return (
        <div>
            <Wrapper size="lg">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold" asChild>
                            <h1>Update your information</h1>
                        </CardTitle>
                        <CardDescription className="sr-only">
                            Enter your information below to update your user
                            information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UpdateUserForm userData={user} />
                        <Separator className="mt-8 mb-6 bg-zinc-100 dark:bg-zinc-800" />
                        <div>
                            <h2 className="mb-6 text-2xl font-semibold">
                                Update your password
                            </h2>
                            <UpdateUserPasswordForm />
                        </div>
                    </CardContent>
                </Card>
            </Wrapper>
        </div>
    );
}

export default UpdateUserPage;
