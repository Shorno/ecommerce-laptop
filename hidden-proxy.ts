import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {auth} from "@/lib/auth";

export async function hiddenProxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // if (session.user.role !== "admin") {
    //     return NextResponse.redirect(new URL("/unauthorized", request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/(admin)/:path*"],
};
