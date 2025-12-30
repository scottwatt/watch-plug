'use client';
import { useState } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Watch } from '@/lib/types';
import { Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface WatchFormProps {
  editWatch?: Watch | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function WatchForm({ editWatch, onSuccess, onCancel }: WatchFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(editWatch?.imageUrl || '');
  const [form, setForm] = useState({
    name: editWatch?.name || '',
    brand: editWatch?.brand || '',
    price: editWatch?.price?.toString() || '',
    description: editWatch?.description || '',
    sold: editWatch?.sold || false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = editWatch?.imageUrl || '';

      if (imageFile) {
        const imageRef = ref(storage, `watches/${Date.now()}-${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const watchData = {
        name: form.name,
        brand: form.brand,
        price: parseFloat(form.price),
        description: form.description,
        imageUrl,
        sold: form.sold,
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

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block mb-2 text-sm text-zinc-400">Watch Image</label>
        <div className="flex items-center gap-4">
          {preview ? (
            <img src={preview} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Upload className="text-zinc-600" />
            </div>
          )}
          <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition">
            <span className="text-sm">Choose Image</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>
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

      <label className="flex items-center gap-3 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={form.sold}
          onChange={e => setForm({...form, sold: e.target.checked})}
          className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 checked:bg-amber-500"
        />
        <span className="text-zinc-400">Mark as sold</span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
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