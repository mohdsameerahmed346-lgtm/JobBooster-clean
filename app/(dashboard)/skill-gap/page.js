"use client";

import { useState, useEffect } from "react";
import { auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Sidebar from "../../../components/Sidebar";
import ScoreCard from "../../../components/ScoreCard";

import {
  createChat,
  getChats,
  saveMessages,
} from "../../../lib/chat";

export default function SkillGap() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
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

        if (allChats.length) {
          setActiveChat(allChats[0]);
        }
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
  };

  // 🤖 ANALYZE
  const analyze = async () => {
    if (!file) return alert("Upload a resume");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/skill-gap", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    setData(json);

    if (user && activeChat) {
      const messages = [
        ...(activeChat.messages || []),
        { role: "assistant", content: json },
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
          setData(c.messages?.slice(-1)[0]?.content || null);
        }}
        onNew={handleNewChat}
      />

      {/* MAIN */}
      <div className="flex-1 p-8 space-y-8 overflow-y-auto">

        <h1 className="text-2xl font-bold">Resume Analyzer</h1>

        {/* UPLOAD CARD */}
        <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl shadow-xl space-y-4">

          <h2 className="text-lg font-semibold">Upload Resume</h2>

          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              onClick={analyze}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-xl"
            >
              Analyze
            </button>
          </div>

          <p className="text-yellow-400 text-xs">
            Use simple PDF (Word/Docs). Canva resumes may fail.
          </p>

        </div>

        {/* LOADING */}
        {loading && <p className="text-gray-400">Analyzing...</p>}

        {/* RESULTS */}
        {data && (
          <div className="space-y-6">

            {/* SCORES */}
            <div className="grid md:grid-cols-2 gap-6">
              <ScoreCard title="Resume Score" value={data.score} />
              <ScoreCard title="ATS Score" value={data.ats} />
            </div>

            {/* KEYWORDS */}
            <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="font-semibold mb-3">Missing Keywords</h2>

              <div className="flex flex-wrap gap-2">
                {data.missingKeywords?.map((k, i) => (
                  <span
                    key={i}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-sm"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* SUGGESTIONS */}
            <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="font-semibold mb-3">Improvement Suggestions</h2>

              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Skills:</strong> {data.sectionFeedback?.skills}</p>
                <p><strong>Experience:</strong> {data.sectionFeedback?.experience}</p>
                <p><strong>Projects:</strong> {data.sectionFeedback?.projects}</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
  }
