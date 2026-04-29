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
  updateChatTitle,
  deleteChat,
  renameChat,
} from "../../../lib/chat";

export default function SkillGap() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const [messages, setMessages] = useState([]);

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

        if (allChats.length) {
          setActiveChat(allChats[0]);
          setMessages(allChats[0].messages || []);
        }
      }
    });

    return () => unsub();
  }, []);

  // ➕ NEW CHAT
  const handleNewChat = async () => {
    if (!user) return;

    const id = await createChat(user.uid);

    const newChat = {
      id,
      title: "New Chat",
      messages: [],
    };

    setChats([newChat, ...chats]);
    setActiveChat(newChat);
    setMessages([]);
    setData(null);
    setDisplayData(null);
  };

  // ❌ DELETE CHAT
  const handleDelete = async (chatId) => {
    if (!user) return;

    await deleteChat(user.uid, chatId);

    const updated = chats.filter((c) => c.id !== chatId);
    setChats(updated);

    if (activeChat?.id === chatId) {
      const next = updated[0] || null;
      setActiveChat(next);
      setMessages(next?.messages || []);
      setDisplayData(null);
    }
  };

  // ✏️ RENAME CHAT
  const handleRename = async (chatId, title) => {
    if (!user || !title.trim()) return;

    await renameChat(user.uid, chatId, title);

    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, title } : c
      )
    );
  };

  // 🧠 TITLE GENERATOR
  const generateTitle = (text) => {
    if (!text) return "New Chat";
    return text.split("\n")[0].slice(0, 30);
  };

  // ✨ SAFE TYPING EFFECT
  const typeEffect = (fullData) => {
    if (!fullData?.missingSkills?.length) {
      setDisplayData(fullData);
      return;
    }

    let i = 0;

    const interval = setInterval(() => {
      setDisplayData({
        ...fullData,
        missingSkills: fullData.missingSkills.slice(0, i),
      });

      i++;
      if (i > fullData.missingSkills.length) clearInterval(interval);
    }, 80);
  };

  // 🤖 ANALYZE
  const analyze = async () => {
    if (!job.trim()) return alert("Job description required");
    if (!activeChat) return alert("Create a chat first");

    setLoading(true);
    setData(null);
    setDisplayData(null);

    try {
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
        score: json.resumeScore || json.matchPercentage || 0,
        ats: json.atsScore || 0,
      };

      setData(safeData);
      typeEffect(safeData);

      // 💾 SAVE CHAT
      if (user && activeChat) {
        const updatedMessages = [
          ...messages,
          { role: "assistant", content: safeData },
        ];

        setMessages(updatedMessages);

        await saveMessages(user.uid, activeChat.id, updatedMessages);

        const title = generateTitle(job);
        await updateChatTitle(user.uid, activeChat.id, title);

        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChat.id ? { ...c, title } : c
          )
        );
      }
    } catch (err) {
      alert("Analysis failed");
    }

    setLoading(false);
  };

  // 🚀 FIX RESUME (AUTO CONNECT TO ANALYZE PAGE)
  const handleFixResume = () => {
    if (!displayData) return;

    const payload = {
      job,
      skills,
      missingSkills: displayData.missingSkills || [],
    };

    localStorage.setItem("fixData", JSON.stringify(payload));

    // smooth redirect
    window.location.href = "/analyze";
  };

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelect={(c) => {
          setActiveChat(c);

          const msgs = c.messages || [];
          setMessages(msgs);

          const last = msgs
            .slice()
            .reverse()
            .find((m) => m.role === "assistant");

          setDisplayData(last?.content || null);
        }}
        onNew={handleNewChat}
        onDelete={handleDelete}
        onRename={handleRename}
      />

      {/* MAIN */}
      <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">

        <h1 className="text-2xl font-bold">
          Skill Gap Analyzer
        </h1>

        {/* INPUT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#020617] border border-gray-800 p-5 rounded-xl space-y-4"
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

          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={analyze} className="btn-primary">
              Analyze
            </button>
          </div>
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
            {/* SCORE */}
            <div className="grid md:grid-cols-3 gap-6">
              <ScoreCard title="Match %" value={displayData.matchPercentage} />
              <ScoreCard title="Resume Score" value={displayData.score} />
              <ScoreCard title="ATS Score" value={displayData.ats} />
            </div>

            {/* MISSING SKILLS */}
            <div className="card">
              <h2>Missing Skills</h2>

              <div className="flex flex-wrap gap-2 mt-2">
                {displayData.missingSkills.length ? (
                  displayData.missingSkills.map((k, i) => (
                    <span
                      key={i}
                      className="bg-red-500/10 text-red-400 px-2 py-1 rounded"
                    >
                      {k}
                    </span>
                  ))
                ) : (
                  <p>No major gaps 🎉</p>
                )}
              </div>
            </div>

            {/* 🚀 FIX BUTTON */}
            <button
              onClick={handleFixResume}
              className="btn-primary w-full text-lg"
            >
              🚀 Fix Resume with AI
            </button>

          </motion.div>
        )}
      </div>
    </div>
  );
      }
