import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import EventCard from "../../components/EventCard";
import Dashboard from "../../components/Dashboard";

const MY_PAST_RSVPS = gql`
  query Account($id: String, $currentTimestamp: String) {
    account(id: $id) {
      id
      rsvps(where: { event_: { eventTimestamp_lt: $currentTimestamp } }) {
        event {
          id
          name
          eventTimestamp
          imageURL
        }
      }
    }
  }
`;

export default function MyPastRSVPs() {
  const { data: account } = useAccount();

  const id = account ? account.address.toLowerCase() : "";
  const [currentTimestamp] = useState(
    new Date().getTime().toString()
  );
  const { loading, error, data } = useQuery(MY_PAST_RSVPS, {
    variables: { currentTimestamp, id },
  });

  if (loading) {
    return (
      <Dashboard page="rsvps" isUpcoming={true}>
        <p>Loading...</p>
      </Dashboard>
    );
  }
  if (error) {
    return (
      <Dashboard page="rsvps" isUpcoming={true}>
        <p>`Error! ${error.message}`</p>
      </Dashboard>
    );
  }

  return (
    <Dashboard page="rsvps" isUpcoming={false}>
      {account ? (
        <div>
          {!data?.account && <p>No upcoming RSVPs found</p>}
          {data?.account && (
            <ul
              role="list"
              className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
            >
              {data.account.rsvps.map(function (rsvp) {
                if (rsvp.event.eventTimestamp > currentTimestamp) {
                  return (
                    <li key={rsvp.event.id}>
                      <EventCard
                        id={rsvp.event.id}
                        name={rsvp.event.name}
                        eventTimestamp={rsvp.event.eventTimestamp}
                        imageURL={rsvp.event.imageURL}
                      />
                    </li>
                  );
                }
              })}
            </ul>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center py-8">
          <p className="mb-4">Please connect your wallet to view your rsvps</p>
          <ConnectButton />
        </div>
      )}
    </Dashboard>
  );
}
