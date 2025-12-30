'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Watch } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, Instagram } from 'lucide-react';

export default function WatchDetail() {
  const { id } = useParams();
  const [watch, setWatch] = useState<Watch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatch = async () => {
      try {
        const docRef = doc(db, 'watches', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWatch({ id: docSnap.id, ...docSnap.data() } as Watch);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchWatch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex justify-center py-32">
          <Loader2 className="animate-spin text-amber-500" size={40} />
        </div>
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="text-center py-32">
          <h2 className="text-2xl mb-4">Watch not found</h2>
          <Link href="/" className="text-amber-500 hover:text-amber-400">
            ← Back to collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <Link href="/" className="text-zinc-400 hover:text-white mb-8 flex items-center gap-2 w-fit">
          <ArrowLeft size={18} />
          Back to collection
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mt-8">
          <div className="aspect-square bg-zinc-900 rounded-2xl overflow-hidden relative">
            {watch.imageUrl ? (
              <Image
                src={watch.imageUrl}
                alt={watch.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                No Image
              </div>
            )}
            {watch.sold && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <span className="text-red-500 font-bold text-3xl tracking-widest rotate-[-15deg]">
                  SOLD
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-amber-500 text-sm font-medium tracking-widest mb-2">
              {watch.sold ? 'SOLD' : 'AVAILABLE NOW'}
            </span>
            <p className="text-zinc-500 mb-1">{watch.brand}</p>
            <h1 className="text-3xl font-bold mb-4">{watch.name}</h1>
            <p className="text-zinc-400 mb-6 leading-relaxed">{watch.description}</p>
            <p className="text-4xl font-bold text-amber-400 mb-8">
              ${watch.price.toLocaleString()}
            </p>

            {!watch.sold && (
              <Link
                href="https://instagram.com/watch_plug_1"
                target="_blank"
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-4 px-8 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-3"
              >
                <Instagram size={20} />
                Inquire on Instagram
              </Link>
            )}
            <p className="text-zinc-500 text-sm mt-4 text-center">
              DM @watch_plug_1 for availability and details
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}