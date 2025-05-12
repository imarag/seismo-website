import "./globals.css";
import { Roboto } from 'next/font/google'
import Header from "@/components/root/Header";
import Footer from "@/components/root/Footer";

const roboto = Roboto({
  subsets: ['latin'],
})
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="forest" className={`${roboto.className} bg-base-100 text-base text-base-content`}>
      <body>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
