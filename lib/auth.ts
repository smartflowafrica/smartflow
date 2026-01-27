import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // Quick validation using Zod
                    const { loginSchema } = await import('@/lib/validators/auth'); // Dynamic import to avoid circular dep if any
                    const validation = loginSchema.safeParse(credentials);

                    if (!validation.success) {
                        return null; // Or throw specific error if NextAuth allows bubbling
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                        include: { client: true }
                    });

                    if (!user || !user.password) {
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        staffRole: user.staffRole,
                        clientId: user.clientId,
                        name: user.name || user.client?.ownerName || user.email
                    };
                } catch (error) {
                    console.error('[NextAuth] Error in authorize:', error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.staffRole = (user as any).staffRole;
                token.clientId = (user as any).clientId;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).staffRole = token.staffRole;
                (session.user as any).clientId = token.clientId;
            }
            return session;
        }
    },
    debug: process.env.NODE_ENV === 'development'
};
