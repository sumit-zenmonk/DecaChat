import { NextRequest, NextResponse } from "next/server";
const publicRoutes = ['/public', '/login', '/'];
const publicDynamicRoutes = ['/room'];
const authBlockRoutes = ['/login'];

export default async function proxy(req: NextRequest) {
    const credentials = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    const isDynamicPublic = publicDynamicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`) || pathname.endsWith('.svg'));
    const isAuthBlock = authBlockRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    const isAuthenticated = Boolean(credentials);

    if (isDynamicPublic) {
        const segments = pathname.split('/');
        const room_uuid = segments[2];
        const nextsegment = segments[3];

        if (!room_uuid) {
            if (credentials) {
                return NextResponse.next();
            } else {
                return NextResponse.redirect(new URL('/', req.url));
            }
        }
        if (nextsegment === 'chat' || nextsegment === 'join') {
            return NextResponse.next();
        }
        if (!credentials) {
            return NextResponse.redirect(new URL(`/room/${room_uuid}/chat`, req.url));
        }

        const isRoomOwner = await checkRoomOwnership(credentials, room_uuid);
        return isRoomOwner ? NextResponse.next() : NextResponse.redirect(new URL(`/room/${room_uuid}/chat`, req.url));
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

async function checkRoomOwnership(token: string, room_uuid: string): Promise<boolean> {
    const res = await fetch(
        `http://backend:8090/api/v1/room/${room_uuid}`,
        {
            method: "GET",
            headers: {
                Authorization: token,
            },
        }
    );

    const data = await res.json();
    return data.data ? true : false;
}

export const config = {
    matcher: ['/((?!_next|api|.*\\..*).*)'],
};