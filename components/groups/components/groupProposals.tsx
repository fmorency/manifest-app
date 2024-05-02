import {
  ExtendedQueryGroupsByMemberResponseSDKType,
  useGroupsByMember,
  useProposalsByPolicyAccount,
  useTallyCount,
  useVotesByProposal,
} from "@/hooks/useQueries";

import ProfileAvatar from "@/utils/identicon";
import VoteDetailsModal from "@/components/groups/modals/voteDetailsModal";
import { QueryTallyResultResponseSDKType } from "@chalabi/manifestjs/dist/codegen/cosmos/group/v1/query";
import {
  MemberSDKType,
  ProposalSDKType,
} from "@chalabi/manifestjs/dist/codegen/cosmos/group/v1/types";
import Link from "next/link";
import { truncateString } from "@/utils";
import { useEffect, useState } from "react";
import { PiArrowDownLight } from "react-icons/pi";
import { useRouter } from "next/router";
import { useChain } from "@cosmos-kit/react";

export default function ProposalsForPolicy({
  policyAddress,
}: {
  policyAddress: string;
}) {
  const { address } = useChain("manifest");

  const [tallies, setTallies] = useState<
    { proposalId: bigint; tally: QueryTallyResultResponseSDKType }[]
  >([]);

  const updateTally = (
    proposalId: bigint,
    newTally: QueryTallyResultResponseSDKType
  ) => {
    setTallies((prevTallies) => {
      const existingTallyIndex = prevTallies.findIndex(
        (item) => item.proposalId === proposalId
      );

      if (existingTallyIndex >= 0) {
        const newTallies = [...prevTallies];
        newTallies[existingTallyIndex] = { proposalId, tally: newTally };
        return newTallies;
      } else {
        return [...prevTallies, { proposalId, tally: newTally }];
      }
    });
  };

  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleRowClick = (proposal: any) => {
    setSelectedProposal(proposal);
    const modal = document.getElementById(
      `vote_modal_${proposal.id}`
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  const {
    groupByMemberData,
    isGroupByMemberLoading,
    isGroupByMemberError,
    refetchGroupByMember,
  } = useGroupsByMember(address ?? "");

  const { proposals, isProposalsLoading, isProposalsError, refetchProposals } =
    useProposalsByPolicyAccount(policyAddress ?? "");

  const members =
    groupByMemberData?.groups.filter(
      (group) => group.policies[0]?.address === policyAddress
    )[0]?.members ?? [];
  const admin =
    groupByMemberData.groups.filter(
      (group) => group.policies[0]?.address === policyAddress
    )[0]?.admin ?? "";
  const groupName =
    groupByMemberData.groups.filter(
      (group) => group.policies[0]?.address === policyAddress
    )[0]?.ipfsMetadata?.title ?? "";

  function isProposalPassing(tally: QueryTallyResultResponseSDKType) {
    const yesCount = parseFloat(tally?.tally?.yes_count ?? "0");
    const noCount = parseFloat(tally?.tally?.no_count ?? "0");
    const noWithVetoCount = parseFloat(tally?.tally?.no_with_veto_count ?? "0");
    const abstainCount = parseFloat(tally?.tally?.abstain_count ?? "0");

    const passingThreshold = yesCount > noCount;

    return {
      isPassing: passingThreshold,
      yesCount,
      noCount,
      noWithVetoCount,
      abstainCount,
    };
  }

  return (
    <section className="">
      <div className="flex flex-col  max-w-5xl mx-auto w-full  ">
        <div className="  rounded-md   w-full mt-4 justify-center  shadow  bg-base-200 items-center mx-auto transition-opacity duration-300 ease-in-out animate-fadeIn">
          <div className="rounded-md px-4 py-2 bg-base-100  border-r-4 border-r-base-300 max-h-[23rem]  min-h-[23rem] border-b-4 border-b-base-300 ">
            <div className="px-4 py-2 border-b flex flex-row justify-between items-center border-base-content">
              <h3 className="text-lg font-bold leading-6">proposals</h3>

              <Link href={`/groups/submit-proposal/${policyAddress}`} passHref>
                <button
                  aria-disabled={!policyAddress}
                  className="btn btn-xs btn-primary"
                >
                  new proposal
                </button>
              </Link>
            </div>
            {isProposalsLoading ? (
              <div className="flex px-4 flex-col gap-4 w-full mx-auto justify-center mt-6 items-center transition-opacity duration-300 ease-in-out animate-fadeIn">
                <div className="skeleton h-4 w-full "></div>
                <div className="skeleton h-4 w-full "></div>
                <div className="skeleton h-4 w-full "></div>
                <div className="skeleton h-4 w-full "></div>
                <div className="skeleton h-4 w-full "></div>
                <div className="skeleton h-4 w-full "></div>
                <div className="skeleton h-4 w-full "></div>
                <div className="skeleton h-4 w-full "></div>
              </div>
            ) : isProposalsError ? (
              <div className="py-2">Error loading proposals</div>
            ) : (
              <div className="overflow-y-auto max-h-[18rem] min-h-[18rem]">
                {proposals?.length === 0 && (
                  <div className="flex flex-col my-36 gap-4 w-full mx-auto justify-center items-center transition-opacity duration-300 ease-in-out animate-fadeIn">
                    <div className="text-center underline">
                      No proposals found for this policy
                    </div>
                  </div>
                )}
                {proposals?.length > 0 && (
                  <table className="table w-full table-pin-rows z-0 transition-opacity  duration-300 ease-in-out animate-fadeIn text-left">
                    <thead>
                      <tr className="w-full">
                        <th className="w-1/6">#</th>
                        <th className="w-1/6">title</th>
                        <th className="w-1/6">time left</th>
                        <th className="w-1/6">type</th>
                        <th className="w-1/6">status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposals?.map((proposal, index) => {
                        // Find the corresponding tally for this proposal
                        const proposalTally = tallies.find(
                          (t) => t.proposalId === proposal.id
                        );
                        const { isPassing = false } = proposalTally
                          ? isProposalPassing(proposalTally.tally)
                          : {};

                        return (
                          <tr
                            onClick={() => handleRowClick(proposal)}
                            key={index}
                            className={`w-full
                            hover:bg-base-200 !important 
                            active:bg-base-100 
                            focus:bg-base-300 focus:shadow-inner 
                            transition-all duration-200 
                            cursor-pointer`}
                          >
                            <td className="">#{proposal.id.toString()}</td>
                            <td className="w-2/6 truncate">{proposal.title}</td>
                            <td className="w-1/6">5 days</td>
                            <td className="w-1/6"> Send</td>
                            <td className="w-1/6">
                              {isPassing ? "Passing" : "Failing"}
                            </td>
                            <Modal
                              admin={admin}
                              proposalId={proposal.id}
                              members={members}
                              proposal={proposal}
                              updateTally={updateTally}
                            />
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Modal({
  proposalId,
  members,
  proposal,
  admin,
  updateTally,
}: {
  proposalId: bigint;
  members: MemberSDKType[];
  proposal: ProposalSDKType;
  admin: string;
  updateTally: (
    proposalId: bigint,
    tally: QueryTallyResultResponseSDKType
  ) => void;
}) {
  const { tally, isTallyLoading, isTallyError, refetchTally } =
    useTallyCount(proposalId);

  useEffect(() => {
    if (tally) {
      updateTally(proposalId, tally);
    }
  }, [tally]);

  const { votes, refetchVotes } = useVotesByProposal(proposalId);

  return (
    <VoteDetailsModal
      admin={admin}
      members={members}
      tallies={tally ?? ({} as QueryTallyResultResponseSDKType)}
      votes={votes}
      proposal={proposal}
      modalId={`vote_modal_${proposal?.id}`}
      refetchVotes={refetchVotes}
      refetchTally={refetchTally}
    />
  );
}
