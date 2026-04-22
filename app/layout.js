import "./globals.css";
import OnboardingModal from "../components/OnboardingModal";

export const metadata = {
  title: "JobBooster AI",
  description: "AI-powered career assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-animated text-white">

        {/* 🌌 GLOBAL BACKGROUND EFFECT */}
        <div className="fixed inset-0 -z-10 opacity-40 pointer-events-none bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 blur-3xl" />

        {/* 🚀 ONBOARDING */}
        <OnboardingModal />

        {/* MAIN APP */}
        {children}

      </body>
    </html>
  );
    }
