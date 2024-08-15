/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, uploadBytes } from "@firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { storage } from "../lib/firebase";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Upload } from "lucide-react";

const FileUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { roomId } = useParams<{ roomId: string }>();
    const socket: any = useSocket();
    const currentUser = localStorage.getItem("currentUser");

    // Function to handle file selection and upload
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            //   console.log("File selected:", file); // Debugging log
        }
    };

    // Function to handle the upload process
    const handleUpload = async () => {
        if (!selectedFile || !roomId) return;

        setUploading(true);
        const storageRef = ref(storage, `uploads/${roomId}/${selectedFile.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, selectedFile);
            const fileURL = await getDownloadURL(snapshot.ref);

            //   console.log("File URL retrieved:", fileURL); // Debugging log

            // Send the file URL along with message info to the backend
            sendFileMessage(selectedFile.name, fileURL);

            setUploading(false);
            setSelectedFile(null); // Clear the selected file after upload
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploading(false);
        }
    };

    // Function to send the file URL as a message
    const sendFileMessage = (fileName: string, fileURL: string) => {
        // console.log("Sending message with file:", fileName, fileURL); // Debugging log
        socket.emit("BE-send-message", {
            roomId,
            msg: `File: ${fileName}`,
            fileURL,
            sender: currentUser,
        });
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-transparent hover:bg-blue-400 ">
                        <Upload  width={15} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Upload File</DialogTitle>
                        <DialogDescription>
                            Please upload files below 30MB.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="file-upload">Select File</Label>
                        <Input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*,video/*,audio/*,application/pdf"
                        />
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            className="bg-green-500 hover:bg-green-600 text-white"
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </Button>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FileUpload;
