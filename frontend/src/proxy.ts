import { NextRequest, NextResponse } from "next/server";
const publicRoutes = ['/public', '/login', '/'];
const publicDynamicRoutes = ['/room'];
const authBlockRoutes = ['/login'];

export default function proxy(req: NextRequest) {
    const credentials = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;
    const pathname = req.nextUrl.pathname;


    const isDynamicPublic = publicDynamicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`) || pathname.endsWith('.svg'));
    const isAuthBlock = authBlockRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    const isAuthenticated = Boolean(credentials);

    if (isDynamicPublic) {
        const uuid = pathname.split('/')[2];
        if (!uuid) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        return NextResponse.next();
    }
    if (isAuthenticated && isAuthBlock) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    if (isPublic) {
        return NextResponse.next();
    }
    if (!isAuthenticated && !isPublic) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api|.*\\..*).*)'],
};