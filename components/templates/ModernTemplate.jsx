"use client";

export default function ModernTemplate({ data = {}, order = [] }) {

  // ✅ SAFE FALLBACKS (Fixes includes error)
  const name = data?.name || "Your Name";
  const summary = data?.summary || "Write a strong summary...";
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  const experience = Array.isArray(data?.experience) ? data.experience : [];

  // 📌 Render Sections Dynamically (for drag & drop order)
  const renderSection = (section) => {

    switch (section) {

      case "summary":
        return (
          <div key="summary" className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">
              Profile
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {summary}
            </p>
          </div>
        );

      case "skills":
        return (
          <div key="skills" className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.length === 0 ? (
                <span className="text-gray-400 text-sm">
                  Add skills
                </span>
              ) : (
                skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 text-xs px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
        );

      case "experience":
        return (
          <div key="experience" className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-1 mb-2">
              Experience
            </h2>

            {experience.length === 0 && (
              <p className="text-gray-400 text-sm">
                Add experience
              </p>
            )}

            {experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="font-medium text-sm">
                  {exp?.role || "Role"}
                </div>
                <div className="text-xs text-gray-500">
                  {exp?.company || "Company"}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-[794px] min-h-[1123px] bg-white text-gray-900 shadow-lg flex">

      {/* LEFT SIDEBAR (Resume.io style) */}
      <div className="w-[30%] bg-gray-900 text-white p-6 space-y-6">

        {/* NAME */}
        <div>
          <h1 className="text-xl font-bold leading-tight">
            {name}
          </h1>
        </div>

        {/* SKILLS IN SIDEBAR */}
        <div>
          <h2 className="text-sm uppercase tracking-wide mb-2">
            Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {skills.length === 0 ? (
              <span className="text-gray-400 text-xs">
                Add skills
              </span>
            ) : (
              skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-white/20 text-xs px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>

      </div>

      {/* RIGHT CONTENT */}
      <div className="w-[70%] p-8">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{name}</h1>
        </div>

        {/* DYNAMIC ORDER */}
        {(order.length ? order : ["summary", "experience"]).map((sec) =>
          renderSection(sec)
        )}

      </div>

    </div>
  );
    }
