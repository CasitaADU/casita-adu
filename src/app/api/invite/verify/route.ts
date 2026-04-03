import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.json({ valid: false, error: 'Missing token' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    const { data: invite, error } = await supabase
      .from('client_invites')
      .select('id, email, project_id, status, expires_at')
      .eq('invite_token', token)
      .single();

    if (error || !invite) {
      return NextResponse.json({ valid: false, error: 'Invite not found' });
    }

    if (invite.status !== 'pending') {
      return NextResponse.json({ valid: false, error: 'Invite has already been used' });
    }

    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, error: 'Invite has expired' });
    }

    return NextResponse.json({
      valid: true,
      email: invite.email,
      project_id: invite.project_id,
      invite_id: invite.id,
    });
  } catch {
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 });
  }
}
