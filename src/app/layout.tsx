import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'Casita ADU | California\'s Premier Construction Management Agency',
    template: '%s | Casita ADU',
  },
  description:
    'From permitting and design to construction and final walkthroughs, Casita ADU handles every detail of your ADU journey in San Diego and Southern California.',
  keywords: ['ADU', 'accessory dwelling unit', 'San Diego', 'California', 'construction', 'permitting', 'design'],
  openGraph: {
    title: 'Casita ADU | California\'s Premier Construction Management Agency',
    description: 'Your Casita Concierge — guiding you through every step of your ADU journey.',
    url: 'https://casitaadu.com',
    siteName: 'Casita ADU',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body antialiased bg-brand-cream text-brand-charcoal">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'font-body text-sm',
            duration: 4000,
            style: { background: '#0D4A4A', color: '#fff' },
          }}
        />
      </body>
    </html>
  );
}
