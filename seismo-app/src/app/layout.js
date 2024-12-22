
import "./globals.css";
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"


export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="winter">
      <body >
        <header className="container mx-auto">
          <NavBar />
        </header>
        <main className="text-lg">
          {children}
        </main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
