import prisma from '@/lib/prisma';

export default async function TestPage() {
    let dbStatus = 'Checking...';
    let clientCount = 0;
    let errorMsg = '';
    // Simple check since we are using the hardcoded client now
    let envVars = {
        url: true, // Assumed valid via hardcode
        key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        db: true, // Assumed valid via hardcode
    };

    try {
        clientCount = await prisma.client.count();
        dbStatus = '✅ Connected';
    } catch (error) {
        dbStatus = '❌ Error';
        errorMsg = (error as Error).message;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto font-sans">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">System Diagnostics</h1>

            <div className="space-y-6">
                {/* Environment */}
                <div className={`p-6 border rounded-xl bg-blue-50 border-blue-200`}>
                    <h2 className="font-bold text-slate-900 mb-4 text-lg">1. Environment Variables</h2>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between items-center bg-white p-2 rounded">
                            <span className="font-mono text-slate-600">SUPABASE_SERVICE_ROLE_KEY</span>
                            <span className={envVars.key ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                {envVars.key ? '✅ Loaded' : '❌ MISSING (Required for Seeder)'}
                            </span>
                        </li>
                        <li className="flex justify-between items-center bg-white p-2 rounded">
                            <span className="font-mono text-slate-600">DATABASE Connection</span>
                            <span className="text-green-600 font-bold">✅ Patched (lib/prisma.ts)</span>
                        </li>
                    </ul>
                </div>

                {/* Database */}
                <div className={`p-6 border rounded-xl ${dbStatus.includes('Connected') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <h2 className="font-bold mb-2 text-lg text-slate-900">2. Database Connection</h2>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{dbStatus}</span>
                    </div>

                    {errorMsg && (
                        <div className="text-xs font-mono text-red-600 bg-red-100 p-3 rounded overflow-auto max-h-32 whitespace-pre-wrap border border-red-200">
                            {errorMsg}
                        </div>
                    )}

                    {dbStatus.includes('Connected') && (
                        <div className="mt-4 p-4 bg-white/60 rounded-lg border border-green-200">
                            <p className="text-green-800 font-medium">Clients found: <span className="font-bold text-2xl ml-2">{clientCount}</span></p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl opacity-100">
                    <h2 className="font-bold text-slate-900 mb-4 text-lg">3. Actions</h2>
                    <div className="flex gap-4">
                        <a
                            href="/api/admin/seed"
                            target="_blank"
                            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 text-white transition-colors bg-slate-900 hover:bg-slate-800`}
                        >
                            <span>🌱</span> Run Seed Script
                        </a>
                        <a
                            href="/dashboard"
                            className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                        >
                            Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
