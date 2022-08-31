import { useState, useEffect } from "react";
import Link from "next/link";
import Navmenu from "./Navmenu";
import DarkModeToggle from "./DarkModeToggle";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";

export default function Navbar() {
  const { data: account } = useAccount();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <header className="bg-white dark:bg-slate-700 border-b-2 border-gray-100 dark:border-slate-800">
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Top"
        >
          <div className="w-full py-6 flex flex-wrap items-center justify-between border-b border-indigo-500 lg:border-none">
            <div className="flex items-center">
              <Link href="/">
                <a className="text-lg dark:text-white">web3rsvp</a>
              </Link>
            </div>
            <div className="ml-10 space-x-4 flex items-center">
              <DarkModeToggle />
              <Link href="/create-event">
                <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 border border-indigo-100 hover:bg-indigo-50 dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-slate-700 dark:focus:ring-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Create Event
                </a>
              </Link>
              { account ? (
                <Navmenu account={account} disconnect={disconnect} />
              ) : (
                <ConnectButton />
              )}
            </div>
          </div>
        </nav>
      </header>
    )
  );
}
