'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Watch } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';

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
      <div className="min-h-screen bg-white">
        <div className="bg-black text-white text-center py-2 text-sm tracking-widest">
          WELCOME TO OUR STORE
        </div>
        <Header />
        <div className="flex justify-center py-32">
          <Loader2 className="animate-spin text-black" size={40} />
        </div>
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-black text-white text-center py-2 text-sm tracking-widest">
          WELCOME TO OUR STORE
        </div>
        <Header />
        <div className="text-center py-32">
          <h2 className="text-2xl mb-4">Product not found</h2>
          <Link href="/" className="text-gray-500 hover:text-black">← Back to shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="bg-black text-white text-center py-2 text-sm tracking-widest">
        WELCOME TO OUR STORE
      </div>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="text-gray-500 hover:text-black mb-8 flex items-center gap-2 w-fit text-sm">
          <ArrowLeft size={16} />
          Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-6">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-gray-100 overflow-hidden relative mb-4">
              {images.length > 0 ? (
                <>
                  <Image src={images[activeImage]} alt={watch.name} fill className="object-cover" priority />
                  {images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full transition">
                        <ChevronLeft size={20} />
                      </button>
                      <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full transition">
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
              {watch.sold && (
                <div className="absolute top-4 left-4 bg-black text-white text-sm px-4 py-1 rounded-full">
                  Sold out
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition ${
                      index === activeImage ? 'border-black' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={url} alt={`${watch.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <p className="text-gray-500 text-sm uppercase tracking-wide mb-1">{watch.brand}</p>
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-4">{watch.name}</h1>
            <p className="text-2xl font-medium mb-6">${watch.price?.toLocaleString()}.00 USD</p>
            
            {watch.description && (
              <p className="text-gray-600 mb-8 leading-relaxed">{watch.description}</p>
            )}

            {!watch.sold ? (
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full bg-black text-white font-medium py-4 px-8 hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-wide"
                >
                  {checkoutLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    'Buy Now'
                  )}
                </button>
                <Link
                  href="https://instagram.com/watch_plug_1"
                  target="_blank"
                  className="w-full border border-black text-black font-medium py-4 px-8 hover:bg-gray-100 transition flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <Instagram size={18} />
                  Message us
                </Link>
              </div>
            ) : (
              <div className="text-center py-8 border border-gray-200 bg-gray-50">
                <p className="text-gray-500 mb-4">This item has been sold.</p>
                <Link
                  href="https://instagram.com/watch_plug_1"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-black hover:text-gray-600"
                >
                  <Instagram size={18} />
                  DM us for similar items
                </Link>
              </div>
            )}

            {/* Product Info */}
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Authenticity</span>
                <span className="text-black">100% Guaranteed</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-black">Free shipping</span>
              </div>
              <div className="flex justify-between">
                <span>Returns</span>
                <span className="text-black">Contact for policy</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}