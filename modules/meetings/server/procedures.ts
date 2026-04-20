import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, ilike, inArray } from "drizzle-orm";

import { db } from "@/app/db";
import { meetings, agents, user } from "@/app/db/schema";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { streamVideo } from "@/lib/stream-video";
import { streamChat } from "@/lib/stream-chat";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

import { meetingsInsertSchema, meetingsUpdateSchema } from "@/modules/meetings/schemas";
import { StreamTranscriptItem } from "../types";

export const meetingsRouter = createTRPCRouter({
    generateToken: protectedProcedure
        .mutation(async ({ ctx }) => {
            const token = streamVideo.generateUserToken({ user_id: ctx.auth.user.id });
            return token;
        }),
    getMany: protectedProcedure
        .input(
            z.object({
                page: z.number().default(DEFAULT_PAGE),
                pageSize: z
                    .number()
                    .min(MIN_PAGE_SIZE)
                    .max(MAX_PAGE_SIZE)
                    .default(DEFAULT_PAGE_SIZE),
                search: z.string().nullish(),
                agentId: z.string().nullish(),
                status: z.enum(["upcoming", "active", "completed", "processing", "cancelled"]).nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { search, page, pageSize, agentId, status } = input;

            const data = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                })
                .from(meetings)
                .leftJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        agentId ? eq(meetings.agentId, agentId) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize)

            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        agentId ? eq(meetings.agentId, agentId) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                    )
                );

            const totalPages = Math.ceil(total.count / pageSize);

            return {
                items: data,
                total: total.count,
                totalPages,
            };
        }),
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingMeeting] = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id),
                    )
                );

            if (!existingMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
            }

            return existingMeeting;
        }),
    create: premiumProcedure("meetings")
        .input(meetingsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdMeeting] = await db
                .insert(meetings)
                .values({
                    ...input,
                    userId: ctx.auth.user.id,
                })
                .returning();

            return createdMeeting;
        }),
    update: protectedProcedure
        .input(meetingsUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const [updatedMeeting] = await db
                .update(meetings)
                .set(input)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id),
                    )
                )
                .returning();

            if (!updatedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found",
                });
            }

            return updatedMeeting;
        }),
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const [removedMeeting] = await db
                .delete(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id),
                    ),
                )
                .returning();

            if (!removedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found",
                });
            }

            return removedMeeting;
        }),
    startAgent: protectedProcedure
        .input(z.object({ meetingId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // The agent joins via the Stream webhook (call.session_started event).
            // This procedure is kept as a no-op so the frontend call doesn't error,
            // but the real work happens in /api/webhook when Stream fires the event.
            const [existingMeeting] = await db
                .select()
                .from(meetings)
                .where(
                    and(
                        eq(meetings.id, input.meetingId),
                        eq(meetings.userId, ctx.auth.user.id),
                    )
                );

            if (!existingMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
            }

            return { success: true };
        }),
    generateChatToken: protectedProcedure
        .mutation(async ({ ctx }) => {
            return streamChat.createToken(ctx.auth.user.id);
        }),
    getTranscript: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [meeting] = await db
                .select()
                .from(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id),
                    )
                );

            if (!meeting || !meeting.transcriptUrl) {
                return [];
            }

            const response = await fetch(meeting.transcriptUrl);
            const transcript = (await response.json()) as StreamTranscriptItem[];

            const speakerIds = [...new Set(transcript.map((item) => item.speaker_id))];

            if (speakerIds.length === 0) {
                return transcript.map((item) => ({
                    ...item,
                    user: { name: "Unknown", image: null },
                }));
            }

            const speakers = await db
                .select()
                .from(user)
                .where(inArray(user.id, speakerIds));

            const speakersMap = new Map(speakers.map((s) => [s.id, s]));

            const meetingAgent = await db
                .select()
                .from(agents)
                .where(eq(agents.id, meeting.agentId));

            const agentMap = new Map(meetingAgent.map((a) => [a.id, a]));

            return transcript.map((item) => ({
                ...item,
                user:
                    speakersMap.get(item.speaker_id) ||
                    agentMap.get(item.speaker_id) || {
                        name: "Unknown",
                        image: null,
                    },
            }));
        }),
});
