// Next JS
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "@next/font/google";
import { GetStaticProps } from "next";

// React
import { useState } from "react";

// GraphQL
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// Joeun DAO
import JoeunLogo from "@/public/joeundao-logo.png";
import SafeLogo from "@/public/safe.jpg";
import SnapshotLogo from "@/public/snapshot.jpg";
import { SnapshotProposals } from "@/lib/types";

const inter = Inter({ subsets: ["latin"] });

export default function JoeunDAO(props: { proposals: SnapshotProposals[] }) {
  const { proposals } = props;
  console.log(proposals);
  return (
    <>
      <Head>
        <title>Joeun DAO</title>
        <meta name="description" content="DAO for doing good." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/joeundao-logo.png" type="image/png" />
      </Head>
      <main>
        <div className="container items-center justify-between p-4 mx-auto mt-10 sm:flex">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src={JoeunLogo}
                width={100}
                height={100}
                alt="Joeun DAO"
                className="rounded-lg shadow "
                priority
              />
            </Link>
            <div className="ml-4">
              <h1 className="text-2xl">Joeun DAO 좋은다오</h1>
              <p className="text-gray-500">
                ❤️ Decentralized Community for Good.
              </p>
            </div>
          </div>
          <Link href="https://app.safe.global/eth:0xCA17B020390075B0a91C89ba1322A1a11c0efac5/home">
            <div className="flex items-center gap-4 px-4 py-3 mt-10 bg-green-200 border rounded-lg hover:border-green-500 sm:mt-0 active:border-green-800 active:bg-green-300">
              <Image
                src={SafeLogo}
                width={40}
                height={40}
                alt="Safe Logo"
                className="rounded-full"
              />
              <div>Joeun Tresuary Safe</div>
            </div>
          </Link>
        </div>

        <div className="container p-4 mx-auto mt-10">
          <h2 className="mb-4 text-2xl font-bold">Proposals</h2>
          {proposals.map((proposal, index) => {
            return (
              <Link
                href={
                  `https://snapshot.org/#/joeundao.eth/proposal/` + proposal.id
                }
                key={proposal.id}
              >
                <div className="p-4 mb-4 bg-white border rounded-lg shadow border-gray-50 hover:border-pink-500 active:border-blue-400">
                  <div className="flex gap-2 mb-3">
                    <Image
                      src={SnapshotLogo}
                      width={30}
                      height={30}
                      alt="Snapshot Logo"
                    />
                    <h3 className="text-lg font-bold text-gray-700">
                      {proposal.title}
                    </h3>
                  </div>
                  <hr />
                  <div className="mt-4 text-gray-500">
                    {proposal.body.slice(0, 150)} ...
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const client = new ApolloClient({
    uri: "https://hub.snapshot.org/graphql",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query {
        proposals(
          first: 20
          skip: 0
          where: { space_in: ["joeundao.eth"], state: "open" }
          orderBy: "created"
          orderDirection: desc
        ) {
          id
          title
          body
          choices
          start
          end
          snapshot
          state
          scores
          scores_by_strategy
          scores_total
          scores_updated
          author
          space {
            id
            name
          }
        }
      }
    `,
  });

  console.log("Data", data);

  return {
    props: {
      proposals: data.proposals,
    },
  };
};
