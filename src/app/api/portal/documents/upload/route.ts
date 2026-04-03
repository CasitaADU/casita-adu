import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const project_id = formData.get('project_id') as string | null;
    const category = formData.get('category') as string | null;

    if (!file || !project_id || !category) {
      return NextResponse.json({ error: 'Missing required fields: file, project_id, category' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Verify authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate the user owns this project
    const { data: project, error: projectError } = await supabase
      .from('active_projects')
      .select('id, client_id')
      .eq('id', project_id)
      .eq('client_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 403 });
    }

    // Upload file to Supabase Storage
    const filePath = `${project_id}/${file.name}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('client-documents')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('File upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Insert document record
    const { data: document, error: insertError } = await supabase
      .from('client_documents')
      .insert({
        project_id,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        category,
        uploaded_by: user.id,
        uploaded_by_role: 'client',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Document record insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save document record' }, { status: 500 });
    }

    return NextResponse.json({ success: true, document });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
