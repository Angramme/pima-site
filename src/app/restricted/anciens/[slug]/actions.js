'use server';

import prisma from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

export async function user_status_change(formData) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: 'user logged out' };
  if (!session.user.admin) return { error: 'user does not have privilages' };

  const userId = formData.get('user_id');
  const adminRightsOn = formData.has('admin_rights_on');
  const adminRightsOff = formData.has('admin_rights_off');

  if (userId && (adminRightsOn || adminRightsOff)) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { admin: adminRightsOn },
      });
      revalidatePath(`/restricted/anciens/${userId}`);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { error: `Prisma error : ${error}` };
    }
  } else {
    return { error: 'invalid form data' };
  }
}

export async function user_delete(formData) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: 'user logged out' };
  if (!session.user.admin) return { error: 'user does not have privilages' };

  const userId = formData.get('user_id');

  if (!userId) return { error: 'invalid form data' };

  try {
    await prisma.session.deleteMany({
      where: { user_id: userId },
    });
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath(`/restricted/anciens`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: `Prisma error : ${error}` };
  }
}
