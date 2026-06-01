import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // React Router's version of Link
import { Button } from "@/components/ui/button";
import { CreateRoomModal } from "@/components/shared/create-room-modal";
import { getAllInterviews } from "@/common/services"; // Import the fetch function

export default function Home() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // 1. Add state to hold the rooms we fetch from the database
  const [interviews, setInterviews] = useState([]);

  const toggleCreateModal = () => {
    setCreateModalOpen((prevState) => !prevState);
  };

  // 2. Fetch the data the moment the Home page loads (replaces TanStack's loader)
  useEffect(() => {
    const fetchRooms = async () => {
      const data = await getAllInterviews();
      if (data) {
        setInterviews(data);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 text-white p-10 font-sans">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-4 mt-10 mb-12 text-center">
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
          + Create New Room
        </Button>
      </div>

      {/* The Dashboard Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* If we have rooms, map through them and display beautiful cards */}
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
                {/* <div className="mt-2 flex items-center gap-2">
                  <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded">
                    Room ID: {interview.roomId}
                  </span>
                </div> */}
                <div className="mt-3 flex items-center gap-3">
                  {/* The new dynamic language badge */}
                  <span className="bg-blue-900/30 text-blue-400 border border-blue-800/50 text-xs px-2.5 py-1 rounded-md uppercase font-bold tracking-wider">
                    {interview.language || "javascript"}
                  </span>

                  <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-md font-mono">
                    ID: {interview.roomId}
                  </span>
                </div>
              </div>

              {/* React Router standard dynamic link */}
              <Link
                to={`/interview/${interview.roomId}`}
                className="mt-8 flex w-full items-center justify-center rounded-lg bg-white text-zinc-950 px-4 py-2.5 text-sm font-bold transition-transform active:scale-95 hover:bg-zinc-200"
              >
                Join Interview
              </Link>
            </div>
          ))
        ) : (
          // If the database is empty, show this nice placeholder
          <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
            <p className="text-zinc-500 text-lg">No active rooms found.</p>
            <p className="text-zinc-600 text-sm mt-1">
              Click the button above to create your first room!
            </p>
          </div>
        )}
      </div>

      <CreateRoomModal isOpen={isCreateModalOpen} onClose={toggleCreateModal} />
    </div>
  );
}
