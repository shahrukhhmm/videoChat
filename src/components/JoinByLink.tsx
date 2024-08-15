/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import { getCountries } from "../lib/helper";
import {
    Button,
} from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "./ui/select";

const JoinByLink = ({ open, setOpen }: any) => {
    const [countries, setCountries] = useState<{ flag: string; languages: string[] }[]>([]);
    const { roomId } = useParams<{ roomId: string }>();
    const [username, setUsername] = useState<string>("");
    const [room] = useState(roomId);
    const [language, setLanguage] = useState<string>("");
    const socket: any = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCountries = async () => {
            const countryData = await getCountries();
            setCountries(countryData);
        };
        fetchCountries();
    }, []);

    const handleSubmitForm = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            console.log("Submitting form with values:", { username, room, language });
            socket?.emit("room:join", { username, room, language });
            localStorage.setItem("currentUser",username)
            localStorage.setItem("currentUserLanguage",language)
        },
        [username, room, language, socket]
    );

    const handleJoinRoom = useCallback(
        (data: { username: any; room: any; }) => {
            const { room } = data;
            console.log("Joining room:", room);
            navigate(`/room/${room}`);
            setOpen(false)
        },
        [navigate, setOpen]
    );

    useEffect(() => {
        socket?.on("room:join", handleJoinRoom);
        return () => {
            socket?.off("room:join", handleJoinRoom);
        };
    }, [socket, handleJoinRoom]);

    return (
        <div className="bg-primary-upperground ">
            <Dialog open={open} onOpenChange={setOpen}>

                <DialogContent className="max-w-[425px]">
                    <form onSubmit={handleSubmitForm}>

                        <DialogHeader>
                            <DialogTitle>Join this Room</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    placeholder="John Doe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="col-span-3 border-secondary-upperground"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="language" className="text-right">
                                    Language
                                </Label>
                                <Select onValueChange={setLanguage}>
                                    <SelectTrigger className="col-span-3 border-secondary-upperground">
                                        <SelectValue placeholder="Select your language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Languages</SelectLabel>
                                            {countries.map((country, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={`${country.languages[0]}-${index}`} // Making the value unique by adding the index
                                                >
                                                    <img src={country.flag} alt="flag" className="inline-block mr-2 w-6 h-4" />
                                                    {country.languages[0]}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                className="bg-secondary-upperground hover:bg-secondary-upperground/80 m-2"
                            >
                                Join
                            </Button>

                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default JoinByLink
