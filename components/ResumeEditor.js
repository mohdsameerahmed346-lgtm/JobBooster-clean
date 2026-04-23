"use client";

export default function ResumeEditor({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="glass p-6 rounded-xl">
        <input
          defaultValue={data.name}
          className="text-2xl font-bold bg-transparent w-full outline-none"
        />
        <input
          defaultValue={data.title}
          className="text-gray-400 bg-transparent w-full outline-none"
        />
      </div>

      {/* SUMMARY */}
      <Section title="Summary">
        <textarea
          defaultValue={data.summary}
          className="w-full bg-transparent outline-none"
        />
      </Section>

      {/* SKILLS */}
      <Section title="Skills">
        <div className="flex flex-wrap gap-2">
          {data.skills?.map((s, i) => (
            <span key={i} className="bg-blue-600/20 px-3 py-1 rounded">
              {s}
            </span>
          ))}
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section title="Experience">
        {data.experience?.map((exp, i) => (
          <div key={i} className="mb-4">
            <p className="font-semibold">
              {exp.role} - {exp.company}
            </p>
            <p className="text-sm text-gray-400">{exp.duration}</p>

            <ul className="list-disc pl-5">
              {exp.points?.map((p, j) => (
                <li key={j}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      {/* PROJECTS */}
      <Section title="Projects">
        {data.projects?.map((p, i) => (
          <div key={i}>
            <p className="font-semibold">{p.name}</p>
            <p className="text-gray-400">{p.description}</p>
          </div>
        ))}
      </Section>

      {/* EDUCATION */}
      <Section title="Education">
        {data.education?.map((e, i) => (
          <div key={i}>
            <p>{e.degree}</p>
            <p className="text-gray-400">{e.college}</p>
          </div>
        ))}
      </Section>

    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="glass p-6 rounded-xl">
      <h2 className="font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
            }
