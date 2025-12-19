"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuState, NavBarProps } from "../lib/navbar-utils";

const NavBar = ({
    links,
    orientation = "horizontal",
    showLogo = true,
    brandName,
    logoSrc = "/img/logo.svg",
}: NavBarProps) => {
    const [menuState, setMenuState] = useState<MenuState>("closed");

    const btnRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLElement | null>(null);

    const pathName : string = usePathname();

    const isActive = menuState === "opening" || menuState === "open";
    const isVisible = menuState !== "closed";
    const isHorizontal = orientation === "horizontal";

    const handleToggle = () => {
        if (menuState === "closed" || menuState === "closing") setMenuState("opening");
        else setMenuState("closing");
    };

    const handleAnimationEnd = () => {
        if (menuState === "opening") setMenuState("open");
        if (menuState === "closing") setMenuState("closed");
    };

    useEffect(() => {
        if (menuState === "closed") return;

        const onClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (btnRef.current?.contains(target)) return;
            if (menuRef.current?.contains(target)) return;
            setMenuState("closing");
        };

        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, [menuState]);

    const desktopNavClasses = isHorizontal
        ? "hidden md:flex flex-row items-center justify-center gap-6 text-sm md:text-base font-semibold"
        : "hidden md:flex flex-col items-end gap-4 text-sm md:text-base font-semibold";

    return (
        <header className="sticky top-0 z-50 bg-linear-to-b from-red-50/90 via-red-50/60 to-transparent">
            <nav className="relative max-w-6xl mx-auto mt-4 mb-4 px-4 sm:px-6">
                <div className="flex items-center justify-between rounded-4xl 
                              bg-white/90 backdrop-blur border border-red-100 shadow-xl px-4 sm:px-6 py-3">
                    {/* Logo */}
                    {showLogo ? (
                        <Link href="/" className="shrink-0">
                            <div className="flex flex-row items-center gap-2 cursor-pointer">
                                <Image src={logoSrc} alt="logo" width={36} height={36} />
                                <span className="font-heading text-xl md:text-2xl font-bold tracking-tight">
                                    {brandName}
                                </span>
                            </div>
                        </Link>
                    ) : (
                        <div className="w-20" />
                    )}

                    {/* Desktop nav + actions */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className={desktopNavClasses}>
                            {links.map((link) => {
                                const active =
                                    link.href === "/"
                                        ? pathName === "/"
                                        : pathName.startsWith(link.href);

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={
                                            active
                                                ? "px-4 py-2 rounded-full bg-red-700 text-white shadow-md hover:bg-red-600 transition transform hover:-translate-y-0.5 hover:shadow-lg"
                                                : "underline-hover text-slate-800 hover:text-red-800 transition"
                                        }
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        id="hamburger-button"
                        ref={btnRef}
                        className={`md:hidden cursor-pointer hamburger-btn ${isActive ? "toggle-btn" : ""
                            }`}
                        aria-expanded={isActive}
                        aria-label="Toggle menu"
                        onClick={handleToggle}
                    >
                        <div className="hamburger-line" />
                    </button>
                </div>

                <section
                    id="mobile-menu"
                    ref={menuRef}
                    onAnimationEnd={handleAnimationEnd}
                    className={[
                        "md:hidden fixed inset-x-0 top-16 bottom-0 z-40",
                        "text-3xl text-slate-900",
                        "origin-top backdrop-blur-md rounded-2xl backdrop-saturate-150 bg-red-50/80",
                        isVisible ? "flex flex-col justify-start items-end pr-6 text-right" : "hidden",
                        menuState === "opening"
                            ? "animate-[open-menu_0.5s_ease-in-out_forwards]"
                            : "",
                        menuState === "closing"
                            ? "animate-[close-menu_0.5s_ease-in-out_forwards]"
                            : "",
                    ].join(" ")}
                >
                    <nav
                        className="flex flex-col w-full h-full items-end justify-start pt-6 space-y-3"
                        aria-label="mobile"
                    >
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="py-2 text-2xl underline-hover"
                                onClick={() => setMenuState("closing")}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </section>
            </nav>
        </header>
    );
}

export default NavBar;