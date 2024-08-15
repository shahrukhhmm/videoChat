import { motion } from "framer-motion";
import { useState } from "react";
import ByCode from "./ByCode";
import NewRoom from "./NewRoom";
import { Input } from "./ui/input";

export default function Hero() {
    const [room, setRoom] = useState('');
    const [open, setOpen] = useState(false);




    return (
        <section className="bg-primary-upperground h-screen">

            <div className="relative isolate px-6 pt-10 lg:px-8">
                <motion.div initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 1,
                        delay: 0.9,
                        ease: [0, 0.71, 0.2, 1.01]
                    }} className="mb-8 flex justify-center">
                    <img src="/assets/monaai.png" alt="logo" className="w-[112px] h-[20px] " />

                </motion.div>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-secondary-upperground to-destructive-upperground opacity-50 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    />
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: 2,
                        delay: 0.9,
                        ease: [0, 0.71, 0.2, 1.01]
                    }} className="mx-auto max-w-2xl pt-24">
                    <div className="text-center">
                        <h1 className="text-xl font-bold tracking-tight text-white sm:text-5xl">
                            Video calls and meetings for everyone.
                        </h1>
                        <p className="mt-6 text-base leading-8 text-white">
                            Connect, collaborate, and celebrate from anywhere.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-2">
                            <NewRoom />
                            <Input type="text" placeholder="Enter a Link or Code" className="w-72 border-none outline-nones" value={room}
                                onChange={(e) => setRoom(e.target.value)} />
                            <ByCode open={open} setOpen={setOpen} room={room} />

                        </div>
                    </div>
                </motion.div>

                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[50%] -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 "
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative  left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-secondary-upperground to-destructive-upperground opacity-50 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    />
                </div>

            </div>
        </section>
    )
}
