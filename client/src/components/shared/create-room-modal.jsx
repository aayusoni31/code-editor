// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Field, FieldGroup } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import axiosInstance from "@/lib/axios";

// export function CreateRoomModal({ isOpen, onClose }) {
//   const [name, setName] = useState("");

//   const handleNameChange = (e) => {
//     const { value } = e.target;
//     setName(value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); // FIX: Stops the page from refreshing when you click submit!
//     try {
//       const url = "/interview";
//       const { status } = await axiosInstance.post(url, { name });

//       if (status === 201) {
//         onClose();
//         // NOTE: Later on, the instructor will probably add code here
//         // to navigate you into the room after it gets created!
//       }
//     } catch (err) {
//       console.error("Error creating room", err);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-sm">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Create Room</DialogTitle>
//           </DialogHeader>

//           <FieldGroup className="py-4">
//             <Field>
//               <Label htmlFor="name">Name</Label>
//               <Input
//                 id="name"
//                 value={name}
//                 onChange={handleNameChange}
//                 placeholder="Enter Room Name"
//                 name="name"
//               />
//             </Field>
//           </FieldGroup>

//           <DialogFooter>
//             {/* Make sure type="submit" is here so it triggers the form */}
//             <Button type="submit">Save changes</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
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
      const url = "/interview";

      // 3. Grab the 'data' object from the backend response alongside the status
      const { status, data } = await axiosInstance.post(url, { name });

      if (status === 201) {
        onClose();
        // 4. Use the new roomId from the database to change the URL!
        navigate(`/interview/${data.roomId}`);
      }
    } catch (err) {
      console.error("Error creating room", err);
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
