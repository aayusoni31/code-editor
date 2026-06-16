import { useEffect, useState } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import socket from "@/lib/socket";
import { LanguageSelector } from "@/components/shared/language-selector";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";

export default function Editor() {
  const { id } = useParams();
  const [language, setLanguage] = useState("javascript");
  const [content, setContent] = useState("// Welcome to Live Sync!\n");
  const [isSaving, setIsSaving] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true); // NEW

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const { data } = await axiosInstance.get(`/interview/${id}`);
        if (data) {
          if (data.code) setContent(data.code);
          if (data.language) setLanguage(data.language);
        }
      } catch (err) {
        console.error("Error fetching room data", err);
      }
    };
    fetchRoomData();

    socket.on("connect", () => {
      console.log("Socket connected!", socket.id);
      setIsConnecting(false);
      socket.emit("join-room", id); // only emit AFTER connection confirmed
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    socket.on("update-code", (newContent) => setContent(newContent));

    socket.connect(); // NOW connect — only when Editor mounts

    return () => {
      socket.off("connect"); // ✅ clean up listeners
      socket.off("connect_error");
      socket.off("update-code");
      socket.disconnect();
    };
  }, [id]);

  const handleEditorChange = (value) => {
    setContent(value);
    socket.emit("code-change", { roomId: id, content: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.put(`/interview/${id}`, { code: content, language });
      setTimeout(() => setIsSaving(false), 1000);
    } catch (err) {
      console.error("Error saving code", err);
      setIsSaving(false);
    }
  };

  const handleAIFix = async () => {
    setIsFixing(true);
    try {
      const response = await axiosInstance.post("/interview/ai/fix", {
        code: content,
        language,
      });
      if (response.data.fixedCode) {
        const cleanCode = response.data.fixedCode.trim();
        setContent(cleanCode);
        socket.emit("code-change", { roomId: id, content: cleanCode });
      }
    } catch (err) {
      alert("AI fixing failed. Check backend console!");
    } finally {
      setIsFixing(false);
    }
  };

  const runCode = async () => {
    if (["html", "css", "json"].includes(language)) {
      setOutput(
        `${language.toUpperCase()} cannot be executed in this terminal.`,
      );
      setIsError(true);
      return;
    }
    setIsRunning(true);
    setOutput("Executing code...\n");
    setIsError(false);
    try {
      const response = await axiosInstance.post("/interview/execute", {
        code: content,
        language,
      });
      const result = response.data;
      if (result.stderr) {
        setIsError(true);
        setOutput(result.stderr);
      } else {
        setIsError(false);
        setOutput(
          result.stdout || "Code executed successfully with no output.",
        );
      }
    } catch (error) {
      setIsError(true);
      setOutput("Failed to execute code. Check backend console.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <main className="flex h-screen w-full flex-col bg-zinc-950 text-white overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-zinc-100">Live Code Sync</h1>
          <span className="rounded bg-zinc-800 px-2 py-1 text-sm text-zinc-400">
            Room: {id}
          </span>
          {/* ✅ NEW — show connection status */}
          <span
            className={`text-xs px-2 py-1 rounded-full ${isConnecting ? "bg-yellow-900 text-yellow-400" : "bg-green-900 text-green-400"}`}
          >
            {isConnecting ? "⏳ Connecting..." : "🟢 Connected"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector
            language={language}
            onLanguageChange={setLanguage}
          />
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold"
          >
            {isRunning ? "Running..." : "▶ Run"}
          </Button>
          <Button
            onClick={handleAIFix}
            disabled={isFixing}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
          >
            {isFixing ? "✨ Fixing..." : "✨ AI Fix"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-500 text-white font-bold"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      <div className="flex-grow flex flex-col">
        <div className="h-[70%] pt-4 border-b border-zinc-800">
          <MonacoEditor
            height="100%"
            theme="vs-dark"
            language={language}
            value={content}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              quickSuggestions: true,
            }}
          />
        </div>
        <div className="h-[30%] bg-[#1e1e1e] p-4 flex flex-col">
          <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">
            Terminal Output
          </h3>
          <div
            className={`flex-grow bg-black rounded-md p-4 font-mono text-sm overflow-y-auto ${isError ? "text-red-400 border border-red-900/50" : "text-green-400"}`}
          >
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {output || 'Click "▶ Run" to see the output here...'}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
