export default function CreativeTemplate({ data, order }) {
  return (
    <div className="p-6 bg-gradient-to-br from-purple-100 to-blue-100">
      <h1 className="text-3xl font-bold text-purple-700">
        {data.name}
      </h1>

      {order.map((section) => (
        <div key={section} className="mt-4 bg-white p-3 rounded shadow">
          <h2 className="text-purple-600 font-semibold">{section}</h2>

          {section === "summary" && <p>{data.summary}</p>}

          {section === "skills" &&
            data.skills.map((s, i) => <span key={i}>{s}, </span>)}

          {section === "experience" &&
            data.experience.map((e, i) => (
              <div key={i}>
                <b>{e.role}</b> @ {e.company}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
        }
