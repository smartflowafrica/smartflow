'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, ChevronRight, LayoutDashboard, Settings } from 'lucide-react';
import { ClientBusinessInfoForm } from './ClientBusinessInfoForm';
import { BusinessConfigForm } from './BusinessConfigForm';
import { WhatsAppSetup } from './WhatsAppSetup';
import { ClientServicesSetup } from './ClientServicesSetup';

interface ClientOnboardingWizardProps {
    clientId: string;
    onComplete: () => void;
}

export default function ClientOnboardingWizard({ clientId, onComplete }: ClientOnboardingWizardProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Persist progress to localStorage (Optional optimization, skipping for simplicity unless requested)
    const [formData, setFormData] = useState<any>({
        info: null,
        services: [],
        config: null,
        whatsapp: null
    });

    const steps = [
        { id: 1, title: 'Business Info', description: 'Basic details' },
        { id: 2, title: 'Services', description: 'Your catalog' },
        { id: 3, title: 'Configuration', description: 'Hours & Location' },
        { id: 4, title: 'WhatsApp', description: 'AI Assistant' }
    ];

    const handleNext = (stepData: any) => {
        const newData = { ...formData };
        if (currentStep === 1) newData.info = stepData;
        if (currentStep === 2) newData.services = stepData;
        if (currentStep === 3) newData.config = stepData;
        if (currentStep === 4) newData.whatsapp = stepData;

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
            // Save everything to backend
            // 1. Update Profile (Business Info)
            // 2. Create Services (Batch)
            // 3. Update Client (Config, WhatsApp) -- We might need new specific endpoints or a bulk update.
            // Using existing actions or API routes.
            // Simplified: Assume POST /api/client/setup handles all.
            // Or chain requests.
            // For now, I'll simulate or call updateClientProfile.

            const payload = {
                clientId,
                ...data
            };

            const res = await fetch('/api/client/setup', { // We need to create this route handle
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Setup failed');

            toast.success('Setup complete! Welcome to SmartFlow.');
            onComplete();
        } catch (error) {
            console.error(error);
            toast.error('Failed to complete setup. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const triggerNext = () => {
        // Validation: Try to find 'step-form' first (for Business Info Step 1)
        const form = document.getElementById('step-form') as HTMLFormElement;
        if (form) {
            form.requestSubmit();
            return;
        }

        // Fallback: Try to find 'step-submit-trigger' (for custom steps 2, 3, 4)
        const trigger = document.getElementById('step-submit-trigger');
        if (trigger) {
            trigger.click();
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Sidebar / Progress */}
            <div className="w-80 bg-white border-r border-slate-200 hidden md:block p-8">
                <div className="mb-10">
                    <div className="flex items-center gap-2 font-bold text-xl text-slate-900 mb-2">
                        <LayoutDashboard className="text-blue-600" />
                        SmartFlow
                    </div>
                    <p className="text-sm text-slate-500">Complete your account setup</p>
                </div>

                <div className="space-y-6">
                    {steps.map((step) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <div key={step.id} className="relative pl-8">
                                {/* Line */}
                                {step.id !== steps.length && (
                                    <div className={`absolute left-[11px] top-8 bottom-[-24px] w-0.5 ${isCompleted ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                )}

                                {/* Dot */}
                                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'border-blue-600 bg-white' :
                                    isCompleted ? 'border-blue-600 bg-blue-600' :
                                        'border-slate-300 bg-white'
                                    }`}>
                                    {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    {isActive && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                </div>

                                <h3 className={`font-semibold text-sm ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                                    {step.title}
                                </h3>
                                <p className="text-xs text-slate-400">{step.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 md:p-12 max-w-3xl mx-auto w-full">
                    <div className="mb-8">
                        <span className="text-sm font-medium text-blue-600 mb-2 block">Step {currentStep} of {steps.length}</span>
                        <h1 className="text-3xl font-bold text-slate-900">{steps[currentStep - 1].title}</h1>
                        <p className="text-slate-500 mt-2 text-lg">{steps[currentStep - 1].description}</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
                        {currentStep === 1 && (
                            // Assuming BusinessInfoForm is compatible or I should wrap/replace.
                            // To be safe, I'm using a placeholder wrapper or I should check the file.
                            <ClientBusinessInfoForm
                                onSubmit={handleNext}
                                defaultValues={formData.info || {
                                    // Pre-fill with client context if available, or empty
                                    // Ideally we should pass client props to the wizard
                                    // For now, let's allow it to be empty or manual entry
                                }}
                            />
                        )}
                        {currentStep === 2 && (
                            <ClientServicesSetup
                                onSubmit={handleNext}
                                defaultServices={formData.services}
                            />
                        )}
                        {currentStep === 3 && (
                            <BusinessConfigForm
                                onSubmit={handleNext}
                                defaultValues={formData.config}
                            />
                        )}
                        {currentStep === 4 && (
                            <WhatsAppSetup
                                onSubmit={handleNext}
                                defaultValues={formData.whatsapp}
                            />
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-white border-t border-slate-200 p-6 px-12 z-10">
                    <div className="max-w-3xl mx-auto w-full flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1 || isSubmitting}
                            className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${currentStep === 1
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            Back
                        </button>

                        <button
                            onClick={triggerNext} // Use trigger for all steps
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                        >
                            {isSubmitting ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    {currentStep === steps.length ? 'Complete Setup' : 'Continue'}
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
