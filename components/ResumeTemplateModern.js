"use client";

export default function ResumeTemplateModern({ data }) {
  return (
    <div id="resume-preview" className="bg-white text-black p-8 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold">{data.name}</h1>
      <p className="text-gray-600 mb-4">{data.title}</p>

      <Section title="Summary">
        <p>{data.summary}</p>
      </Section>

      <Section title="Skills">
        <div className="flex flex-wrap gap-2">
          {data.skills?.map((s, i) => (
            <span key={i} className="bg-gray-200 px-2 py-1 rounded">
              {s}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Experience">
        {data.experience?.map((exp, i) => (
          <div key={i} className="mb-3">
            <p className="font-semibold">{exp.role} - {exp.company}</p>
            <p className="text-sm text-gray-500">{exp.duration}</p>
            <ul className="list-disc pl-5">
              {exp.points?.map((p, j) => (
                <li key={j}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section title="Projects">
        {data.projects?.map((p, i) => (
          <div key={i}>
            <p className="font-semibold">{p.name}</p>
            <p>{p.description}</p>
          </div>
        ))}
      </Section>

      <Section title="Education">
        {data.education?.map((e, i) => (
          <div key={i}>
            <p>{e.degree}</p>
            <p className="text-gray-500">{e.college}</p>
          </div>
        ))}
      </Section>

    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h2 className="font-bold border-b pb-1 mb-2">{title}</h2>
      {children}
    </div>
  );
    }
