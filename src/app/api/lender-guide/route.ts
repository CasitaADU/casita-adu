import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  first_name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Save lead to contact_submissions with source = 'lender-guide'
    await supabase.from('contact_submissions').insert({
      first_name: parsed.data.first_name,
      last_name: '',
      email: parsed.data.email,
      message: 'Requested Lender Partnership Directory PDF',
      source: 'lender-guide',
      status: 'new',
      created_at: new Date().toISOString(),
    });

    // Return the PDF download URL
    return NextResponse.json({
      success: true,
      downloadUrl: '/casita-lender-directory.pdf',
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
