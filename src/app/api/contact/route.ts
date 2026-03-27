import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { sendWelcomeSequence } from '@/lib/email/send';

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Save to database
    const { error } = await supabase.from('contact_submissions').insert({
      ...parsed.data,
      status: 'new',
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Contact submission error:', error);
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }

    // Send email sequence (don't block the response on email delivery)
    sendWelcomeSequence(parsed.data).catch((err) => {
      console.error('Email sequence error:', err);
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
