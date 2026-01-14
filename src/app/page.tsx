'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Watch } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Menu, Search, ShoppingBag, X, Instagram } from 'lucide-react';
import Header from '@/components/Header';

export default function Home() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [menuOpen, setMenuOpen] = useState(false);

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

  const brands = ['All', ...Array.from(new Set(watches.map(w => w.brand).filter(Boolean)))];
  const filteredWatches = selectedBrand === 'All' 
    ? watches 
    : watches.filter(w => w.brand === selectedBrand);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Announcement Bar */}
      <div className="bg-black text-white text-center py-2 text-sm tracking-widest">
        WELCOME TO OUR STORE
      </div>

      <Header onMenuClick={() => setMenuOpen(true)} />

      {/* Slide-out Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="relative bg-white w-80 max-w-full h-full overflow-y-auto">
            <button onClick={() => setMenuOpen(false)} className="absolute top-4 left-4 p-2">
              <X size={24} />
            </button>
            <nav className="pt-20 px-6">
              <ul className="space-y-4 text-lg tracking-wide">
                <li><Link href="/" className="block py-2 hover:text-gray-500" onClick={() => setMenuOpen(false)}>HOME</Link></li>
                <li><Link href="https://instagram.com/watch_plug_1" className="block py-2 hover:text-gray-500">CONTACT</Link></li>
                <li className="border-t pt-4 mt-4 text-sm text-gray-500">SHOP BY BRAND</li>
                {brands.filter(b => b !== 'All').map(brand => (
                  <li key={brand}>
                    <button 
                      onClick={() => { setSelectedBrand(brand); setMenuOpen(false); }}
                      className="block py-2 hover:text-gray-500 uppercase"
                    >
                      {brand}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section - Collage Style */}
      <section className="relative">
        <div className="grid grid-cols-2 gap-0">
          {watches.slice(0, 4).map((watch, i) => (
            <div key={watch.id || i} className="aspect-square relative overflow-hidden">
              {watch.imageUrl ? (
                <Image 
                  src={watch.imageUrls?.[0] || watch.imageUrl} 
                  alt={watch.name} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
          ))}
          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
            <h1 className="text-white text-4xl md:text-6xl font-bold text-center tracking-wider drop-shadow-lg">
              BROWSE OUR<br />LATEST<br />PRODUCTS
            </h1>
            <Link 
              href="#products" 
              className="mt-6 border-2 border-white text-white px-8 py-3 hover:bg-white hover:text-black transition"
            >
              Shop all
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">FEATURED</h2>
        <h2 className="text-3xl md:text-4xl font-bold mb-8">PRODUCTS</h2>

        {/* Brand Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-4 py-2 text-sm tracking-wide transition whitespace-nowrap ${
                selectedBrand === brand
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              {brand.toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-black" size={40} />
          </div>
        ) : filteredWatches.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl mb-2">No products found</p>
            <p>Check back soon for new items</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredWatches.map(watch => (
              <ProductCard key={watch.id} watch={watch} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <span className="font-bold text-xl tracking-tight">WATCH PLUG</span>
              <p className="text-gray-500 text-sm mt-1">Authentic Timepieces</p>
            </div>
            <div className="flex items-center gap-6">
              <Link href="https://instagram.com/watch_plug_1" target="_blank" className="hover:text-gray-500">
                <Instagram size={24} />
              </Link>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm mt-8 pt-8 border-t border-gray-200">
            © {new Date().getFullYear()} Watch Plug. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ watch }: { watch: Watch }) {
  const imageUrl = watch.imageUrls?.[0] || watch.imageUrl;
  
  return (
    <Link href={`/watch/${watch.id}`}>
      <div className="group cursor-pointer">
        <div className="aspect-square bg-gray-100 overflow-hidden relative mb-3">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={watch.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {watch.sold && (
            <div className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
              Sold out
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-sm md:text-base uppercase tracking-wide line-clamp-2">
            {watch.brand} {watch.name}
          </h3>
          <p className="text-gray-900 font-medium mt-1">
            ${watch.price?.toLocaleString()}.00 USD
          </p>
        </div>
      </div>
    </Link>
  );
}