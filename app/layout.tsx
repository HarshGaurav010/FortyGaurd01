import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-[var(--background)] text-[var(--text-primary)] antialiased min-h-screen flex flex-col transition-colors duration-300">
        <ThemeProvider>
          <SmoothScrollProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
