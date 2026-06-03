import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";

export function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const { data } = await axiosInstance.post(endpoint, formData);

      // Save the JWT token to local storage so they stay logged in!
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onSuccess(); // Triggers the redirect to Dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Toggle Login/Signup */}
        <div className="mb-6 flex rounded-lg bg-zinc-900 p-1">
          <button
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${isLogin ? "bg-zinc-800 text-white shadow" : "text-zinc-400 hover:text-white"}`}
            onClick={() => setIsLogin(true)}
          >
            Log In
          </button>
          <button
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${!isLogin ? "bg-zinc-800 text-white shadow" : "text-zinc-400 hover:text-white"}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <Input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          )}
          <Input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="bg-zinc-900 border-zinc-800 text-white"
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="bg-zinc-900 border-zinc-800 text-white"
          />

          {error && (
            <p className="text-red-400 text-sm font-semibold">{error}</p>
          )}

          <Button
            type="submit"
            className="mt-2 bg-indigo-600 hover:bg-indigo-500 font-bold text-white w-full py-6"
          >
            {isLogin ? "Welcome Back" : "Create Account"}
          </Button>
        </form>

        <Button
          variant="ghost"
          onClick={onClose}
          className="mt-4 w-full text-zinc-500 hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
