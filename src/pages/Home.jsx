// src/pages/Home.jsx

import React, { useState, useEffect, useRef } from "react";
import { FiMessageSquare, FiSave, FiClock } from "react-icons/fi";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc, // Import doc for specific document references
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { GoogleGenerativeAI } from "@google/generative-ai";

function Home() {
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [savedChats, setSavedChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);
  const bottomRef = useRef(null);
  const uid = auth?.currentUser?.uid || "guest"; // fallback for demo

  // --- 1. Function to Initialize Gemini Chat Session ---
  // We use the model in this function so we don't need to define it as a dependency.
  const initializeChatSession = (loadedMessages) => {
    console.log("Initializing Gemini Chat Session with history...");

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });



    // Transform Firestore messages into the format required by the Gemini API history
    const history = loadedMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user", // API uses 'model' for assistant role
      parts: [{ text: m.text }],
    }));

    // Create the chat session with the conversation history and a system instruction
const newChat = model.startChat({
  history: history,
  systemInstruction: {
    role: "system",
    parts: [
      {
        text: "You are PitchCraft AI — a friendly startup assistant. Reply naturally and conversationally.",
      },
    ],
  },
});

    chatRef.current = newChat;
    console.log("Gemini Chat Session Initialized with", history.length, "messages.");
  };
  
  // --- 2. Load Saved Chats List ---
  useEffect(() => {
    const q = query(
      collection(db, "users", uid, "chats"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSavedChats(list);
      // Automatically set the first chat as active if none is selected
      if (!activeChatId && list.length) {
        setActiveChatId(list[0].id);
      } else if (!activeChatId && list.length === 0) {
        // If there are no chats, make sure activeChatId is null
        setActiveChatId(null);
      }
    });
    return () => unsub();
  }, [uid, activeChatId]);

  // --- 3. Load Messages for Current Chat & Re-initialize Gemini Session ---
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      chatRef.current = null; // Clear chat session
      return;
    }

    // Set up real-time listener for messages
    const messagesCollectionRef = collection(db, "users", uid, "chats", activeChatId, "messages");
    const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));
    
    const unsub = onSnapshot(q, (snap) => {
      const loadedMessages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(loadedMessages);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });

      // 💡 If there are messages, re-initialize the Gemini session with the latest history
      if (loadedMessages.length > 0) {
        initializeChatSession(loadedMessages);
      } else if (activeChatId) {
        // This case handles a brand new chat document with no messages yet
        initializeChatSession([]);
      }
    });

    return () => unsub();
  }, [uid, activeChatId]); // Only runs when uid or activeChatId changes

  // --- 4. Function to Send Prompt ---
async function sendPrompt() {
  if (!prompt.trim() || isLoading) return;

  setIsLoading(true);
  const userPrompt = prompt;
  let chatId = activeChatId;
  setPrompt("");

  try {
    // --- Create a new chat if none exists ---
    if (!chatId) {
      const chatRefNew = await addDoc(collection(db, "users", uid, "chats"), {
        title: userPrompt.slice(0, 40) + "...",
        createdAt: Date.now(),
      });
      chatId = chatRefNew.id;
      setActiveChatId(chatId);
      initializeChatSession([]);
    }

    // --- Save user message in Firestore ---
    const messagesCollectionRef = collection(db, "users", uid, "chats", chatId, "messages");
    await addDoc(messagesCollectionRef, {
      role: "user",
      text: userPrompt,
      createdAt: Date.now(),
    });

    // --- Ensure chat session exists ---
    if (!chatRef.current) {
      initializeChatSession(messages);
    }

    console.log("📤 Sending message to Gemini:", userPrompt);

    // ✅ Correct usage — pass text directly
    const result = await chatRef.current.sendMessage(userPrompt);

    // ✅ Safely extract AI response
    const responseText = await result.response.text();

    console.log("🤖 Gemini reply:", responseText);

    // --- Save AI reply ---
    await addDoc(messagesCollectionRef, {
      role: "assistant",
      text: responseText,
      createdAt: Date.now(),
    });

  } catch (error) {
    console.error("🔥 Gemini/Firebase Error:", error);
    if (chatId) {
      const messagesCollectionRef = collection(db, "users", uid, "chats", chatId, "messages");
      await addDoc(messagesCollectionRef, {
        role: "assistant",
        text: `⚠️ Error getting AI response: ${error.message}.`,
        createdAt: Date.now(),
      });
    }
  } finally {
    setIsLoading(false);
  }
}


  // --- 5. Component Render ---
  return (
    <div className="h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <div className="space-y-6 mt-2">
          <FiMessageSquare className="text-2xl text-gray-600 hover:text-blue-600 cursor-pointer" />
          <FiSave className="text-2xl text-gray-600 hover:text-blue-600 cursor-pointer" />
          <FiClock className="text-2xl text-gray-600 hover:text-blue-600 cursor-pointer" />
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        <header className="p-4 border-b bg-white flex items-center justify-between">
          <h1 className="text-lg font-semibold">Pitch Craft</h1>
          <div className="text-sm text-gray-600">Noman Rahim</div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-2xl p-3 rounded-lg shadow-sm ${
                m.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "bg-white border text-gray-800"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          ))}
          {/* Show a typing indicator if loading */}
          {isLoading && (
            <div className="max-w-2xl p-3 rounded-lg shadow-sm bg-white border text-gray-800">
              <span className="animate-pulse">AI is thinking...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t bg-white flex items-center gap-3 sticky bottom-0">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Type "connect tutors with students"...'
            className="flex-1 rounded-full border px-4 py-2 text-sm focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) sendPrompt();
            }}
            disabled={isLoading}
          />
          <button
            onClick={sendPrompt}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              (isLoading || !prompt.trim())
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </main>

      {/* Saved Chats */}
      <aside className="w-64 border-l bg-white hidden md:block">
        <div className="p-4 font-semibold border-b">Saved Chats</div>
        <div className="p-3 space-y-2 overflow-y-auto h-full">
          {savedChats.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveChatId(c.id)}
              className={`p-2 rounded-md cursor-pointer ${
                c.id === activeChatId ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <div className="truncate">{c.title}</div>
              <div className="text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div
            onClick={() => setActiveChatId(null)}
            className={`p-2 rounded-md cursor-pointer text-blue-600 font-medium hover:bg-gray-50 ${
                activeChatId === null ? "bg-blue-50 text-blue-700" : ""
            }`}
          >
            + Start New Chat
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Home;