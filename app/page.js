import Link from "next/link";

export default function Home() { return ( <main className="min-h-screen bg-white text-black"> {/* NAVBAR */} <nav className="flex justify-between items-center px-6 py-4 border-b"> <h1 className="text-xl font-bold">CareerAI</h1> <Link href="/dashboard"> <button className="px-4 py-2 rounded-xl border">Dashboard</button> </Link> </nav>

{/* HERO */}
  <section className="text-center py-20 px-6">
    <h1 className="text-4xl md:text-6xl font-bold mb-6">
      Land Interviews Faster with AI
    </h1>
    <p className="text-lg text-gray-600 mb-8">
      Optimize resumes, track job applications, and crack interviews — all in one place.
    </p>
    <Link href="/dashboard">
      <button className="px-6 py-3 bg-black text-white rounded-2xl text-lg">
        Start Free
      </button>
    </Link>
  </section>

  {/* PROBLEM SECTION */}
  <section className="py-16 px-6 bg-gray-50 text-center">
    <h2 className="text-3xl font-semibold mb-8">Struggling with job search?</h2>
    <div className="grid md:grid-cols-3 gap-6">
      <div className="p-6 border rounded-2xl">Applying to 200+ jobs with no response</div>
      <div className="p-6 border rounded-2xl">Resume getting rejected by ATS</div>
      <div className="p-6 border rounded-2xl">No idea what skills to improve</div>
    </div>
  </section>

  {/* FEATURES */}
  <section className="py-20 px-6 text-center">
    <h2 className="text-3xl font-semibold mb-12">Everything you need</h2>
    <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
      <div className="p-6 border rounded-2xl">
        <h3 className="text-xl font-bold mb-2">AI Resume Builder</h3>
        <p className="text-gray-600">Create ATS-friendly resumes instantly</p>
      </div>
      <div className="p-6 border rounded-2xl">
        <h3 className="text-xl font-bold mb-2">Job Tracker</h3>
        <p className="text-gray-600">Track all your applications in one place</p>
      </div>
      <div className="p-6 border rounded-2xl">
        <h3 className="text-xl font-bold mb-2">Skill Gap Analyzer</h3>
        <p className="text-gray-600">Know exactly what to learn next</p>
      </div>
      <div className="p-6 border rounded-2xl">
        <h3 className="text-xl font-bold mb-2">Interview AI</h3>
        <p className="text-gray-600">Practice real interview questions with AI</p>
      </div>
    </div>
  </section>

  {/* SOCIAL PROOF */}
  <section className="py-16 px-6 bg-gray-50 text-center">
    <h2 className="text-2xl font-semibold mb-6">Trusted by students</h2>
    <p className="text-gray-600 mb-4">10,000+ users improving their careers</p>
    <div className="flex flex-col md:flex-row gap-4 justify-center">
      <div className="p-4 border rounded-xl">"Got 3 interviews in a week!"</div>
      <div className="p-4 border rounded-xl">"Best resume tool I used"</div>
      <div className="p-4 border rounded-xl">"Helped me stay organized"</div>
    </div>
  </section>

  {/* FINAL CTA */}
  <section className="py-20 px-6 text-center">
    <h2 className="text-3xl font-bold mb-6">
      Ready to get your first interview?
    </h2>
    <Link href="/dashboard">
      <button className="px-8 py-4 bg-black text-white rounded-2xl text-lg">
        Start Free Now
      </button>
    </Link>
  </section>

  {/* FOOTER */}
  <footer className="text-center py-6 border-t text-gray-500">
    © 2026 CareerAI. All rights reserved.
  </footer>
</main>

); }
