import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

const secretKey = 'secret';
const key = new TextEncoder().encode(process.env.AUTH_SECRET || secretKey);

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as Record<string, unknown>;
}

export async function login(password: string) {
  if (password === process.env.AUTH_PASSWORD) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ authenticated: true, expires });

    (await cookies()).set('session', session, { expires, httpOnly: true });
    return true;
  }
  return false;
}

export async function logout() {
  (await cookies()).set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires as Date,
  });
  return res;
}
