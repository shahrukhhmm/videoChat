import { MessageSquareMore } from "lucide-react";
import { useParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import Chat from "./Chat";

const ChatMobile = () => {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <>
      <Sheet>
        <SheetTrigger className="bg-secondary-upperground p-4 size-50 hover:bg-secondary-upperground/50 rounded-full flex xl:hidden">
          <MessageSquareMore color="white" />
        </SheetTrigger>
        <SheetContent className="bg-primary-upperground h-full">
          <Chat roomId={roomId as string} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatMobile;
