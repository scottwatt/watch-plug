'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-40">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        {onMenuClick ? (
          <button onClick={onMenuClick} className="p-2">
            <Menu size={24} />
          </button>
        ) : (
          <Link href="/" className="p-2">
            <Menu size={24} />
          </Link>
        )}
        
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="Watch Plug" 
            width={50} 
            height={50}
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg md:text-xl tracking-tight leading-tight">WATCH PLUG</span>
            <span className="text-[9px] text-gray-500 tracking-[0.15em]">AUTHENTIC TIMEPIECES</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-2">
          <button className="p-2"><Search size={22} /></button>
          <button className="p-2"><ShoppingBag size={22} /></button>
        </div>
      </div>
    </header>
  );
}