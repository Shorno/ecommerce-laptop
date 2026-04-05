import {SignupForm} from "@/components/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create a new account to start shopping with KhaatiBazar.",
};

export default function LoginPage() {
    return (
        <div className="bg-muted flex min-h-[calc(100dvh-130px)] flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <SignupForm/>
            </div>
        </div>
    )
}
