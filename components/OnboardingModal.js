"use client";

import { useEffect, useState } from "react";

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("seen_onboarding");
    if (!seen) setOpen(true);
  }, []);

  const close = () => {
    localStorage.setItem("seen_onboarding", "true");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-gray-900 p-6 rounded-xl max-w-md text-center space-y-4">

        <h2 className="text-xl font-bold">Welcome to JobBooster 🚀</h2>

        <p className="text-gray-400 text-sm">
          Use AI to analyze resumes, practice interviews, and grow skills.
        </p>

        <div className="text-sm text-gray-300 space-y-1">
          <p>💡 Try: /analyze your resume</p>
          <p>🎤 Try: /interview frontend role</p>
          <p>📊 Try: /skills AI engineer</p>
        </div>

        <button
          onClick={close}
          className="bg-blue-600 px-5 py-2 rounded"
        >
          Get Started
        </button>

      </div>
    </div>
  );
      }
