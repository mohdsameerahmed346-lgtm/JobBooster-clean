"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function MatchChart({ match }) {
  const data = [
    { name: "Match", value: match },
    { name: "Gap", value: 100 - match },
  ];

  return (
    <div className="h-60">

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={80}
          >
            <Cell />
            <Cell />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <p className="text-center -mt-32 text-2xl font-bold">
        {match}%
      </p>

    </div>
  );
              }
