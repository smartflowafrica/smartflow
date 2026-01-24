'use client';

import { useState } from 'react';
import { BusinessTypeSelector } from './BusinessTypeSelector';
import { BusinessInfoForm } from './BusinessInfoForm';
import { ServicesSetup } from './ServicesSetup';
import { BrandingUpload } from './BrandingUpload';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function OnboardingWizard() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<any>({
        businessType: '',
        info: null,
        services: [],
        branding: null,
    });

    const steps = [
        { id: 1, title: 'Business Type' },
        { id: 2, title: 'Information' },
        { id: 3, title: 'Services' },
        { id: 4, title: 'Branding' },
    ];

    const handleNext = (stepData: any) => {
        const newData = { ...formData };

        if (currentStep === 1) newData.businessType = stepData;
        if (currentStep === 2) newData.info = stepData;
        if (currentStep === 3) newData.services = stepData;
        if (currentStep === 4) newData.branding = stepData;

        setFormData(newData);

        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
        } else {
            submitWizard(newData);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const submitWizard = async (data: any) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessType: data.businessType,
                    businessInfo: data.info,
                    services: data.services,
                    branding: data.branding,
                }),
            });

            if (!response.ok) throw new Error('Failed to create client');

            toast.success('Client created successfully!');
            router.push('/admin/tenants');
        } catch (error) {
            toast.error('Failed to create client');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to trigger form submission in children
    const triggerNext = () => {
        if (currentStep === 1) return; // Handled by direct click in component

        if (currentStep === 2) {
            const form = document.getElementById('step-form') as HTMLFormElement;
            form?.requestSubmit();
        } else {
            const trigger = document.getElementById('step-submit-trigger');
            trigger?.click();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Progress Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4">Onboard New Client</h1>
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10" />
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center bg-slate-50 px-2">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${currentStep >= step.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-200 text-slate-600'
                                    }`}
                            >
                                {step.id}
                            </div>
                            <span className={`text-xs ${currentStep >= step.id ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                {currentStep === 1 && (
                    <BusinessTypeSelector
                        selected={formData.businessType}
                        onSelect={handleNext}
                    />
                )}
                {currentStep === 2 && (
                    <BusinessInfoForm
                        defaultValues={formData.info}
                        onSubmit={handleNext}
                    />
                )}
                {currentStep === 3 && (
                    <ServicesSetup
                        businessType={formData.businessType}
                        defaultServices={formData.services}
                        onSubmit={handleNext}
                    />
                )}
                {currentStep === 4 && (
                    <BrandingUpload
                        defaultValues={formData.branding}
                        onSubmit={handleNext}
                    />
                )}
            </div>

            {/* Navigation Actions */}
            {currentStep > 1 && (
                <div className="flex justify-between">
                    <button
                        onClick={handleBack}
                        disabled={isSubmitting}
                        className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                        Back
                    </button>
                    <button
                        onClick={triggerNext}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        {currentStep === steps.length ? 'Create Client' : 'Next Step'}
                    </button>
                </div>
            )}
        </div>
    );
}
