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
                console.log('[NextAuth] Authorize called with email:', credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    console.log('[NextAuth] Missing credentials');
                    throw new Error('Email and password are required');
                }

                try {
                    console.log('[NextAuth] Looking up user in database...');
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                        include: { client: true }
                    });

                    console.log('[NextAuth] Database query complete');
                    console.log('[NextAuth] User found:', user ? { id: user.id, email: user.email, role: user.role, hasPassword: !!user.password, passwordLength: user.password?.length } : 'NOT FOUND');

                    if (!user) {
                        console.log('[NextAuth] No user found with email:', credentials.email);
                        throw new Error('Invalid credentials');
                    }

                    if (!user.password) {
                        console.log('[NextAuth] User has no password set');
                        throw new Error('Invalid credentials');
                    }

                    console.log('[NextAuth] Comparing passwords...');
                    console.log('[NextAuth] Input password length:', credentials.password.length);
                    console.log('[NextAuth] Stored hash starts with:', user.password.substring(0, 10));

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    console.log('[NextAuth] Password valid:', isPasswordValid);

                    if (!isPasswordValid) {
                        console.log('[NextAuth] Password comparison failed');
                        throw new Error('Invalid credentials');
                    }

                    console.log('[NextAuth] Login successful for:', user.email);
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
                    throw error;
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
