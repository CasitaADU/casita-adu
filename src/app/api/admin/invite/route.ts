import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { getResend, FROM_EMAIL } from '@/lib/email/resend';
import { clientInviteEmail } from '@/lib/email/templates';
import crypto from 'crypto';

const schema = z.object({
  email: z.string().email(),
  project_id: z.string().uuid(),
  invited_by: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { email, project_id, invited_by } = parsed.data;
    const invite_token = crypto.randomUUID();

    const supabase = createServiceRoleClient();

    // Insert invite record
    const { data: invite, error } = await supabase
      .from('client_invites')
      .insert({
        email,
        project_id,
        invited_by,
        invite_token,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Invite insert error:', error);
      return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
    }

    // Build invite URL and send email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://casitaadu.com';
    const inviteUrl = `${siteUrl}/register?token=${invite_token}`;
    const template = clientInviteEmail(email, inviteUrl);

    let emailSent = false;
    try {
      const resend = getResend();
      const { error: emailError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: template.subject,
        html: template.html,
      });
      if (emailError) {
        console.error('Resend email error:', emailError);
      } else {
        emailSent = true;
      }
    } catch (emailErr) {
      console.error('Email send failed:', emailErr);
    }

    return NextResponse.json({ success: true, invite_id: invite.id, email_sent: emailSent, invite_url: inviteUrl });
  } catch (err) {
    console.error('Invite error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
