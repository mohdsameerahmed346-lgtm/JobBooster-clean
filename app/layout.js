import "./globals.css";
import OnboardingModal from "../components/OnboardingModal";

export const metadata = {
  title: "JobBooster AI",
  description: "AI-powered career assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-base text-white">

        {/* 🌌 LIGHTWEIGHT BACKGROUND (OPTIMIZED) */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-2xl md:blur-3xl opacity-40" />
        </div>

        {/* 🚀 ONBOARDING */}
        <OnboardingModal />

        {/* MAIN */}
        <div className="gpu">
          {children}
        </div>

      </body>
    </html>
  );
    }
