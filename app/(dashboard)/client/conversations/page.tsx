'use client';

import TeamInbox from '@/components/client/TeamInbox';

export default function ConversationsPage() {
    return (
        <div className="h-[calc(100vh-100px)]">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Team Inbox</h1>
                <p className="text-slate-500">Manage customer conversations and team collaboration.</p>
            </div>
            <TeamInbox />
        </div>
    );
}
