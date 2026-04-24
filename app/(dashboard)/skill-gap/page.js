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
    <div className="flex">

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
      <div className="flex-1 p-6 space-y-6">

        <h1 className="text-xl font-bold">Resume Analyzer</h1>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={analyze} className="btn-primary">
          Analyze
        </button>

        {loading && <p>Analyzing...</p>}

        {data && (
          <div className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <ScoreCard title="Score" value={data.score} />
              <ScoreCard title="ATS" value={data.ats} />
            </div>

            <div>
              <h2>Missing Keywords</h2>
              {data.missingKeywords?.map((k, i) => (
                <span key={i}>{k} </span>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
