import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { getResend, FROM_EMAIL } from '@/lib/email/resend';
import { projectUpdateNotification } from '@/lib/email/templates';

const schema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  phase: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { project_id, title, description, phase, images } = parsed.data;

    const supabase = createServiceRoleClient();

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Insert progress update
    const { error: insertError } = await supabase
      .from('progress_updates')
      .insert({
        project_id,
        title,
        description,
        phase: phase || null,
        images: images || [],
        created_by: user.id,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Progress update insert error:', insertError);
      return NextResponse.json({ error: 'Failed to create update' }, { status: 500 });
    }

    // Update project status if phase is provided
    if (phase) {
      const { error: statusError } = await supabase
        .from('active_projects')
        .update({ status: phase })
        .eq('id', project_id);

      if (statusError) {
        console.error('Project status update error:', statusError);
      }
    }

    // Look up the project's client and send notification email
    const { data: project } = await supabase
      .from('active_projects')
      .select('client_id, title')
      .eq('id', project_id)
      .single();

    if (project?.client_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', project.client_id)
        .single();

      if (profile?.email) {
        const template = projectUpdateNotification(
          profile.full_name || 'Client',
          project.title || 'Your Project',
          title,
          description
        );

        const resend = getResend();
        resend.emails.send({
          from: FROM_EMAIL,
          to: profile.email,
          subject: template.subject,
          html: template.html,
        }).catch((err) => {
          console.error('Update notification email error:', err);
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
