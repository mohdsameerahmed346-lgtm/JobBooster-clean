"use client";

export default function ResumeTemplateMinimal({ data }) {
  return (
    <div id="resume-preview" className="bg-white text-black p-8 max-w-3xl mx-auto">

      <h1 className="text-2xl font-semibold">{data.name}</h1>
      <p className="text-gray-500 mb-6">{data.title}</p>

      <p className="mb-6">{data.summary}</p>

      <h2 className="font-semibold mb-2">Skills</h2>
      <p className="mb-4">{data.skills?.join(", ")}</p>

      <h2 className="font-semibold mb-2">Experience</h2>
      {data.experience?.map((exp, i) => (
        <div key={i} className="mb-3">
          <p>{exp.role} @ {exp.company}</p>
          <p className="text-sm text-gray-400">{exp.duration}</p>
        </div>
      ))}

    </div>
  );
                                              }
