export default function Home() {
  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>🚀 JobBoost AI</h1>
      <p>India’s AI Career Platform</p>

      <a href="/login">
        <button style={{ padding: "10px 20px", margin: "10px" }}>
          Login
        </button>
      </a>

      <a href="/dashboard">
        <button style={{ padding: "10px 20px" }}>
          Go Dashboard
        </button>
      </a>

      <h3 style={{ marginTop: "40px" }}>💰 Pricing</h3>
      <p>Free → Basic tools</p>
      <p>Pro ₹299 → PDF + Analyzer</p>
    </main>
  );
  }
