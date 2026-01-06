
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'twograzia_secret_key_2026'
);

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        const ADMIN_PASS = process.env.ADMIN_PASSWORD;
        const PARTNER_PASS = process.env.PARTNER_PASSWORD;
        const ACCOUNTANT_PASS = process.env.ACCOUNTANT_PASSWORD;

        let role = '';

        if (password === ADMIN_PASS) role = 'admin';
        else if (password === PARTNER_PASS) role = 'partner';
        else if (password === ACCOUNTANT_PASS) role = 'accountant';

        if (role) {
            const token = await new SignJWT({ role })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('24h')
                .sign(JWT_SECRET);

            const response = NextResponse.json({ success: true, role });

            response.cookies.set('auth-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ error: 'Geçersiz şifre' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
    }
}
