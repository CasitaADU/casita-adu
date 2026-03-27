'use client';

import { useCallback, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  folder?: string;
  multiple?: boolean;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'general',
  multiple = false,
  label = 'Image',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const urls: string[] = multiple
    ? Array.isArray(value) ? value : value ? [value as string] : []
    : value ? [value as string] : [];

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return null;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10 MB');
      return null;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      toast.error(`Upload failed: ${error.message}`);
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  }, [folder, supabase]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (!multiple && fileArray.length > 1) {
      toast.error('Only one image allowed');
      return;
    }

    setUploading(true);
    setProgress(0);

    const uploaded: string[] = [];
    for (let i = 0; i < fileArray.length; i++) {
      setProgress(Math.round(((i) / fileArray.length) * 100));
      const url = await uploadFile(fileArray[i]);
      if (url) uploaded.push(url);
    }
    setProgress(100);

    if (uploaded.length > 0) {
      if (multiple) {
        onChange([...urls, ...uploaded]);
      } else {
        onChange(uploaded[0]);
      }
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded`);
    }

    setUploading(false);
    setProgress(0);
  }, [multiple, onChange, uploadFile, urls]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleUrlAdd = () => {
    const trimmed = urlValue.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }
    if (multiple) {
      onChange([...urls, trimmed]);
    } else {
      onChange(trimmed);
    }
    setUrlValue('');
    setShowUrlInput(false);
    toast.success('Image URL added');
  };

  const removeImage = (index: number) => {
    if (multiple) {
      const next = urls.filter((_, i) => i !== index);
      onChange(next);
    } else {
      onChange('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="label mb-0">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-brand-mid-teal hover:text-brand-dark-teal flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? 'Upload file' : 'Paste URL'}
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder="https://example.com/image.jpg"
            value={urlValue}
            onChange={e => setUrlValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlAdd()}
          />
          <button
            type="button"
            onClick={handleUrlAdd}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-brand-mid-teal text-white hover:bg-brand-dark-teal transition-colors"
          >
            Add
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
            ${dragOver
              ? 'border-brand-mid-teal bg-brand-mid-teal/5'
              : 'border-gray-200 hover:border-brand-mid-teal/50 hover:bg-gray-50'
            }
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={e => e.target.files && handleFiles(e.target.files)}
          />

          {uploading ? (
            <div className="space-y-2">
              <div className="w-8 h-8 mx-auto border-2 border-brand-mid-teal border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-brand-slate/60">Uploading... {progress}%</p>
              <div className="w-48 mx-auto h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-mid-teal rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Upload className="w-8 h-8 mx-auto text-brand-mid-teal/40" />
              <p className="text-sm text-brand-slate/60">
                Drag & drop {multiple ? 'images' : 'an image'} here, or{' '}
                <span className="text-brand-mid-teal font-medium">browse</span>
              </p>
              <p className="text-xs text-brand-slate/30">PNG, JPG, WebP up to 10 MB</p>
            </div>
          )}
        </div>
      )}

      {/* Previews */}
      {urls.length > 0 && (
        <div className={`mt-3 ${multiple ? 'grid grid-cols-3 sm:grid-cols-4 gap-2' : ''}`}>
          {urls.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className={`relative group rounded-xl overflow-hidden border border-gray-100 ${
                multiple ? 'aspect-square' : 'h-32'
              }`}
            >
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src = '';
                  (e.target as HTMLImageElement).className = 'hidden';
                  (e.target as HTMLImageElement).parentElement!.classList.add('bg-gray-50');
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); removeImage(i); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-red-500 rounded-full p-1.5 hover:bg-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {multiple && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-mid-teal/50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <ImageIcon className="w-5 h-5 text-brand-slate/20" />
              <span className="text-[10px] text-brand-slate/30">Add more</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
