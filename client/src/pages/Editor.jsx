import { useEffect, useState } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import socket from "@/lib/socket";
import { LanguageSelector } from "@/components/shared/language-selector";
import { Button } from "@/components/ui/button"; // 1. Import your Shadcn button!
import axiosInstance from "@/lib/axios"; // 2. Import your axios instance!

export default function Editor() {
  const { id } = useParams();
  const [language, setLanguage] = useState("javascript");
  const [content, setContent] = useState("// Welcome to Live Sync!\n");
  const [isSaving, setIsSaving] = useState(false); // Tracks the loading state

  useEffect(() => {
    // 3. Fetch existing code from MongoDB when you enter the room
    const fetchRoomData = async () => {
      try {
        const { data } = await axiosInstance.get(`/interview/${id}`);
        if (data) {
          if (data.code) setContent(data.code);
          // NEW: Load the saved language!
          if (data.language) setLanguage(data.language);
        }
      } catch (err) {
        console.error("Error fetching room data", err);
      }
    };
    fetchRoomData();

    socket.connect();
    socket.emit("join-room", id);

    socket.on("update-code", (newContent) => {
      setContent(newContent);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleEditorChange = (value) => {
    setContent(value);
    socket.emit("code-change", { roomId: id, content: value });
  };

  // 4. The Save Function!
  // const handleSave = async () => {
  //   setIsSaving(true);
  //   try {
  //     await axiosInstance.put(`/interview/${id}`, { code: content });
  //     setTimeout(() => setIsSaving(false), 1000); // Visual feedback
  //   } catch (err) {
  //     console.error("Error saving code", err);
  //     setIsSaving(false);
  //   }
  // };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // NEW: Send the current language state to the backend!
      await axiosInstance.put(`/interview/${id}`, { code: content, language });
      setTimeout(() => setIsSaving(false), 1000);
    } catch (err) {
      console.error("Error saving code", err);
      setIsSaving(false);
    }
  };
  return (
    <main className="flex h-screen w-full flex-col bg-zinc-950 text-white">
      <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-zinc-100">Live Code Sync</h1>
          <span className="rounded bg-zinc-800 px-2 py-1 text-sm text-zinc-400">
            Room: {id}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector
            language={language}
            onLanguageChange={setLanguage}
          />
          {/* 5. The new Save Button */}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-500 text-white font-bold"
          >
            {isSaving ? "Saving..." : "Save Snippet"}
          </Button>
        </div>
      </header>

      <div className="flex-grow pt-4">
        <MonacoEditor
          height="100%"
          theme="vs-dark"
          language={language}
          value={content}
          onChange={handleEditorChange}
          options={{ minimap: { enabled: false }, fontSize: 16 }}
        />
      </div>
    </main>
  );
}
