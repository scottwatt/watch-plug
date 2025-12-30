import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CheckCircle, Instagram, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="text-green-500" size={48} />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
          <p className="text-xl text-zinc-400 mb-8">
            Your order has been placed successfully.
          </p>

          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 mb-8">
            <h2 className="text-lg font-semibold mb-4">What happens next?</h2>
            <div className="text-left space-y-4 text-zinc-400">
              <div className="flex gap-3">
                <span className="text-amber-500 font-bold">1.</span>
                <p>You'll receive a confirmation email with your order details.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-500 font-bold">2.</span>
                <p>We'll verify the watch and prepare it for shipping.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-500 font-bold">3.</span>
                <p>Your timepiece will be shipped with full insurance and tracking.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-500 font-bold">4.</span>
                <p>Expect delivery within 3-5 business days.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-amber-500 text-black font-bold py-3 px-6 rounded-xl hover:bg-amber-400 transition flex items-center justify-center gap-2"
            >
              Continue Shopping
              <ArrowRight size={18} />
            </Link>
            <Link
              href="https://instagram.com/watchplug1"
              target="_blank"
              className="border border-zinc-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-zinc-900 transition flex items-center justify-center gap-2"
            >
              <Instagram size={18} />
              Follow Us
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}