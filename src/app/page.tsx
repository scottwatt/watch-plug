'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Watch } from '@/lib/types';
import Navbar from '@/components/Navbar';
import WatchCard from '@/components/WatchCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatches = async () => {
      try {
        const q = query(collection(db, 'watches'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Watch[];
        setWatches(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWatches();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            Premium Collection
          </h2>
          <p className="text-zinc-500">
            Authenticated luxury watches • DM @watch_plug_1 on Instagram
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-amber-500" size={40} />
          </div>
        ) : watches.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-xl mb-2">No watches listed yet</p>
            <p>Check back soon for new pieces</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watches.map(watch => (
              <WatchCard key={watch.id} watch={watch} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-zinc-500 text-sm">
          <p>Follow us @watch_plug_1 on Instagram</p>
        </div>
      </footer>
    </div>
  );
}