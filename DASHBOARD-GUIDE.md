# Multi-Tenant Dashboard - Quick Start Guide

## What Was Built

Phase 1 implementation adds **dynamic, business-type aware dashboards** with real-time updates to your SmartFlowAfricaNew platform.

### Key Features ✨

- 🎨 **Dynamic Branding** - Each client gets their own colors, fonts, and logo
- 🔄 **Real-time Updates** - Live job status changes and messages via Supabase
- 🏢 **Business Type Aware** - Different terminology and workflows per business type
- 📊 **Custom Metrics** - Relevant KPIs for each business type
- ⚡ **Quick Actions** - Business-specific shortcuts

## Files Created

### Hooks
- `hooks/useBusinessType.ts` - Dynamic business config
- `hooks/useClient.ts` - Fetch current client data
- `hooks/useRealtime.ts` - Real-time subscriptions

### Components
- `components/client/BusinessTypeAdapter.tsx` - Wrapper with branding
- `components/client/JobCard.tsx` - Business-aware job card
- `components/shared/DashboardSkeleton.tsx` - Loading skeleton

### Pages & API
- `app/(dashboard)/client/page.tsx` - Example dashboard
- `app/api/jobs/[id]/status/route.ts` - Update job status
- `app/api/jobs/[id]/mark-ready/route.ts` - Mark job ready

## How to Use

### 1. Basic Dashboard Setup

```tsx
import { BusinessTypeAdapter } from '@/components/client/BusinessTypeAdapter';

export default function MyDashboard() {
  return (
    <BusinessTypeAdapter>
      {(config, client) => (
        <div>
          <h1>{client.businessName}</h1>
          <p>Business Type: {config.name}</p>
        </div>
      )}
    </BusinessTypeAdapter>
  );
}
```

### 2. Using Business Type Config

```tsx
import { useBusinessType } from '@/hooks/useBusinessType';

function MyComponent({ businessType, status }) {
  const { getStatusColor, getStatusLabel, getTerminology } = useBusinessType(businessType);
  
  return (
    <div>
      <span style={{ color: getStatusColor(status) }}>
        {getStatusLabel(status)}
      </span>
      <p>Customer: {getTerminology('customer')}</p>
    </div>
  );
}
```

### 3. Real-time Job Updates

```tsx
import { useRealtimeJobs } from '@/hooks/useRealtime';

function JobList() {
  const { jobs } = useRealtimeJobs(); // Auto-updates!
  
  return (
    <div>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
```

### 4. Display Job Cards

```tsx
import { JobCard } from '@/components/client/JobCard';

function MyJobs({ jobs, businessType }) {
  const handleStatusUpdate = async (jobId, newStatus) => {
    await fetch(`/api/jobs/${jobId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
  };

  return jobs.map(job => (
    <JobCard
      key={job.id}
      job={job}
      businessType={businessType}
      onStatusUpdate={handleStatusUpdate}
    />
  ));
}
```

## Business Type Examples

### AUTO_MECHANIC
- **Terminology**: Car, Customer, Service
- **Statuses**: Received → Diagnosing → In Progress → Testing → Ready
- **Metrics**: Cars in Shop, Ready for Pickup, Revenue Today

### RESTAURANT
- **Terminology**: Order, Customer, Menu Item
- **Statuses**: Received → Preparing → Ready → Out for Delivery → Delivered
- **Metrics**: Orders Today, Preparing Now, Revenue Today

### SALON
- **Terminology**: Appointment, Client, Service
- **Statuses**: Scheduled → Arrived → In Progress → Completed
- **Metrics**: Appointments Today, In Progress, Revenue Today

## Customization

### Adding Custom Branding

Branding is automatically applied via CSS variables:

```css
/* These are set automatically by BusinessTypeAdapter */
--primary-color: #3B82F6;
--secondary-color: #1F2937;
--font-family: 'Inter';
```

Use in your components:

```tsx
<button style={{ backgroundColor: 'var(--primary-color)' }}>
  Custom Button
</button>
```

### Extending Business Types

Edit `lib/config/business-types.ts`:

```typescript
export const BUSINESS_TYPES = {
  MY_NEW_TYPE: {
    id: 'MY_NEW_TYPE',
    name: 'My Business',
    terminology: {
      job: 'Task',
      customer: 'Client',
      // ... more
    },
    statusStages: [
      { value: 'new', label: 'New', color: '#3B82F6' },
      // ... more
    ],
    // ... rest of config
  }
};
```

## Next Steps

### Phase 2 (Recommended)
1. **Onboarding Wizard** - Add new clients via UI
2. **Conversation Management** - WhatsApp message threading
3. **React Query** - Better data management

### Integration Tasks
1. **WhatsApp Notifications** - Uncomment n8n webhook code in `mark-ready/route.ts`
2. **Database Policies** - Set up RLS policies in Supabase
3. **Authentication** - Ensure proper user → client mapping

## Testing

### 1. Create Test Client

```sql
INSERT INTO "Client" (id, "businessName", "businessType", "ownerName", phone, email, "planTier", "monthlyFee", status)
VALUES ('test-client-1', 'Test Auto Shop', 'AUTO_MECHANIC', 'John Doe', '08012345678', 'test@example.com', 'BASIC', 50000, 'ACTIVE');
```

### 2. Create Test Job

```sql
INSERT INTO "Job" (id, "clientId", "customerPhone", "customerName", description, status, price)
VALUES ('test-job-1', 'test-client-1', '08087654321', 'Jane Smith', 'Toyota Camry brake service', 'received', 25000);
```

### 3. Visit Dashboard

Navigate to `/client` to see the dashboard in action!

## Troubleshooting

### Jobs not updating in real-time?
- Check Supabase Realtime is enabled for the `Job` table
- Verify RLS policies allow subscriptions
- Check browser console for subscription errors

### Branding not applying?
- Ensure client has a `Branding` record in database
- Check `useClient` hook is fetching branding data
- Verify CSS variables are being set in browser DevTools

### Status colors not showing?
- Verify job status matches a value in `config.statusStages`
- Check business type config is loaded correctly
- Ensure `useBusinessType` hook is being called

## Support

For issues or questions:
1. Check the implementation plan: `implementation_plan.md`
2. Review the task checklist: `task.md`
3. Inspect browser console for errors
4. Verify Supabase connection and policies

---

**Built with**: Next.js 14, Supabase, Prisma, TypeScript
