import "./globals.css";

export const metadata = {
  title: "JobBooster",
  description: "AI Job Preparation SaaS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        {children}
      </body>
    </html>
  );
}
