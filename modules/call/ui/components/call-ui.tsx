import { useState } from "react";
import { StreamTheme, useCall, CallingState } from "@stream-io/video-react-sdk";

import { CallLobby } from "./call-lobby";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

interface Props {
    meetingName: string;
};

export const CallUI = ({ meetingName }: Props) => {
    const call = useCall();
    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
    const [isJoining, setIsJoining] = useState(false);

    const trpc = useTRPC();
    const { mutateAsync: startAgent } = useMutation(
        trpc.meetings.startAgent.mutationOptions()
    );

    const handleJoin = async () => {
        if (!call || isJoining) return;

        if (call.state.callingState === CallingState.JOINED) {
            setShow("call");
            return;
        }

        try {
            setIsJoining(true);
            
            if (call.state.callingState === CallingState.IDLE) {
                await call.join({ create: true });
                // Trigger the agent to join immediately
                try {
                    await startAgent({ meetingId: call.id });
                } catch (trpcError) {
                    console.error("Failed to start agent via trpc:", trpcError);
                }
            }
            
            setShow("call");
        } catch (error) {
            console.error("Failed to join call:", error);
        } finally {
            setIsJoining(false);
        }
    };

    const handleLeave = () => {
        if (!call) return;

        if (call.state.callingState !== CallingState.LEFT) {
            call.leave();
        }
        setShow("ended");
    };

    return (
        <StreamTheme className="h-full">
            {show === "lobby" && <CallLobby onJoin={handleJoin} />}
            {show === "call" && <CallActive onLeave={handleLeave} meetingName={meetingName} />}
            {show === "ended" && <CallEnded />}
        </StreamTheme>
    )
};