
import "./globals.css";
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"


export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <header>
                    <NavBar />
                </header>
                <main>
                    {children}
                </main>
                <footer>
                    <Footer />
                </footer>
            </body>
        </html>
    );
}
