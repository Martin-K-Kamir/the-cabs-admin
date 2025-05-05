import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LoginUserForm } from "../forms/login-user-form";
import { Wrapper } from "@/components/ui/wrapper";
import { View } from "@/components/ui/view";

export function LoginUserPage() {
    return (
        <View>
            <Wrapper size="md">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold" asChild>
                            <h1>Login</h1>
                        </CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-2">
                        <LoginUserForm />
                    </CardContent>
                </Card>
            </Wrapper>
        </View>
    );
}

export default LoginUserPage;
