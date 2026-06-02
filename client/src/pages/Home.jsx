import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateRoomModal } from "@/components/shared/create-room-modal";
import { LanguageSelector } from "@/components/shared/language-selector";
import { getAllInterviews, deleteInterview } from "@/common/services";

export default function Home() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);

  // State for our search bar and language filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");

  const toggleCreateModal = () => {
    setCreateModalOpen((prevState) => !prevState);
  };

  //  Refactored fetch function so we can call it when filters change
  const fetchRooms = async (search, lang) => {
    const data = await getAllInterviews(search, lang);
    if (data) {
      setInterviews(data);
    }
  };

  const handleDelete = async (roomIdToDelete) => {
    // Optional: Ask the user to confirm before deleting!
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    const success = await deleteInterview(roomIdToDelete);
    if (success) {
      // Instantly remove it from the screen without refreshing the page!
      setInterviews((prev) =>
        prev.filter((room) => room.roomId !== roomIdToDelete),
      );
    }
  };

  // Whenever the page loads, OR when searchTerm/filterLanguage changes, fetch new data!
  useEffect(() => {
    // We use a slight delay (debounce) so it doesn't spam the database on every keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchRooms(searchTerm, filterLanguage);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterLanguage]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 text-white p-10 font-sans">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-4 mt-10 mb-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white">
          Live Code Sync
        </h1>
        <p className="text-lg text-zinc-400 max-w-lg">
          Create a secure, real-time collaborative coding room or join an
          existing session below.
        </p>
        <Button
          variant="default"
          size="lg"
          onClick={toggleCreateModal}
          className="mt-4 font-semibold"
        >
          Create New Room
        </Button>
      </div>

      {/*  The Filter Toolbar */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-4 mb-8 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <Input
          placeholder="Search rooms by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-zinc-900 border-zinc-700 text-white flex-grow"
        />

        {/* We use an empty string "" to represent "All Languages" */}
        <LanguageSelector
          language={filterLanguage}
          onLanguageChange={setFilterLanguage}
        />

        {/* Clear Filters Button */}
        {(searchTerm || filterLanguage) && (
          <Button
            variant="destructive"
            onClick={() => {
              setSearchTerm("");
              setFilterLanguage("");
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* The Dashboard Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.length > 0 ? (
          interviews.map((interview) => (
            <div
              key={interview._id}
              className="group flex flex-col justify-between p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 transition-all duration-300 shadow-md hover:shadow-xl hover:border-zinc-600"
            >
              <div>
                <h2 className="text-2xl font-bold text-zinc-100 truncate group-hover:text-blue-400 transition-colors">
                  {interview.roomName}
                </h2>

                <div className="mt-3 flex items-center gap-3">
                  <span className="bg-blue-900/30 text-blue-400 border border-blue-800/50 text-xs px-2.5 py-1 rounded-md uppercase font-bold tracking-wider">
                    {interview.language || "javascript"}
                  </span>

                  <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-md font-mono">
                    ID: {interview.roomId}
                  </span>
                </div>
              </div>

              <Link
                to={`/interview/${interview.roomId}`}
                className="mt-8 flex w-full items-center justify-center rounded-lg bg-white text-zinc-950 px-4 py-2.5 text-sm font-bold transition-transform active:scale-95 hover:bg-zinc-200"
              >
                Join Interview
              </Link>
              <Button
                variant="destructive"
                onClick={() => handleDelete(interview.roomId)}
                className="py-2.5"
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
            <p className="text-zinc-500 text-lg">
              No active rooms found matching your filters.
            </p>
          </div>
        )}
      </div>

      <CreateRoomModal isOpen={isCreateModalOpen} onClose={toggleCreateModal} />
    </div>
  );
}
