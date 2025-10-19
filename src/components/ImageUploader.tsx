import React, { useCallback, useRef, useState } from 'react';
import Button from './Button';
import { supabase } from '../lib/supabase';

type Props = {
  bucket?: string;
  folder?: string;
  onUploaded?: (urls: string[]) => void;
};

export default function ImageUploader({ bucket='booking_ref_images', folder='refs', onUploaded }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...list]);
  }, []);

  const onChoose = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...list]);
  };

  const uploadAll = async () => {
    if (!files.length) return;
    setUploading(true);
    const out: string[] = [];
    for (const f of files) {
      const ext = f.name.split('.').pop() || 'jpg';
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from(bucket).upload(path, f, { upsert: false });
      if (error) {
        console.error(error);
        continue;
      }
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
      if (pub?.publicUrl) out.push(pub.publicUrl);
    }
    setUrls(out);
    setUploading(false);
    onUploaded?.(out);
  };

  const prevent = (e: React.DragEvent) => { e.preventDefault(); };

  return (
    <div>
      <div
        ref={dropRef}
        onDragOver={prevent}
        onDragEnter={prevent}
        onDrop={onDrop}
        className="w-full border border-white/10 border-dashed rounded-xl p-4 text-center bg-white/5 hover:bg-white/10 transition"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        <p>Drag & drop reference images here</p>
        <p>or</p>
        <input type="file" accept="image/*" multiple onChange={onChoose} />
      </div>
      {files.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <button className="px-4 py-2 rounded bg-cyan-400 text-black font-bold" onClick={uploadAll} disabled={uploading}>
            {uploading ? 'Uploading…' : `Upload ${files.length} image(s)`}
          </Button>
        </div>
      )}
      {!!urls.length && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {urls.map(u => <img key={u} src={u} className="w-full h-24 object-cover rounded-lg ring-1 ring-white/10" />)}
        </div>
      )}
    </div>
  );
}
