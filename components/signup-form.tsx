"use client"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {authClient} from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import {useForm} from "@tanstack/react-form";
import {signupSchema} from "@/lib/schemas/auth.schema";
import {toast} from "sonner";
import {Loader} from "lucide-react";
import {useTransition} from "react";
import {useRouter} from "next/navigation";

export function SignupForm() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter()

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        validators: {
            onSubmit: signupSchema
        },
        onSubmit: async ({value}) => {
            startTransition(async () => {
                await authClient.signUp.email({
                    email: value.email,
                    password: value.password,
                    name: value.name
                }, {
                    onSuccess: () => {
                        toast.success("Account created successfully!");
                        router.push("/")
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message);
                    },
                });
            })
        }
    });

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
        });
    };

    return (
        <div className={"flex flex-col gap-6"}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="p-6 md:p-8"
                    >
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome to KhatiBazar</h1>
                                <p className="text-muted-foreground text-balance">
                                    Create your KhaatiBazar account
                                </p>
                            </div>
                            <form.Field name="name">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="text"
                                                placeholder="John Doe"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                autoComplete="name"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors}/>
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>

                            {/* Email Field */}
                            <form.Field name="email">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="email"
                                                placeholder="m@example.com"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                autoComplete="email"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors}/>
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>

                            {/* Password Field */}
                            <form.Field name="password">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type="password"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                autoComplete="new-password"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors}/>
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>

                            <Field>
                                <Button type="submit" disabled={isPending} className="w-full">
                                    {isPending && <Loader className="mr-2 h-4 w-4 animate-spin"/>}
                                    Sign Up
                                </Button>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>

                            <Field className="w-full">
                                <Button variant="outline" type="button" onClick={handleGoogleLogin}>
                                    <Image src={"/logos/google.svg"}
                                           alt="Google Logo"
                                           className="h-5 w-5"
                                           width={20}
                                           height={20}
                                    />
                                    <span className="sr-only">Login with Google</span>
                                </Button>
                            </Field>

                            <FieldDescription className="text-center">
                                Already have an account? <Link href="/login"
                                                               className="underline hover:underline-offset-2">Login</Link>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <Image
                            src="/images/login.webp"
                            alt="Image"
                            fill
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
