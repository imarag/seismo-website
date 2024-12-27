
import "./globals.css";
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <header className="bg-white py-2">
          <div className="container mx-auto  ">
            <NavBar />
          </div>
        </header>
        <main className="text-lg pt-10 mb-20">
          {children}
        </main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
