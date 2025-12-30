'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Watch } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, Instagram, ChevronLeft, ChevronRight, CreditCard, ShieldCheck } from 'lucide-react';

export default function WatchDetail() {
  const { id } = useParams();
  const [watch, setWatch] = useState<Watch | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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

  const images = watch?.imageUrls?.length 
    ? watch.imageUrls 
    : watch?.imageUrl 
      ? [watch.imageUrl] 
      : [];

  const nextImage = () => setActiveImage(prev => (prev + 1) % images.length);
  const prevImage = () => setActiveImage(prev => (prev - 1 + images.length) % images.length);

  const handleCheckout = async () => {
    if (!watch) return;
    setCheckoutLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          watchId: watch.id,
          watchName: `${watch.brand} ${watch.name}`,
          watchPrice: watch.price,
          watchImage: images[0] || '',
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

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
          <Link href="/" className="text-amber-500 hover:text-amber-400">← Back to collection</Link>
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
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-zinc-900 rounded-2xl overflow-hidden relative mb-4">
              {images.length > 0 ? (
                <>
                  <Image src={images[activeImage]} alt={watch.name} fill className="object-cover" priority />
                  {images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition">
                        <ChevronLeft size={24} />
                      </button>
                      <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition">
                        <ChevronRight size={24} />
                      </button>
                      <div className="absolute bottom-3 right-3 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                        {activeImage + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
              )}
              {watch.sold && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-red-500 font-bold text-3xl tracking-widest rotate-[-15deg] border-2 border-red-500 px-4 py-2">SOLD</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      index === activeImage ? 'border-amber-500' : 'border-transparent hover:border-zinc-600'
                    }`}
                  >
                    <img src={url} alt={`${watch.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Watch Details */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-3">
              {watch.featured && (
                <span className="flex items-center gap-1 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">⭐ Featured</span>
              )}
              {watch.newArrival && (
                <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">✨ New Arrival</span>
              )}
              <span className={`text-xs font-medium tracking-widest px-3 py-1 rounded-full ${
                watch.sold ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-500'
              }`}>
                {watch.sold ? 'SOLD' : 'AVAILABLE'}
              </span>
            </div>
            
            <p className="text-zinc-500 mb-1">{watch.brand}</p>
            <h1 className="text-3xl font-bold mb-4">{watch.name}</h1>
            <p className="text-zinc-400 mb-6 leading-relaxed">{watch.description}</p>
            <p className="text-4xl font-bold text-amber-400 mb-8">${watch.price?.toLocaleString()}</p>

            {!watch.sold && (
              <div className="space-y-3">
                {/* Buy Now Button */}
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-4 px-8 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {checkoutLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <CreditCard size={20} />
                  )}
                  {checkoutLoading ? 'Loading...' : 'Buy Now'}
                </button>

                {/* Or Inquire */}
                <Link
                  href="https://instagram.com/watchplug1"
                  target="_blank"
                  className="w-full border border-zinc-700 text-white font-bold py-4 px-8 rounded-xl hover:bg-zinc-900 transition-all flex items-center justify-center gap-3"
                >
                  <Instagram size={20} />
                  Inquire on Instagram
                </Link>

                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm mt-4">
                  <ShieldCheck size={16} />
                  <span>Secure checkout powered by Stripe</span>
                </div>
              </div>
            )}

            {watch.sold && (
              <div className="text-center">
                <p className="text-zinc-500 mb-4">This watch has been sold.</p>
                <Link
                  href="https://instagram.com/watchplug1"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400"
                >
                  <Instagram size={18} />
                  DM us for similar pieces
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}