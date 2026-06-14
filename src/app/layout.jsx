import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gada Electronics - Inventory Management",
  description: "Complete inventory management system for electronics shop",
  icons: {
    icon: "/image.png",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="dark">
        <body className={inter.className}>
          {children}
          <a
            href="https://converti-go.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Open Converti-Go unit converter in a new tab"
          >
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            Converti-Go
          </a>
        </body>
      </html>
    </ClerkProvider>
  );
}
