import Link from "next/link";
import Markdown from "react-markdown";
import {
    SparklesIcon,
    FileTextIcon,
    BookOpenTextIcon,
    FileVideoIcon,
    ClockFadingIcon,
} from "lucide-react";
import { format } from "date-fns";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MeetingGetOne } from "../../types";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import { Transcript } from "./transcript";
import { ChatProvider } from "./chat-provider";

interface Props {
    data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-y-4">

            <Tabs defaultValue="summary">

                {/* 🔥 Tabs Header */}
                <div className="bg-[#1a1a1a] rounded-xl border border-white/10 px-4 py-2">
                    <ScrollArea>
                        <TabsList className="flex gap-2 bg-transparent p-0">

                            <TabsTrigger
                                value="summary"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-lg transition
                                hover:bg-[#2a2a2a]
                                data-[state=active]:bg-[#2a2a2a] 
                                data-[state=active]:text-white"
                            >
                                <BookOpenTextIcon className="size-4" />
                                Summary
                            </TabsTrigger>

                            <TabsTrigger
                                value="transcript"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-lg transition
                                hover:bg-[#2a2a2a]
                                data-[state=active]:bg-[#2a2a2a] 
                                data-[state=active]:text-white"
                            >
                                <FileTextIcon className="size-4" />
                                Transcript
                            </TabsTrigger>

                            <TabsTrigger
                                value="recording"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-lg transition
                                hover:bg-[#2a2a2a]
                                data-[state=active]:bg-[#2a2a2a] 
                                data-[state=active]:text-white"
                            >
                                <FileVideoIcon className="size-4" />
                                Recording
                            </TabsTrigger>

                            <TabsTrigger
                                value="chat"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-lg transition
                                hover:bg-[#2a2a2a]
                                data-[state=active]:bg-[#2a2a2a] 
                                data-[state=active]:text-white"
                            >
                                <SparklesIcon className="size-4" />
                                Ask AI
                            </TabsTrigger>

                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

                {/* 🔥 Chat */}
                <TabsContent value="chat">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
                        <ChatProvider meetingId={data.id} meetingName={data.name} />
                    </div>
                </TabsContent>

                {/* 🔥 Transcript */}
                <TabsContent value="transcript">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
                        <Transcript meetingId={data.id} />
                    </div>
                </TabsContent>

                {/* 🔥 Recording */}
                <TabsContent value="recording">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
                        <video
                            src={data.recordingUrl!}
                            className="w-full rounded-lg"
                            controls
                        />
                    </div>
                </TabsContent>

                {/* 🔥 Summary */}
                <TabsContent value="summary">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl">
                        <div className="px-4 py-5 flex flex-col gap-y-5">

                            <h2 className="text-2xl font-semibold capitalize text-white">
                                {data.name}
                            </h2>

                            <div className="flex gap-x-3 items-center text-sm text-gray-400">
                                <Link
                                    href={`/agents/${data.agent.id}`}
                                    className="flex items-center gap-x-2 hover:underline"
                                >
                                    <GeneratedAvatar
                                        variant="botttsNeutral"
                                        seed={data.agent.name}
                                        className="size-5"
                                    />
                                    {data.agent.name}
                                </Link>

                                <span>
                                    {data.startedAt ? format(data.startedAt, "PPP") : ""}
                                </span>
                            </div>

                            <div className="flex gap-x-2 items-center text-gray-300">
                                <SparklesIcon className="size-4" />
                                <p>General summary</p>
                            </div>

                            <Badge
                                variant="outline"
                                className="flex items-center gap-x-2 border-white/10 text-gray-300"
                            >
                                <ClockFadingIcon className="text-blue-500" />
                                {data.duration ? formatDuration(data.duration) : "No duration"}
                            </Badge>

                            <div className="text-gray-300">
                                <Markdown
                                    components={{
                                        h1: (props) => (
                                            <h1 className="text-2xl font-semibold mb-6" {...props} />
                                        ),
                                        h2: (props) => (
                                            <h2 className="text-xl font-semibold mb-6" {...props} />
                                        ),
                                        h3: (props) => (
                                            <h3 className="text-lg font-semibold mb-6" {...props} />
                                        ),
                                        p: (props) => (
                                            <p className="mb-6 leading-relaxed" {...props} />
                                        ),
                                        ul: (props) => (
                                            <ul className="list-disc list-inside mb-6" {...props} />
                                        ),
                                        li: (props) => <li className="mb-1" {...props} />,
                                        strong: (props) => (
                                            <strong className="font-semibold text-white" {...props} />
                                        ),
                                        code: (props) => (
                                            <code className="bg-[#2a2a2a] px-1 py-0.5 rounded" {...props} />
                                        ),
                                        blockquote: (props) => (
                                            <blockquote className="border-l-4 pl-4 italic my-4" {...props} />
                                        ),
                                    }}
                                >
                                    {data.summary}
                                </Markdown>
                            </div>

                        </div>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
};