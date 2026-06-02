import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axios";

export function CreateRoomModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const navigate = useNavigate(); // 2. Initialize the navigate function

  const handleNameChange = (e) => {
    const { value } = e.target;
    setName(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("1. Button clicked, attempting to create room:", name);

      const url = "/interview";
      const response = await axiosInstance.post(url, { name });

      console.log("2. Backend responded with:", response.status, response.data);

      // Sometimes Axios treats a successful creation as 200 OR 201, let's accept both!
      if (response.status === 201 || response.status === 200) {
        console.log("3. Success! Navigating to room...");
        onClose();
        navigate(`/interview/${response.data.roomId}`);
      }
    } catch (err) {
      // 4. If it fails, this will print the EXACT reason in bright red in your browser console!
      console.error(
        "CRITICAL ERROR CREATING ROOM:",
        err.response?.data || err.message,
      );
      alert("Failed to create room. Check the browser console!");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Room</DialogTitle>
            <DialogDescription>
              Enter a name for your new room.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter Room Name"
                name="name"
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
