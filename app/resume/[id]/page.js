"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

import ModernTemplate from "../../../components/templates/ModernTemplate";
import MinimalTemplate from "../../../components/templates/MinimalTemplate";
import CreativeTemplate from "../../../components/templates/CreativeTemplate";

export default function PublicResume({ params }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "resumes", params.id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setData(snap.data());
      }
    };

    load();
  }, []);

  if (!data) return <p>Loading...</p>;

  const props = {
    data: data.resume,
    order: data.layout,
  };

  if (data.template === "minimal") return <MinimalTemplate {...props} />;
  if (data.template === "creative") return <CreativeTemplate {...props} />;

  return <ModernTemplate {...props} />;
    }
