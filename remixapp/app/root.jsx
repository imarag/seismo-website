// import { Analytics } from "@vercel/analytics/remix"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./tailwind.css";
import Footer from "@/components/root/Footer";
import NavBar from "@/components/root/NavBar";

export function Layout({ children }) {
  return (
    <html lang="en" data-theme="emerald">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <NavBar />
        </header>
        <main className="px-4 pt-20 bg-base-100">
          {children}
        </main>
        <footer>
            <Footer />
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
