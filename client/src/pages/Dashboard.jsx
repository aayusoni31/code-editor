// client/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateRoomModal } from "@/components/shared/create-room-modal";
import { LanguageSelector } from "@/components/shared/language-selector";
import { getAllInterviews, deleteInterview } from "@/common/services";

export default function Dashboard() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");

  const toggleCreateModal = () => setCreateModalOpen((prev) => !prev);

  const fetchRooms = async (search, lang) => {
    const data = await getAllInterviews(search, lang);
    if (data) setInterviews(data);
  };

  const handleDelete = async (roomIdToDelete) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    const success = await deleteInterview(roomIdToDelete);
    if (success) {
      setInterviews((prev) =>
        prev.filter((room) => room.roomId !== roomIdToDelete),
      );
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRooms(searchTerm, filterLanguage);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterLanguage]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 text-white p-10 font-sans">
      {/* Dashboard Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mt-10 mb-8 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Workspaces</h1>
          <p className="text-zinc-400 mt-1">
            Manage your active coding sessions.
          </p>
        </div>
        <Button
          onClick={toggleCreateModal}
          className="bg-indigo-600 hover:bg-indigo-500 font-semibold"
        >
          + Create Room
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-4 mb-8 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <Input
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-zinc-900 border-zinc-700 text-white flex-grow"
        />
        <LanguageSelector
          language={filterLanguage}
          onLanguageChange={setFilterLanguage}
        />
        {(searchTerm || filterLanguage) && (
          <Button
            variant="ghost"
            className="text-red-400"
            onClick={() => {
              setSearchTerm("");
              setFilterLanguage("");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* The Dashboard Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.length > 0 ? (
          interviews.map((interview) => (
            <div
              key={interview._id}
              className="group flex flex-col justify-between p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 transition-all"
            >
              <div>
                <h2 className="text-2xl font-bold text-zinc-100 truncate">
                  {interview.roomName}
                </h2>
                <div className="mt-3 flex gap-3">
                  <span className="text-blue-400 text-xs font-bold uppercase">
                    {interview.language || "javascript"}
                  </span>
                  <span className="text-zinc-500 text-xs font-mono">
                    ID: {interview.roomId}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-8">
                <Link
                  to={`/interview/${interview.roomId}`}
                  className="flex-1 text-center rounded-lg bg-white text-black px-4 py-2 font-bold hover:bg-zinc-200"
                >
                  Join
                </Link>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(interview.roomId)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-zinc-500 col-span-full text-center py-10">
            No rooms found.
          </p>
        )}
      </div>

      <CreateRoomModal isOpen={isCreateModalOpen} onClose={toggleCreateModal} />
    </div>
  );
}
