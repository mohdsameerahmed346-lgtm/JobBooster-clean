export default function ProfessionalTemplate({ data }) {
  return (
    <div className="w-[794px] min-h-[1123px] bg-white flex text-sm">
      <div className="w-1/3 bg-gray-900 text-white p-6 space-y-4">
        <h1 className="text-lg font-bold">{data.name}</h1>

        <div>
          <h2 className="text-xs uppercase opacity-70">Skills</h2>
          <ul className="mt-2 space-y-1">
            {data.skills.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-2/3 p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-gray-700">Summary</h2>
          <p className="text-gray-600">{data.summary}</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-700">Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mt-2">
              <div className="font-medium">{exp.role}</div>
              <div className="text-gray-500 text-xs">{exp.company}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
                }
