import { useMemo, useCallback } from 'react';
import { getBusinessTypeConfig } from '@/lib/config/business-types';
import type { BusinessTypeConfig } from '@/lib/config/business-types';

interface Branding {
    primaryColor: string;
    secondaryColor: string;
    font: string;
    logoUrl?: string;
}

export function useBusinessType(businessType?: string) {
    const config = useMemo(() => {
        if (!businessType) return null;
        return getBusinessTypeConfig(businessType);
    }, [businessType]);

    const applyBranding = useCallback((branding?: Branding) => {
        if (!branding) return;

        // Apply CSS variables for dynamic theming
        document.documentElement.style.setProperty('--primary-color', branding.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', branding.secondaryColor);
        document.documentElement.style.setProperty('--font-family', branding.font);
    }, []);

    const getStatusColor = useCallback((status: string) => {
        if (!config) return '#6B7280';
        const stage = config.statusStages.find(s => s.value === status);
        return stage?.color || '#6B7280';
    }, [config]);

    const getStatusLabel = useCallback((status: string) => {
        if (!config) return status;
        const stage = config.statusStages.find(s => s.value === status);
        return stage?.label || status;
    }, [config]);

    const getStatusDescription = useCallback((status: string) => {
        if (!config) return '';
        const stage = config.statusStages.find(s => s.value === status);
        return stage?.description || '';
    }, [config]);

    const getTerminology = useCallback((key: keyof BusinessTypeConfig['terminology']) => {
        if (!config) return key;
        return config.terminology[key];
    }, [config]);

    const getMetricFormat = useCallback((metricId: string) => {
        if (!config) return 'number';
        const metric = config.metrics.find(m => m.id === metricId);
        return metric?.format || 'number';
    }, [config]);

    const formatMetricValue = useCallback((value: number, format: 'number' | 'currency' | 'percentage') => {
        switch (format) {
            case 'currency':
                return `₦${value.toLocaleString('en-NG')}`;
            case 'percentage':
                return `${value}%`;
            default:
                return value.toLocaleString('en-NG');
        }
    }, []);

    return {
        config,
        applyBranding,
        getStatusColor,
        getStatusLabel,
        getStatusDescription,
        getTerminology,
        getMetricFormat,
        formatMetricValue,
    };
}
