"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Sidebar from "../../../components/Sidebar";
import ScoreCard from "../../../components/ScoreCard";
import Skeleton from "../../../components/Skeleton";

import {
  createChat,
  getChats,
  saveMessages,
} from "../../../lib/chat";

export default function SkillGap() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const [job, setJob] = useState("");
  const [skills, setSkills] = useState("");
  const [file, setFile] = useState(null);

  const [data, setData] = useState(null);
  const [displayData, setDisplayData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔐 AUTH
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        window.location.href = "/login";
      } else {
        setUser(u);

        const allChats = await getChats(u.uid);
        setChats(allChats);

        if (allChats.length) setActiveChat(allChats[0]);
      }
    });

    return () => unsub();
  }, []);

  // ➕ NEW CHAT
  const handleNewChat = async () => {
    const id = await createChat(user.uid);

    const newChat = {
      id,
      title: "New Chat",
      messages: [],
    };

    setChats([newChat, ...chats]);
    setActiveChat(newChat);
    setData(null);
    setDisplayData(null);
  };

  // ✨ TYPING EFFECT (FOR MISSING SKILLS)
  const typeEffect = (fullData) => {
    let i = 0;

    const interval = setInterval(() => {
      setDisplayData({
        ...fullData,
        missingSkills: fullData.missingSkills.slice(0, i),
      });

      i++;
      if (i > fullData.missingSkills.length) clearInterval(interval);
    }, 120);
  };

  // 🤖 ANALYZE
  const analyze = async () => {
    if (!job.trim()) return alert("Job description required");

    setLoading(true);
    setData(null);
    setDisplayData(null);

    const formData = new FormData();
    formData.append("job", job);
    formData.append("skills", skills);

    if (file) formData.append("file", file);
    if (user) formData.append("userId", user.uid);

    const res = await fetch("/api/skill-gap", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    const safeData = {
      matchPercentage: json.matchPercentage || 0,
      matchedSkills: json.matchedSkills || [],
      missingSkills: json.missingSkills || [],
      recommendedSkills: json.recommendedSkills || [],
      learningPlan: json.learningPlan || [],

      // backward compatibility
      score: json.resumeScore || json.matchPercentage || 0,
      ats: json.atsScore || 0,
    };

    setData(safeData);
    typeEffect(safeData);

    // 💾 SAVE IN CHAT
    if (user && activeChat) {
      const messages = [
        ...(activeChat.messages || []),
        {
          role: "assistant",
          content: safeData,
        },
      ];

      await saveMessages(user.uid, activeChat.id, messages);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelect={(c) => {
          setActiveChat(c);
          setDisplayData(
            c.messages?.slice(-1)[0]?.content || null
          );
        }}
        onNew={handleNewChat}
      />

      {/* MAIN */}
      <div className="flex-1 p-8 space-y-8 overflow-y-auto">

        <h1 className="text-2xl font-bold">Skill Gap Analyzer</h1>

        {/* INPUT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#020617] border border-gray-800 p-6 rounded-2xl space-y-4"
        >

          <textarea
            value={job}
            onChange={(e) => setJob(e.target.value)}
            placeholder="Paste job description..."
            rows={5}
            className="input"
          />

          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Enter your skills (optional)"
            rows={3}
            className="input"
          />

          <div className="flex gap-4 items-center">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              onClick={analyze}
              className="btn-primary"
            >
              Analyze
            </button>
          </div>

          <p className="text-yellow-400 text-sm">
            ⚠️ Upload simple PDF (Word/Docs). Canva/scanned may fail.
          </p>
        </motion.div>

        {/* LOADING */}
        {loading && <Skeleton />}

        {/* RESULTS */}
        {displayData && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >

            {/* SCORES */}
            <div className="grid md:grid-cols-3 gap-6">
              <ScoreCard title="Match %" value={displayData.matchPercentage} />
              <ScoreCard title="Resume Score" value={displayData.score} />
              <ScoreCard title="ATS Score" value={displayData.ats} />
            </div>

            {/* MATCHED */}
            <div className="card">
              <h2 className="mb-3">Matched Skills</h2>
              <div className="flex flex-wrap gap-2">
                {displayData.matchedSkills.map((k, i) => (
                  <span key={i} className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* MISSING */}
            <div className="card">
              <h2 className="mb-3">Missing Skills</h2>
              <div className="flex flex-wrap gap-2">
                {displayData.missingSkills.map((k, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm"
                  >
                    {k}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* RECOMMENDED */}
            <div className="card">
              <h2 className="mb-3">Recommended Skills</h2>
              <p>{displayData.recommendedSkills.join(", ")}</p>
            </div>

            {/* LEARNING PLAN */}
            <div className="card">
              <h2 className="mb-3">Learning Plan</h2>
              <ul className="list-disc pl-5">
                {displayData.learningPlan.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
    }
