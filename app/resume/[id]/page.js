import { db } from "@/lib/firebase-admin";

export default async function ResumePage({ params }) {
  const doc = await db.collection("shared_resumes").doc(params.id).get();

  if (!doc.exists) return <div>Not found</div>;

  const data = doc.data();

  return (
    <div className="p-10 bg-white">
      <h1 className="text-2xl font-bold">{data.resume.name}</h1>
      <p>{data.resume.summary}</p>
    </div>
  );
}
