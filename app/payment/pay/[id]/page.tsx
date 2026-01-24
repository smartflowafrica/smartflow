import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PaymentCard from './PaymentCard';

export default async function PaymentPage({ params }: { params: { id: string } }) {
    const job = await prisma.job.findUnique({
        where: { id: params.id },
        include: {
            client: {
                select: {
                    businessName: true,
                    email: true,
                    phone: true,
                    address: true
                }
            },
            customer: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });

    if (!job) {
        return notFound();
    }

    const amount = job.finalAmount || job.price || 0;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    <div className="relative z-10">
                        <h2 className="text-xl font-medium text-blue-100 mb-1">{job.client.businessName}</h2>
                        <h1 className="text-3xl font-bold text-white mb-2">Payment Request</h1>
                        <div className="text-sm text-slate-400">Reference: #{job.id.slice(0, 8)}</div>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
                </div>

                {/* Content */}
                <PaymentCard
                    jobId={job.id}
                    amount={amount}
                    description={job.description}
                    customerName={job.customerName}
                    customerEmail={job.customer?.email || undefined}
                />

                {/* Footer */}
                <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
                    <p>Secured by Paystack</p>
                    <p>&copy; {new Date().getFullYear()} SmartFlow Africa</p>
                </div>
            </div>
        </div>
    );
}
