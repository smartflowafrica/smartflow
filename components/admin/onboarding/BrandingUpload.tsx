'use client';

import { useState } from 'react';

interface Branding {
    primaryColor: string;
    secondaryColor: string;
    font: string;
    logoUrl?: string;
}

interface BrandingUploadProps {
    defaultValues?: Partial<Branding>;
    onSubmit: (branding: Branding) => void;
}

export function BrandingUpload({ defaultValues, onSubmit }: BrandingUploadProps) {
    const [branding, setBranding] = useState<Branding>({
        primaryColor: defaultValues?.primaryColor || '#3B82F6',
        secondaryColor: defaultValues?.secondaryColor || '#1F2937',
        font: defaultValues?.font || 'Inter',
        logoUrl: defaultValues?.logoUrl || '',
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Branding Configuration</h2>
                <p className="text-sm text-slate-500">Customize the look and feel of the client dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Primary Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={branding.primaryColor}
                                onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                                className="h-10 w-20 rounded border cursor-pointer"
                            />
                            <input
                                value={branding.primaryColor}
                                onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                                className="flex-1 px-3 py-2 border rounded-md uppercase"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Secondary Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={branding.secondaryColor}
                                onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                                className="h-10 w-20 rounded border cursor-pointer"
                            />
                            <input
                                value={branding.secondaryColor}
                                onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                                className="flex-1 px-3 py-2 border rounded-md uppercase"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Font Family</label>
                        <select
                            value={branding.font}
                            onChange={(e) => setBranding({ ...branding, font: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                        >
                            <option value="Inter">Inter (Default)</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Open Sans">Open Sans</option>
                        </select>
                    </div>
                </div>

                <div className="p-4 rounded-lg border bg-white shadow-sm space-y-4">
                    <label className="text-sm font-medium">Live Preview</label>
                    <div className="space-y-2">
                        {/* Mock Dashboard Preview */}
                        <div className="h-40 rounded-lg overflow-hidden border">
                            <div
                                className="h-12 flex items-center px-4 justify-between"
                                style={{ backgroundColor: '#fff', borderBottom: '1px solid #eee' }}
                            >
                                <div className="font-bold flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded"
                                        style={{ backgroundColor: branding.primaryColor }}
                                    />
                                    Client Name
                                </div>
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-2 bg-slate-50 h-full">
                                <div className="bg-white p-2 rounded shadow-sm h-20">
                                    <div className="text-xs text-slate-500">Metric</div>
                                    <div className="text-xl font-bold mt-1">12</div>
                                </div>
                                <div className="bg-white p-2 rounded shadow-sm h-20">
                                    <div className="text-xs text-slate-500">Status</div>
                                    <div
                                        className="text-xs text-white px-2 py-1 rounded inline-block mt-2"
                                        style={{ backgroundColor: branding.primaryColor }}
                                    >
                                        Active
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 text-center">Preview of dashboard elements</p>
                    </div>
                </div>
            </div>

            {/* Hidden submit trigger */}
            <div id="step-submit-trigger" onClick={() => onSubmit(branding)} style={{ display: 'none' }} />
        </div>
    );
}
