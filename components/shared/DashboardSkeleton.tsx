export function DashboardSkeleton() {
    return (
        <div className="p-8 space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="h-8 bg-slate-200 rounded w-64"></div>
                <div className="h-10 bg-slate-200 rounded w-32"></div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-lg border border-slate-200">
                        <div className="h-4 bg-slate-200 rounded w-24 mb-4"></div>
                        <div className="h-8 bg-slate-200 rounded w-32"></div>
                    </div>
                ))}
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-lg border border-slate-200">
                        <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((j) => (
                                <div key={j} className="h-20 bg-slate-100 rounded"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
