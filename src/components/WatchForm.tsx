'use client';
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Watch } from '@/lib/types';
import { Upload, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface WatchFormProps {
  editWatch?: Watch | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function WatchForm({ editWatch, onSuccess, onCancel }: WatchFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    sold: false,
    featured: false,
    newArrival: false,
  });

  useEffect(() => {
    if (editWatch) {
      setForm({
        name: editWatch.name || '',
        brand: editWatch.brand || '',
        price: editWatch.price?.toString() || '',
        description: editWatch.description || '',
        sold: editWatch.sold || false,
        featured: editWatch.featured || false,
        newArrival: editWatch.newArrival || false,
      });
      const urls = editWatch.imageUrls?.length 
        ? editWatch.imageUrls 
        : editWatch.imageUrl 
          ? [editWatch.imageUrl] 
          : [];
      setImageUrls(urls);
    } else {
      setForm({ name: '', brand: '', price: '', description: '', sold: false, featured: false, newArrival: false });
      setImageUrls([]);
    }
  }, [editWatch]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const imageRef = ref(storage, `watches/${Date.now()}-${file.name}`);
        await uploadBytes(imageRef, file);
        return getDownloadURL(imageRef);
      });

      const newUrls = await Promise.all(uploadPromises);
      setImageUrls(prev => [...prev, ...newUrls]);
      toast.success(`${files.length} image(s) uploaded!`);
    } catch (err) {
      console.error(err);
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }

    setLoading(true);
    try {
      const watchData = {
        name: form.name,
        brand: form.brand,
        price: parseFloat(form.price),
        description: form.description,
        imageUrl: imageUrls[0] || '',
        imageUrls: imageUrls,
        sold: form.sold,
        featured: form.featured,
        newArrival: form.newArrival,
        createdAt: editWatch?.createdAt || new Date(),
      };

      if (editWatch) {
        await updateDoc(doc(db, 'watches', editWatch.id), watchData);
        toast.success('Watch updated!');
      } else {
        await addDoc(collection(db, 'watches'), watchData);
        toast.success('Watch added!');
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        {editWatch ? 'Edit Watch' : 'Add New Watch'}
      </h2>

      <div className="mb-6">
        <label className="block mb-2 text-sm text-zinc-400">Watch Images</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img src={url} alt={`Watch ${index + 1}`} className="w-24 h-24 rounded-lg object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X size={14} />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1 left-1 bg-amber-500 text-black text-xs px-1.5 py-0.5 rounded">Main</span>
              )}
            </div>
          ))}
          <label className="w-24 h-24 rounded-lg bg-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-700 transition border-2 border-dashed border-zinc-600 hover:border-amber-500">
            {uploading ? (
              <Loader2 className="animate-spin text-amber-500" size={24} />
            ) : (
              <>
                <Upload className="text-zinc-500 mb-1" size={20} />
                <span className="text-xs text-zinc-500">Add</span>
              </>
            )}
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
        <p className="text-xs text-zinc-500">First image will be the main photo.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Watch Name (e.g. Submariner Date)"
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
          className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition"
        />
        <input
          type="text"
          placeholder="Brand (e.g. Rolex)"
          value={form.brand}
          onChange={e => setForm({...form, brand: e.target.value})}
          className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition"
        />
      </div>

      <input
        type="number"
        placeholder="Price ($)"
        value={form.price}
        onChange={e => setForm({...form, price: e.target.value})}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-amber-500 transition"
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({...form, description: e.target.value})}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-amber-500 transition h-24 resize-none"
      />

      <div className="space-y-3 mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.sold}
            onChange={e => setForm({...form, sold: e.target.checked})}
            className="w-5 h-5 rounded"
          />
          <span className="text-zinc-400">Mark as sold</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={e => setForm({...form, featured: e.target.checked})}
            className="w-5 h-5 rounded"
          />
          <span className="text-zinc-400">⭐ Featured (shows in Featured section)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.newArrival}
            onChange={e => setForm({...form, newArrival: e.target.checked})}
            className="w-5 h-5 rounded"
          />
          <span className="text-zinc-400">✨ New Arrival (shows in New Arrivals section)</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-amber-500 text-black font-bold py-3 px-6 rounded-xl hover:bg-amber-400 transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {editWatch ? 'Save Changes' : '+ Add Watch'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-zinc-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-zinc-700 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}