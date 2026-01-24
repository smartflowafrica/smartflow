'use client';

import { useClientContext } from '@/components/providers/ClientProvider';

export function useClient() {
    return useClientContext();
}
