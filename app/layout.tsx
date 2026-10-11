import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Sabong System Console — Live Arena Operations & Compliance',
  description:
    'Enterprise multi-role live match broadcasting, multi-camera operations, and compliance console with Supabase and LiveKit in non-wagering demonstration mode.',
  openGraph: {
    title: 'Sabong System Console',
    description:
      'Enterprise multi-role live match broadcasting, multi-camera operations, and compliance console with Supabase and LiveKit in non-wagering demonstration mode.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sabong System Console',
    description:
      'Enterprise multi-role live match broadcasting, multi-camera operations, and compliance console with Supabase and LiveKit in non-wagering demonstration mode.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0d0f14] text-neutral-100 flex flex-col font-sans antialiased selection:bg-red-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
