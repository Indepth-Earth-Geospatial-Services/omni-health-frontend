'use client';

import { Filter, Search, Handbag, Menu } from 'lucide-react';
import Link from 'next/link';
import { useCallback } from 'react';

interface HeaderProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (value: boolean) => void;
}

const NAV_LINKS = [
    { href: '/faq', label: "FAQ's" },
    { href: '/help', label: 'Help' },
    { href: '/join', label: 'Join Us' },
    { href: '/signin', label: 'Sign In' },
] as const;

export default function Header({ isMenuOpen, setIsMenuOpen }: HeaderProps) {
    const handleToggleMenu = useCallback(() => {
        setIsMenuOpen(!isMenuOpen);
    }, [isMenuOpen, setIsMenuOpen]);

    return (
        <header className="w-full bg-white sticky top-0 z-50 shadow-md">
            {/* Top bar with links */}
            <nav
                className="flex items-center justify-end bg-gray-100 gap-2 px-6 md:px-12 lg:px-20 py-2 text-sm"
                aria-label="Secondary navigation"
            >
                {NAV_LINKS.map((link, index) => (
                    <div key={link.href} className="flex items-center gap-2">
                        <Link
                            href={link.href}
                            className="hover:text-gray-600 transition-colors focus:outline-none rounded px-1"
                        >
                            {link.label}
                        </Link>
                        {index < NAV_LINKS.length - 1 && (
                            <span className="text-gray-300" aria-hidden="true">
                                |
                            </span>
                        )}
                    </div>
                ))}
            </nav>

            {/* Main navigation bar */}
            <div className="flex justify-between items-center px-6 md:px-12 lg:px-20 py-2 ">
                {/* Hamburger menu */}
                <button
                    onClick={handleToggleMenu}
                    className="flex items-center justify-center p-2 hover:bg-gray-100 rounded transition-colors w-10 h-10 focus:outline-none"
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                    aria-controls="sidebar-menu"
                >
                    <Menu size={20} className="text-gray-600" aria-hidden="true" />
                </button>

                {/* Right side icons */}
                <div className="flex items-center gap-6">
                    {/* Search input */}
                    <div className="relative">
                        <label htmlFor="header-search" className="sr-only">
                            Search facilities
                        </label>
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                            aria-hidden="true"
                        />
                        <input
                            id="header-search"
                            type="search"
                            placeholder="Search"
                            className="border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm w-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            autoComplete="off"
                        />
                    </div>

                    {/* Filter button */}
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                        aria-label="Open filters"
                    >
                        <Filter size={20} className="text-gray-700" aria-hidden="true" />
                    </button>

                    {/* Shopping bag button */}
                    <button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                        aria-label="Shopping bag"
                    >
                        <Handbag size={20} className="text-gray-700" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </header>
    );
}