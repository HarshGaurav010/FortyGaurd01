import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'HeatRetrofit AI — Heat-Aware Building Retrofit & Energy Optimization',
  description:
    'Combines FortyGuard hyperlocal heat intelligence with building characteristics to identify thermal weaknesses, recommend high-impact retrofits, and estimate energy and ROI before you invest.',
  keywords: [
    'FortyGuard',
    'Heat Retrofit AI',
    'Thermal Stress Score',
    'Building Energy Optimization',
    'Cool Roof Coatings',
    'Urban Heat Island',
    'Net Zero Retrofit',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-950 text-slate-100 antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
