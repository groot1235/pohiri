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
        <Sidebar className="border-r border-white/10 bg-white/5 backdrop-blur-xl">

            {/* HEADER */}
            <SidebarHeader className="bg-[#0068a8]">
                <Link href="/" className="flex items-center gap-2 px-3 py-4">
                    <Image src="/logo.svg" height={34} width={34} alt="Pohiri" />
                    <p className="text-xl font-semibold text-white tracking-tight">
                        Pohiri
                    </p>
                </Link>
            </SidebarHeader>

            <div className="px-4 bg-[#0068a8]">
                <Separator className="bg-white/10" />
            </div>

            {/* CONTENT */}
            <SidebarContent className="bg-[#0068a8]">

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
                                            "h-11 rounded-xl px-3 transition-all duration-300",

                                            // default
                                            "text-white/80 hover:text-white",
                                            "hover:bg-white/10",

                                            // active
                                            pathname === item.href &&
                                            "bg-gradient-to-r from-[#0068a8]/80 to-[#00a8e8]/60 text-white shadow-lg border border-white/10"
                                        )}
                                    >
                                        <Link href={item.href} className="flex items-center gap-3">
                                            <item.icon className="size-5" />
                                            <span className="text-sm font-medium">
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
                    <Separator className="bg-white/10" />
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
                                            "h-11 rounded-xl px-3 transition-all duration-300",
                                            "text-white/70 hover:text-white",
                                            "hover:bg-white/10",

                                            pathname === item.href &&
                                            "bg-gradient-to-r from-[#0068a8]/80 to-[#00a8e8]/60 text-white shadow-lg border border-white/10"
                                        )}
                                    >
                                        <Link href={item.href} className="flex items-center gap-3">
                                            <item.icon className="size-5" />
                                            <span className="text-sm font-medium">
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
            <SidebarFooter className="px-3 py-4 text-white/60 text-xs bg-[#0068a8]">
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    );
};