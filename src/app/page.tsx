'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Watch } from '@/lib/types';
import Navbar from '@/components/Navbar';
import WatchCard from '@/components/WatchCard';
import { Loader2, Shield, Clock, Award, Instagram } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');

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

  // Get unique brands
  const brands = ['All', ...Array.from(new Set(watches.map(w => w.brand).filter(Boolean)))];
  
  // Filter watches
  const filteredWatches = selectedBrand === 'All' 
    ? watches 
    : watches.filter(w => w.brand === selectedBrand);
  
  const featuredWatches = watches.filter(w => w.featured && !w.sold);
  const newArrivals = watches.filter(w => w.newArrival && !w.sold);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto px-6 py-24 relative">
          <div className="max-w-3xl">
            <p className="text-amber-500 font-medium tracking-widest mb-4 text-sm">AUTHENTICATED LUXURY</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Rare Timepieces,
              <span className="block bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                Unmatched Quality
              </span>
            </h1>
            <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
              Curated collection of pre-owned luxury watches. Every piece verified for authenticity. 
              Direct inquiries via Instagram for a personal buying experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#collection" className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-4 px-8 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all">
                View Collection
              </a>
              <Link 
                href="https://instagram.com/watch_plug_1" 
                target="_blank"
                className="border border-zinc-700 text-white font-bold py-4 px-8 rounded-xl hover:bg-zinc-900 transition-all flex items-center gap-2"
              >
                <Instagram size={20} />
                Follow Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-zinc-800 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <Shield className="text-amber-500" size={28} />
              </div>
              <div>
                <h3 className="font-semibold text-white">100% Authentic</h3>
                <p className="text-zinc-500 text-sm">Every watch verified & guaranteed</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="text-amber-500" size={28} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Curated Selection</h3>
                <p className="text-zinc-500 text-sm">Only the finest timepieces</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <Award className="text-amber-500" size={28} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Trusted Dealer</h3>
                <p className="text-zinc-500 text-sm">Building relationships since day one</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Watches */}
      {featuredWatches.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-1 h-8 bg-amber-500 rounded-full" />
            <h2 className="text-3xl font-bold">Featured Pieces</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWatches.slice(0, 3).map(watch => (
              <WatchCard key={watch.id} watch={watch} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="bg-zinc-900/30">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-1 h-8 bg-green-500 rounded-full" />
              <h2 className="text-3xl font-bold">New Arrivals</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.slice(0, 4).map(watch => (
                <WatchCard key={watch.id} watch={watch} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full Collection */}
      <section id="collection" className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-zinc-500 rounded-full" />
            <h2 className="text-3xl font-bold">Full Collection</h2>
          </div>
          
          {/* Brand Filter */}
          <div className="flex flex-wrap gap-2">
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedBrand === brand
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-amber-500" size={40} />
          </div>
        ) : filteredWatches.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-xl mb-2">No watches found</p>
            <p>Check back soon for new pieces</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWatches.map(watch => (
              <WatchCard key={watch.id} watch={watch} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Looking for Something Specific?</h2>
          <p className="text-zinc-400 mb-8 text-lg">
            Don't see what you're looking for? Reach out — we have access to pieces not listed here.
          </p>
          <Link 
            href="https://instagram.com/watch_plug_1" 
            target="_blank"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-4 px-8 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            <Instagram size={22} />
            Message Us on Instagram
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black">
                W
              </div>
              <div>
                <h3 className="font-bold">WATCH PLUG</h3>
                <p className="text-xs text-zinc-500">Authentic Timepieces</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-zinc-500 text-sm">
              <Link href="https://instagram.com/watch_plug_1" target="_blank" className="hover:text-amber-500 transition">
                Instagram
              </Link>
              <span>•</span>
              <span>@watch_plug_1</span>
            </div>
          </div>
          <div className="text-center text-zinc-600 text-sm mt-8 pt-8 border-t border-zinc-800">
            © {new Date().getFullYear()} Watch Plug. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}