import "./globals.css";
import PageTransition from "../components/PageTransition";

export const metadata = {
  title: "JobBooster AI",
  description: "AI-powered career growth platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">

        {/* PAGE TRANSITIONS */}
        <PageTransition>
          {children}
        </PageTransition>

      </body>
    </html>
  );
    }
