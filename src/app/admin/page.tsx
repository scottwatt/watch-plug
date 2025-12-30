'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Watch } from '@/lib/types';
import Navbar from '@/components/Navbar';
import WatchForm from '@/components/WatchForm';
import { Trash2, Edit, Loader2, Lock, LogOut } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editWatch, setEditWatch] = useState<Watch | null>(null);

  // Check if already logged in
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_auth');
    if (saved === 'true') setIsAuthed(true);
    setChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (res.ok) {
        sessionStorage.setItem('admin_auth', 'true');
        setIsAuthed(true);
        toast.success('Welcome back!');
      } else {
        toast.error('Wrong password');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthed(false);
  };

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

  useEffect(() => {
    if (isAuthed) fetchWatches();
  }, [isAuthed]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this watch?')) return;
    try {
      await deleteDoc(doc(db, 'watches', id));
      setWatches(watches.filter(w => w.id !== id));
      toast.success('Watch deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  const handleSuccess = () => {
    setEditWatch(null);
    fetchWatches();
  };

  // Loading state
  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  // Login form
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-20">
          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                <Lock className="text-amber-500" size={28} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Admin Access</h1>
            <p className="text-zinc-500 text-center mb-8">Enter password to continue</p>
            
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-amber-500 transition"
                autoFocus
              />
              <button
                type="submit"
                disabled={loginLoading || !password}
                className="w-full bg-amber-500 text-black font-bold py-3 px-6 rounded-xl hover:bg-amber-400 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loginLoading && <Loader2 className="animate-spin" size={18} />}
                Enter Admin Panel
              </button>
            </form>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  // Admin panel (authenticated)
  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-right" />
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="mb-10">
          <WatchForm
            editWatch={editWatch}
            onSuccess={handleSuccess}
            onCancel={editWatch ? () => setEditWatch(null) : undefined}
          />
        </div>

        <h2 className="text-xl font-bold mb-4 text-zinc-400">
          Current Inventory ({watches.length})
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-amber-500" size={30} />
          </div>
        ) : watches.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">No watches yet. Add your first one above!</p>
        ) : (
          <div className="space-y-3">
            {watches.map(w => (
              <div
                key={w.id}
                className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-center gap-4"
              >
                {w.imageUrl ? (
                  <img src={w.imageUrl} alt={w.name} className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-zinc-800" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold truncate">{w.name}</h4>
                    {w.sold && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                        SOLD
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-500 text-sm">{w.brand}</p>
                  <p className="text-amber-400 font-bold">${w.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setEditWatch(w)}
                  className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-zinc-800 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}