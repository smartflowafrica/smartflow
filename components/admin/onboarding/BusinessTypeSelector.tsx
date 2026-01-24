import { useEffect, useState } from 'react';

interface BusinessTypeSelectorProps {
    selected: string;
    onSelect: (type: string) => void;
}

export function BusinessTypeSelector({ selected, onSelect }: BusinessTypeSelectorProps) {
    const [sectors, setSectors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSectors() {
            try {
                const res = await fetch('/api/sectors');
                const data = await res.json();
                setSectors(data);
            } catch (error) {
                console.error('Failed to load sectors', error);
            } finally {
                setLoading(false);
            }
        }
        fetchSectors();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading business types...</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select Business Type</h2>
            <p className="text-sm text-slate-500">Choose the industry that best fits the client's business. This will configure their default terminology, workflows, and services.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {sectors.map((sector) => (
                    <div
                        key={sector.id}
                        onClick={() => onSelect(sector.id)} // Selects the ID (UUID)
                        className={`cursor-pointer border rounded-lg p-6 hover:shadow-md transition-all text-center ${selected === sector.id
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-2'
                            : 'border-slate-200 hover:border-blue-300'
                            }`}
                        style={{ borderColor: selected === sector.id ? sector.color : undefined }}
                    >
                        <div className="text-4xl mb-3">{sector.icon}</div>
                        <h3 className="font-semibold text-slate-900">{sector.name}</h3>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                            Optimized for {sector.config?.terminology?.job || 'Jobs'} and {sector.config?.terminology?.customer || 'Customers'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
