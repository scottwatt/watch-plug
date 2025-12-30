import Link from 'next/link';
import { Instagram } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black">
            W
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">WATCH PLUG</h1>
            <p className="text-xs text-zinc-500 tracking-widest">AUTHENTIC TIMEPIECES</p>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link 
            href="https://instagram.com/watch_plug_1" 
            target="_blank"
            className="text-zinc-400 hover:text-amber-400 transition"
          >
            <Instagram size={22} />
          </Link>
{/* Admin at /admin - hidden from public */}
        </nav>
      </div>
    </header>
  );
}