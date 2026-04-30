export default function MinimalTemplate({ data, order }) {
  return (
    <div className="p-6 text-sm">
      <h1 className="text-xl">{data.name}</h1>

      {order.map((section) => (
        <div key={section} className="mt-4">
          <h2 className="uppercase text-xs text-gray-400">{section}</h2>

          {section === "summary" && <p>{data.summary}</p>}

          {section === "skills" &&
            data.skills.map((s, i) => <p key={i}>• {s}</p>)}

          {section === "experience" &&
            data.experience.map((e, i) => (
              <p key={i}>
                {e.role} - {e.company}
              </p>
            ))}
        </div>
      ))}
    </div>
  );
        }
