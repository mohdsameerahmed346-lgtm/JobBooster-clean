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
  };

  // ✨ TYPING EFFECT
  const typeEffect = (fullData) => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayData((prev) => ({
        ...fullData,
        missingKeywords: fullData.missingKeywords.slice(0, i),
      }));
      i++;
      if (i > fullData.missingKeywords.length) clearInterval(interval);
    }, 150);
  };

  // 🤖 ANALYZE
  const analyze = async () => {
    if (!file) return alert("Upload a resume");

    setLoading(true);
    setData(null);
    setDisplayData(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/skill-gap", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();

    setData(json);
    typeEffect(json);

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

      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelect={(c) => {
          setActiveChat(c);
          setDisplayData(c.messages?.slice(-1)[0]?.content || null);
        }}
        onNew={handleNewChat}
      />

      <div className="flex-1 p-8 space-y-8 overflow-y-auto">

        <h1 className="text-2xl font-bold">Resume Analyzer</h1>

        {/* UPLOAD */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#020617] border border-gray-800 p-6 rounded-2xl"
        >
          <div className="flex gap-4">
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
        </motion.div>

        {/* LOADING SKELETON */}
        {loading && <Skeleton />}

        {/* RESULTS */}
        {displayData && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >

            <div className="grid md:grid-cols-2 gap-6">
              <ScoreCard title="Resume Score" value={displayData.score} />
              <ScoreCard title="ATS Score" value={displayData.ats} />
            </div>

            {/* KEYWORDS */}
            <div className="bg-[#020617] border border-gray-800 p-6 rounded-2xl">
              <h2 className="mb-3">Missing Keywords</h2>

              <div className="flex flex-wrap gap-2">
                {displayData.missingKeywords?.map((k, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-sm"
                  >
                    {k}
                  </motion.span>
                ))}
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
    }
