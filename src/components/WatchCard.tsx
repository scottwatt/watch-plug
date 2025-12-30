import Link from 'next/link';
import Image from 'next/image';
import { Watch } from '@/lib/types';

interface WatchCardProps {
  watch: Watch;
}

export default function WatchCard({ watch }: WatchCardProps) {
  return (
    <Link href={`/watch/${watch.id}`}>
      <div className="group cursor-pointer bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-square bg-zinc-800 overflow-hidden relative">
          {watch.imageUrl ? (
            <Image
              src={watch.imageUrl}
              alt={watch.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              No Image
            </div>
          )}
          {watch.sold && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-red-500 font-bold text-xl tracking-widest rotate-[-15deg]">
                SOLD
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-zinc-500 text-sm">{watch.brand}</p>
          <h3 className="font-semibold text-white mb-1">{watch.name}</h3>
          <p className="text-amber-400 font-bold text-lg">
            ${watch.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}