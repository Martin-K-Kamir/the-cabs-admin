import { Wrapper } from "@/components/ui/wrapper";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CreateUserForm } from "@/features/auth";

export function CreateUserPage() {
    return (
        <div>
            <Wrapper size="lg">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold" asChild>
                            <h1>Create a new user</h1>
                        </CardTitle>
                        <CardDescription>
                            Enter the user's information below to create a new
                            user
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4">
                        <CreateUserForm />
                    </CardContent>
                </Card>
            </Wrapper>
        </div>
    );
}

export default CreateUserPage;
