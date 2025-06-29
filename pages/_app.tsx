import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import '../app/globals.css';
import { I18nProvider } from '@/providers/I18nProvider';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <I18nProvider>
        <Component {...pageProps} />
      </I18nProvider>
    </div>
  );
} 