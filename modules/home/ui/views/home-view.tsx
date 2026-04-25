"use client"
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useTRPC } from '@/trpc/client'
import { Button } from '@/components/ui/button'
import { GeneratedAvatar } from '@/components/generated-avatar'
import { Separator } from '@/components/ui/separator'

type Props = {}

const HomeView = (props: Props) => {

    const router = useRouter();
    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.agents.getMany.queryOptions({
            search: "",
            page: 1,
        })
    );

    const hasAgents = data.items.length > 0;

    const { data: meetingsData } = useSuspenseQuery(
        trpc.meetings.getMany.queryOptions({
            search: "",
            page: 1,
        })
    );

    const hasMeetings = meetingsData.items.length > 0;


    return (
        <div>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-4 w-full h-full p-7">

                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">
                            Latest agents created by you
                        </h1>

                        <Button
                            onClick={() => router.push("/agents")}
                        >
                            View all agents →
                        </Button>
                    </div>

                    {!hasAgents ? (
                        <div className="rounded-2xl bg-[#242424]/40 h-64 w-full flex flex-col justify-center items-center gap-4">
                            <p className="text-lg text-muted-foreground">
                                Create your first agent
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-[#242424]/40 h-64 w-full flex justify-start items-start p-5">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 h-full w-full">

                                {data.items.slice(0, 3).map((agent) => (
                                    <div
                                        key={agent.id}
                                        className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 hover:bg-[#222] transition cursor-pointer"
                                        onClick={() => router.push(`/agents/${agent.id}`)}
                                    >
                                        <div className="flex p-2">
                                            <GeneratedAvatar
                                                seed={agent.name}
                                                variant="botttsNeutral"
                                                className="size-25"
                                            />

                                            <div className="flex flex-col p-5">
                                                <h3 className="text-white font-semibold">
                                                    {agent.name}
                                                </h3>

                                                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                                    {agent.instructions}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    )}

                </div>

            </div>
            <div className="flex flex-row">
                <div className="flex flex-col gap-4 w-full h-full p-7">

                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">
                            Your Meetings
                        </h1>

                        <Button
                            onClick={() => router.push("/meetings")}
                        >
                            View all meetings →
                        </Button>
                    </div>
                    {!hasMeetings ? (
                        <div className="rounded-2xl bg-[#242424]/40 h-64 w-full flex flex-col justify-center items-center gap-4">
                            <p className="text-lg text-muted-foreground">
                                No meetings yet
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-2xl bg-[#242424]/40 h-64 w-full flex justify-start items-start p-5">
                            <div className="gap-4 h-full w-full">
                                {meetingsData.items.slice(0, 3).map((meeting) => (
                                    <div
                                        key={meeting.id}
                                        onClick={() => router.push(`/meetings/${meeting.id}`)}
                                    >
                                        <div className="flex items-center gap-2 p-2 cursor-pointer">
                                            <GeneratedAvatar
                                                seed={meeting.name}
                                                variant="botttsNeutral"
                                                className="size-8"
                                            />

                                            <div className="flex w-full items-center justify-between p-4 rounded-lg hover:bg-[#1f1f1f] transition">

                                                {/* Left: Name */}
                                                <h3 className="text-white font-medium">
                                                    {meeting.name}
                                                </h3>

                                                <span className='text-white font-medium'>
                                                    {meeting.agent?.name}
                                                </span>

                                                {/* Right: Status badge */}
                                                <span className="text-xs px-3 py-1 rounded-full bg-[#2a2a2a] text-gray-300">
                                                    {meeting.status}
                                                </span>

                                            </div>
                                        </div>
                                        <Separator />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HomeView