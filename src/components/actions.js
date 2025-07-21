'use server';

import { cookies } from 'next/headers';

export async function accept_cookies() {
  cookies().set('cookies_accepted', 'true');
}
