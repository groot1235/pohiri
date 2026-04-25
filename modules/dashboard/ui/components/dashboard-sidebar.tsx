"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import { DashboardUserButton } from "./dashboard-user-button";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const firstSection = [
    { icon: VideoIcon, label: "Meetings", href: "/meetings" },
    { icon: BotIcon, label: "Agents", href: "/agents" },
];

const secondSection = [
    { icon: StarIcon, label: "Upgrade", href: "/upgrade" },
];

export const DashboardSidebar = () => {
    const pathname = usePathname();

    return (
        <Sidebar className="bg-background/95 backdrop-blur">

            {/* HEADER */}
            <SidebarHeader className="bg-transparent">
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/[0.08]">
                        <Image src="/logo.svg" height={22} width={22} alt="Pohiri" />
                    </div>
                    <p className="text-sm font-semibold text-white tracking-wide">
                        Pohiri
                    </p>
                </Link>
            </SidebarHeader>

            <div className="px-4">
                <Separator className="bg-white/[0.06]" />
            </div>

            {/* CONTENT */}
            <SidebarContent className="bg-transparent">

                {/* SECTION TITLE */}
                <p className="px-4 pt-4 pb-2 text-[10px] uppercase tracking-widest text-white/40">
                    Channels
                </p>

                {/* FIRST SECTION */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        className={cn(
                                            "h-10 rounded-lg px-3 transition-all",

                                            // default
                                            "text-white/70 hover:text-white",
                                            "hover:bg-white/[0.05]",

                                            // active
                                            pathname === item.href &&
                                            "bg-white/[0.08] text-white border border-white/[0.08]"
                                        )}
                                    >
                                        <Link href={item.href} className="flex items-center gap-3">
                                            <item.icon className="size-4 opacity-80" />
                                            <span className="text-sm">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <div className="px-4 py-3">
                    <Separator className="bg-white/[0.06]" />
                </div>

                {/* SECOND SECTION */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        className={cn(
                                            "h-10 rounded-lg px-3 transition-all",
                                            "text-white/60 hover:text-white",
                                            "hover:bg-white/[0.05]",

                                            pathname === item.href &&
                                            "bg-white/[0.08] text-white border border-white/[0.08]"
                                        )}
                                    >
                                        <Link href={item.href} className="flex items-center gap-3">
                                            <item.icon className="size-4 opacity-80" />
                                            <span className="text-sm">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter className="border-t border-white/[0.06] bg-transparent px-3 py-4 text-xs text-white/40">
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    );
};