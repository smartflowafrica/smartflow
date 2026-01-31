
import { NextRequest, NextResponse } from 'next/server';

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://127.0.0.1:8081';

/**
 * Proxy Handler for Evolution API
 * Forwards all requests from /api/evolution/* to the local Evolution instance.
 */
async function proxyHandler(req: NextRequest, { params }: { params: { path: string[] } }) {
    const path = params.path.join('/');
    const url = `${EVOLUTION_API_URL}/${path}`;
    const method = req.method;

    console.log(`[Evolution Proxy] ${method} ${url}`);

    try {
        // Prepare headers (copy incoming, remove host/connection to avoid issues)
        const headers = new Headers(req.headers);
        headers.delete('host');
        headers.delete('connection');

        // Ensure API Key is passed if present in original headers
        // (The Manager sends it in 'apikey' header)

        const body = (method !== 'GET' && method !== 'HEAD') ? await req.blob() : undefined;

        const response = await fetch(url, {
            method,
            headers,
            body,
            cache: 'no-store'
        });

        console.log(`[Evolution Proxy] Response: ${response.status}`);

        // Return the response as-is (stream body)
        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });

    } catch (error: any) {
        console.error('[Evolution Proxy] Error:', error);
        return NextResponse.json(
            { error: 'Proxy Error', details: error.message },
            { status: 500 }
        );
    }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const DELETE = proxyHandler;
export const PATCH = proxyHandler;
