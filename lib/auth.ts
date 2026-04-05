import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {db} from "@/db/config";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg"
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "user",
                input: false
            }
        }
    },
    socialProviders: {
        google : {
            clientId : process.env.GOOGLE_CLIENT_ID as string,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },
})

export type Session = typeof auth.$Infer.Session
