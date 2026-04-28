export default function ModernTemplate({ data, order }) {
  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold">{data.name}</h1>

      {order.includes("summary") && (
        <div className="mt-3">
          <h2 className="font-semibold">Summary</h2>
          <p>{data.summary}</p>
        </div>
      )}

      {order.includes("skills") && (
        <div className="mt-3">
          <h2 className="font-semibold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s, i) => (
              <span key={i} className="bg-gray-200 px-2 py-1 rounded">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {order.includes("experience") && (
        <div className="mt-3">
          <h2 className="font-semibold">Experience</h2>
          {data.experience.map((e, i) => (
            <div key={i}>
              <p className="font-medium">{e.role}</p>
              <p className="text-sm text-gray-500">{e.company}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
    }
