import { View } from "@/components/ui/view";
import { Wrapper } from "@/components/ui/wrapper";
import { Card, CardContent } from "@/components/ui/card";
import {
    ErrorMessage,
    type ErrorMessageProps,
} from "@/components/ui/error-message";

export function AppError(props: ErrorMessageProps) {
    return (
        <View>
            <Wrapper size="md">
                <Card>
                    <CardContent>
                        <ErrorMessage {...props} />
                    </CardContent>
                </Card>
            </Wrapper>
        </View>
    );
}
