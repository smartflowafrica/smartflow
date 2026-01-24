// Users Page - Uses Prisma directly for user listing
import prisma from '@/lib/prisma';
import { Mail, Shield, Building2, Calendar, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            include: {
                client: {
                    select: {
                        businessName: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export default async function UsersPage() {
    const users = await getUsers();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Users</h1>
                <p className="text-slate-500">Manage system users and access roles.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">User</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Associated Client</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Joined Date</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <UserIcon className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p>No users found in the system.</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-medium">
                                                    {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{user.name || 'Unnamed User'}</div>
                                                    <div className="text-slate-500 text-xs flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                <Shield className="w-3 h-3" />
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.client ? (
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <Building2 className="w-4 h-4 text-slate-400" />
                                                    {user.client.businessName}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">No Client</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="text-slate-400 hover:text-blue-600 transition"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
