import Link from 'next/link';
import Image from 'next/image';
import { Watch } from '@/lib/types';
import { Star, Sparkles } from 'lucide-react';

interface WatchCardProps {
  watch: Watch;
}

export default function WatchCard({ watch }: WatchCardProps) {
  const imageUrl = watch.imageUrls?.[0] || watch.imageUrl;

  return (
    <Link href={`/watch/${watch.id}`}>
      <div className="group cursor-pointer bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5">
        <div className="aspect-square bg-zinc-800 overflow-hidden relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={watch.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              No Image
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {watch.featured && (
              <span className="flex items-center gap-1 bg-amber-500 text-black text-xs font-bold px-2.5 py-1 rounded-full">
                <Star size={12} fill="currentColor" />
                Featured
              </span>
            )}
            {watch.newArrival && (
              <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                <Sparkles size={12} />
                New
              </span>
            )}
          </div>

          {/* Sold Overlay */}
          {watch.sold && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-red-500 font-bold text-xl tracking-widest rotate-[-15deg] border-2 border-red-500 px-4 py-2">
                SOLD
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-zinc-500 text-sm">{watch.brand}</p>
          <h3 className="font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors">{watch.name}</h3>
          <p className="text-amber-400 font-bold text-lg">
            ${watch.price?.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}