import { NextResponse } from 'next/server';

// This callback route was for Supabase OAuth code exchange.
// With NextAuth, the callback is handled by /api/auth/[...nextauth]/route.ts automatically.
// This file can remain as a simple redirect or be used for legacy compatibility.

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const next = searchParams.get('next') ?? '/';

    // For NextAuth, authentication callbacks are handled automatically.
    // This route can redirect to the intended destination after OAuth flows.
    return NextResponse.redirect(`${origin}${next}`);
}
