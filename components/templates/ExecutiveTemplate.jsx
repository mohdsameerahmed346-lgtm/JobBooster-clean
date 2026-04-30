export default function ExecutiveTemplate({ data }) {
  return (
    <div className="w-[794px] min-h-[1123px] bg-white p-8 text-sm">

      <h1 className="text-2xl font-bold text-center">{data.name}</h1>

      <div className="mt-6">
        <h2 className="border-b pb-1 font-semibold">Summary</h2>
        <p className="mt-2 text-gray-700">{data.summary}</p>
      </div>

      <div className="mt-6">
        <h2 className="border-b pb-1 font-semibold">Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="mt-3">
            <div className="font-semibold">{exp.role}</div>
            <div className="text-gray-500 text-xs">{exp.company}</div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="border-b pb-1 font-semibold">Skills</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.skills.map((s, i) => (
            <span key={i} className="border px-2 py-1 text-xs">
              {s}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
