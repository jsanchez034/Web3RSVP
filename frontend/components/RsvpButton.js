import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { LinkIcon } from "@heroicons/react/outline";


export default function RsvpButton({ event, onNewRSVP }) {
  const { data: account } = useAccount();
  const [currentTimestamp,] = useState(new Date().getTime());
  const [mounted, setMounted] = useState(false);
  useEffect(() => { 
    setMounted(true) 
  }, []);

  function checkIfAlreadyRSVPed() {
    if (account) {
      const thisAccount = account.address.toLowerCase();
      return event.rsvps.some((rsvp) => rsvp.attendee.id.toLowerCase() === thisAccount)
    }

    return false;
  }

  if (mounted) {
    return event.eventTimestamp > currentTimestamp ? (
      account ? (
        checkIfAlreadyRSVPed() ? (
          <>
            <span className="w-full text-center px-6 py-3 text-base font-medium rounded-full text-teal-800 bg-teal-100">
              You have RSVPed! 🙌
            </span>
            <div className="flex item-center">
              <LinkIcon className="w-6 mr-2 text-indigo-800" />
              <a
                className="text-indigo-800 truncate hover:underline"
                href={event.link}
              >
                {event.link}
              </a>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="w-full items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onNewRSVP}
          >
            RSVP for {ethers.utils.formatEther(event.deposit)} MATIC
          </button>
        )
      ) : (
        <ConnectButton />
      )
    ) : (
      <span className="w-full text-center px-6 py-3 text-base font-medium rounded-full border-2 border-gray-200">
        Event has ended
      </span>
    );
  }

  return null;
}