import { db } from "@/app/db";
import { count, eq } from "drizzle-orm";
import { agents, meetings } from "@/app/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from "../constant";

export const premiumRouter = createTRPCRouter({
    getFreeUsage: protectedProcedure
        .query(async ({ ctx }) => {
            const [agentsCount] = await db
                .select({ count: count() })
                .from(agents)
                .where(eq(agents.userId, ctx.auth.user.id));

            const [meetingsCount] = await db
                .select({ count: count() })
                .from(meetings)
                .where(eq(meetings.userId, ctx.auth.user.id));

            return {
                agentsCount: agentsCount.count,
                meetingsCount: meetingsCount.count,
                maxAgents: MAX_FREE_AGENTS,
                maxMeetings: MAX_FREE_MEETINGS,
            };
        }),
});
