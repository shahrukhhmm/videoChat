import { useState } from 'react';
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { API_URL } from '../lib/constant';

// Define types for props and state
interface AskAiProps {
    roomId: string;
}

interface Response {
    question: string;
    answer: string;
}

const AskAi: React.FC<AskAiProps> = ({ roomId }) => {
    const [question, setQuestion] = useState<string>("");  // State for the user's question
    const [responses, setResponses] = useState<Response[]>([]);  // State for storing all responses

    const askQuestion = async () => {
        if (!question.trim()) return;  // Prevent empty questions from being sent

        try {
            const res = await fetch(`${API_URL}/ask/${roomId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question }),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch response from server.");
            }

            const data = await res.json();
            setResponses((prevResponses) => [...prevResponses, { question, answer: data.summary }]); // Append the new response
            setQuestion("");  // Clear the input after asking
        } catch (error) {
            console.error("Error asking question:", error);
            setResponses((prevResponses) => [...prevResponses, { question, answer: "Failed to get a response from AI." }]);
        }
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <div className="lg:absolute lg:left-96 items-center text-white gap-1 flex bg-secondary-upperground xl:w-[112px] p-2 justify-center text-[14px] rounded-full cursor-pointer">
                    <svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.2301 8.5876C10.3935 8.13385 11.0857 8.13385 11.2491 8.5876L12.2071 11.251C12.418 11.8365 12.7733 12.3684 13.2449 12.8047C13.7165 13.241 14.2914 13.5696 14.924 13.7645L17.7997 14.6514C18.2899 14.8026 18.2899 15.4434 17.7997 15.5946L14.9225 16.4815C14.29 16.6767 13.7153 17.0056 13.244 17.4421C12.7727 17.8787 12.4177 18.4108 12.2071 18.9964L11.2491 21.6584C11.2138 21.7578 11.1456 21.8443 11.0541 21.9056C10.9626 21.967 10.8525 22 10.7396 22C10.6266 22 10.5165 21.967 10.425 21.9056C10.3335 21.8443 10.2653 21.7578 10.2301 21.6584L9.27197 18.995C9.06123 18.4097 8.70614 17.8778 8.23484 17.4415C7.76353 17.0053 7.18896 16.6766 6.55663 16.4815L3.67938 15.5946C3.57204 15.562 3.47857 15.4989 3.4123 15.4142C3.34604 15.3295 3.31036 15.2276 3.31036 15.123C3.31036 15.0184 3.34604 14.9165 3.4123 14.8318C3.47857 14.7471 3.57204 14.684 3.67938 14.6514L6.55663 13.7645C7.18896 13.5694 7.76353 13.2407 8.23484 12.8045C8.70614 12.3682 9.06123 11.8363 9.27197 11.251L10.2301 8.5876ZM4.4919 1.57645C4.5132 1.5169 4.55423 1.46509 4.60916 1.42836C4.6641 1.39163 4.73013 1.37186 4.7979 1.37186C4.86566 1.37186 4.9317 1.39163 4.98663 1.42836C5.04156 1.46509 5.08259 1.5169 5.10389 1.57645L5.67875 3.1742C5.93572 3.88646 6.5388 4.44471 7.30825 4.68259L9.0343 5.21471C9.09863 5.23443 9.1546 5.27241 9.19428 5.32326C9.23395 5.37411 9.25531 5.43524 9.25531 5.49796C9.25531 5.56069 9.23395 5.62182 9.19428 5.67267C9.1546 5.72352 9.09863 5.7615 9.0343 5.78122L7.30825 6.31334C6.92854 6.43 6.5835 6.6271 6.3006 6.88897C6.0177 7.15084 5.80477 7.47024 5.67875 7.82172L5.10389 9.41948C5.08259 9.47903 5.04156 9.53084 4.98663 9.56757C4.9317 9.6043 4.86566 9.62406 4.7979 9.62406C4.73013 9.62406 4.6641 9.6043 4.60916 9.56757C4.55423 9.53084 4.5132 9.47903 4.4919 9.41948L3.91705 7.82172C3.79103 7.47024 3.57809 7.15084 3.29519 6.88897C3.0123 6.6271 2.66726 6.43 2.28755 6.31334L0.561495 5.78122C0.497168 5.7615 0.44119 5.72352 0.401515 5.67267C0.361839 5.62182 0.340485 5.56069 0.340485 5.49796C0.340485 5.43524 0.361839 5.37411 0.401515 5.32326C0.44119 5.27241 0.497168 5.23443 0.561495 5.21471L2.28755 4.68259C2.66726 4.56593 3.0123 4.36882 3.29519 4.10695C3.57809 3.84509 3.79103 3.52569 3.91705 3.1742L4.4919 1.57645ZM14.9923 0.134067C15.007 0.0949152 15.0344 0.0609658 15.0709 0.0369385C15.1074 0.0129112 15.151 0 15.1958 0C15.2406 0 15.2842 0.0129112 15.3207 0.0369385C15.3572 0.0609658 15.3846 0.0949152 15.3993 0.134067L15.7825 1.19832C15.9534 1.67407 16.3559 2.0467 16.8699 2.20483L18.0196 2.55958C18.0619 2.57315 18.0985 2.59859 18.1245 2.63235C18.1505 2.66611 18.1644 2.70651 18.1644 2.74795C18.1644 2.78939 18.1505 2.8298 18.1245 2.86356C18.0985 2.89732 18.0619 2.92276 18.0196 2.93633L16.8699 3.29108C16.6168 3.36946 16.3869 3.50117 16.1982 3.67583C16.0095 3.85049 15.8672 4.06334 15.7825 4.29758L15.3993 5.36184C15.3846 5.40099 15.3572 5.43494 15.3207 5.45897C15.2842 5.48299 15.2406 5.49591 15.1958 5.49591C15.151 5.49591 15.1074 5.48299 15.0709 5.45897C15.0344 5.43494 15.007 5.40099 14.9923 5.36184L14.6091 4.29758C14.5244 4.06334 14.3821 3.85049 14.1934 3.67583C14.0047 3.50117 13.7748 3.36946 13.5217 3.29108L12.3735 2.93633C12.3312 2.92276 12.2945 2.89732 12.2686 2.86356C12.2426 2.8298 12.2287 2.78939 12.2287 2.74795C12.2287 2.70651 12.2426 2.66611 12.2686 2.63235C12.2945 2.59859 12.3312 2.57315 12.3735 2.55958L13.5232 2.20483C14.0372 2.0467 14.4397 1.67407 14.6105 1.19832L14.9923 0.134067Z" fill="white" />
                        </svg>
                        <span className='xl:block hidden'>ASK AI</span>
                    </div>
                </DialogTrigger>
                <DialogContent className="w-auto ">
                    <DialogHeader>
                        <DialogDescription>Ask anything about current room chat.</DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 gap-5 flex-col">
                        <div className="h-[300px] border w-[300px] lg:w-full overflow-y-scroll p-2">
                            {responses.map((res, index) => (
                                <div key={index} className="mb-4">
                                    <p className="font-bold">Q: {res.question}</p>
                                    <p>A: {res.answer}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                name="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="text-[#9D9FA5] bg-transparent border-2 outline-none"
                                placeholder="Enter your message"
                            />
                            <Button
                                onClick={askQuestion}
                                className="bg-secondary-upperground hover:bg-secondary-upperground/50"
                            >
                                ASK
                            </Button>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" className="bg-red-500 hover:bg-red-500">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AskAi;
