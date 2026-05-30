import { useEffect, useState } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import socket from "@/lib/socket";

export default function Editor() {
  const [content, setContent] = useState(`// Welcome to Live Sync!
function helloWorld() {
  console.log("Hello, World!");
}`);

  useEffect(() => {
    socket.connect();
    socket.emit("join-room", "test-123");

    socket.on("update-code", (newContent) => {
      setContent(newContent);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleEditorChange = (value) => {
    setContent(value);
    socket.emit("code-change", { roomId: "test-123", content: value });
  };

  return (
    <main className="flex h-screen w-full flex-col bg-zinc-950 text-white">
      <header className="flex h-16 items-center border-b border-zinc-800 px-6">
        <h1 className="text-xl font-bold text-zinc-100">Live Code Sync</h1>
      </header>

      <div className="flex-grow pt-4">
        <MonacoEditor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={content}
          onChange={handleEditorChange}
          options={{ minimap: { enabled: false }, fontSize: 16 }}
        />
      </div>
    </main>
  );
}
