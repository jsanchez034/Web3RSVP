import Head from "next/head";
import Image from "next/image";
import { gql } from "@apollo/client";
import { useState } from "react";
import connectContract from "../../utils/connectContract";
import Alert from "../../components/Alert";
import RsvpButton from "../../components/RsvpButton";

import client from '../../apollo-client';
import formatTimestamp from '../../utils/formatTimestamp';

import {
  EmojiHappyIcon,
  TicketIcon,
  UsersIcon,
  LinkIcon
} from "@heroicons/react/outline";

function Event({ event }) {
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(null);

  async function newRSVP() {
    try {
      const rsvpContract = connectContract();

      if (rsvpContract) {
        setLoading(true);

        const txn = await rsvpContract.createNewRSVP(event.id, {
          value: event.deposit,
          gasLimit: 3000000,
        });
        console.log("Minting...", txn.hash);

        await txn.wait();
        console.log("Minted --- ", txn.hash);
        setSuccess(true);
        setLoading(false);
        setMessage("Your RSVP has been created successfully.");
      } else {
        console.log("Error getting contract.")
      }
    } catch (err) {
      setSuccess(false);
      setMessage("Error!");
      setLoading(false);
      console.log(err);
    }
  }

  let alertType = null;
  let alertBody = null;
  let alertColor = null;

  if (loading) {
    alertType = "loading";
    alertBody = "Please wait";
    alertColor = "white";
  } else if (success) {
    alertType = "success";
    alertBody = message;
    alertColor = "palegreen";
  } else if (success === false) {
    alertType = "failed";
    alertBody = message;
    alertColor = "palevioletred";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{ event.name } | web3rsvp</title>
        <meta name="description" content={ event.name } />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="relative py-12">
        {
          alertType && (
            <Alert
              alertType={alertType}
              alertBody={alertBody}
              triggerAlert={true}
              color={alertColor}
            />
          )
        }
        <h6 className="mb-2">{formatTimestamp(event.eventTimestamp)}</h6>
        <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl mb-6 lg:mb-12">
          { event.name }
        </h1>
        <div className="flex flex-wrap-reverse lg:flex-nowrap">
          <div className="w-full pr-0 lg:pr-24 xl:pr-32">
            <div className="mb-8 w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
              { event.imageURL && (
                <Image src={event.imageURL} alt="event image" layout="fill" />
              )}
            </div>
            <p>{ event.description }</p>
          </div>
          <div className="max-w-xs w-full flex flex-col gap-4 mb-6 lg:mb-0">
            <RsvpButton event={event} onNewRSVP={newRSVP} />
            <div className="flex item-center">
              <UsersIcon className="w-6 mr-2" />
              <span className="truncate">
                {event.totalRSVPs}/{event.maxCapacity} attending
              </span>
            </div>
            <div className="flex item-center">
              <TicketIcon className="w-6 mr-2" />
              <span className="truncate">1 RSVP per wallet</span>
            </div>
            <div className="flex items-center">
              <EmojiHappyIcon className="w-10 mr-2" />
              <span className="truncate">
                Hosted by{" "}
                <a
                  className="text-indigo-800 truncate hover:underline"
                  href={`${process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL}address/${event.eventOwner}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  { event.eventOwner }
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Event;

export async function getServerSideProps(context) {
  const { id }  = context.params;

  const { data } = await client.query({
    query: gql`
      query Event($id: String!) {
        event(id: $id) {
          id
          eventID
          name
          description
          link
          eventOwner
          eventTimestamp
          maxCapacity
          deposit
          totalRSVPs
          totalConfirmedAttendees
          imageURL
          rsvps {
            id
            attendee {
              id
            }
          }
        }
      }
    `,
    variables: {
      id,
    },
  });

  return {
    props: {
      event: data.event
    },
  };
}
