"use client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/hero-section/navbar/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/hero-section/navbar/mobile-nav";
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export const navLinks = [
    {
        label: "Features",
        href: "#",
    },
    {
        label: "Pricing",
        href: "#",
    },
    {
        label: "About",
        href: "#",
    },
];



export function Header() {
    const scrolled = useScroll(10);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const session = await authClient.getSession();
            setIsLoggedIn(!!session);
        };
        checkSession();
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-50 mx-auto w-full max-w-4xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out",
                {
                    "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-3xl md:shadow":
                        scrolled,
                }
            )}
        >
            <nav
                className={cn(
                    "flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
                    {
                        "md:px-2": scrolled,
                    }
                )}
            >
                <a
                    className="rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50"
                    href="#"
                >
                    <Logo className="h-4" />
                </a>
                <div className="hidden items-center gap-2 md:flex">
                    <div>
                        {navLinks.map((link) => (
                            <Button asChild key={link.label} size="sm" variant="ghost">
                                <a href={link.href}>{link.label}</a>
                            </Button>
                        ))}
                    </div>
                    <Button
                        size="lg"
                        className="font-semibold"
                        variant='outline'
                        onClick={() => router.push(isLoggedIn ? "/dashboard" : "/sign-in")}
                    >
                        login
                    </Button>
                    <Button
                        size="lg"
                        className="font-semibold"
                        onClick={() => router.push(isLoggedIn ? "/dashboard" : "/sign-up")}
                    >
                        Get Started
                    </Button>
                </div>
                <MobileNav />
            </nav>
        </header>
    );
}
