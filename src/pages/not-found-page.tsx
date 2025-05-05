import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { View } from "@/components/ui/view";
import { Wrapper } from "@/components/ui/wrapper";
import { Link } from "react-router";

export function NotFoundPage() {
    return (
        <View>
            <Wrapper size="md">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-semibold" asChild>
                            <h1>404 Not Found</h1>
                        </CardTitle>
                        <CardDescription>
                            The page you are looking for does not exist
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild>
                            <Link to="/">Go to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </Wrapper>
        </View>
    );
}

export default NotFoundPage;
