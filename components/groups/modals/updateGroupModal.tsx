import React, { useEffect, useState } from "react";
import { IPFSMetadata } from "@/hooks/useQueries";
import { cosmos } from "@chalabi/manifestjs";
import { PiTrashLight, PiPlusCircleThin, PiInfoLight } from "react-icons/pi";
import { useTx, useFeeEstimation } from "@/hooks";
import { chainName } from "@/config";

interface Member {
  address: string;
  metadata: string;
  weight: string;
  added_at: Date;
  isCoreMember: boolean;
  isActive: boolean;
}

interface Group {
  group: {
    id: string;
    admin: string;
    metadata: string;
    ipfsMetadata: IPFSMetadata | null;
    members: { group_id: string; member: Member }[];
    policies: any[];
  };
  address: string;
}

export function UpdateGroupModal({
  group,
  modalId,
  address,
}: Group & { modalId: string }) {
  const { tx } = useTx(chainName);
  const { estimateFee } = useFeeEstimation(chainName);

  const {
    updateGroupAdmin,
    updateGroupMembers,
    updateGroupMetadata,
    updateGroupPolicyAdmin,
    updateGroupPolicyDecisionPolicy,
    updateGroupPolicyMetadata,
  } = cosmos.group.v1.MessageComposer.withTypeUrl;

  const [name, setName] = useState(group.ipfsMetadata?.title || "");
  const [authors, setAuthors] = useState(group.ipfsMetadata?.authors || "");
  const [summary, setSummary] = useState(group.ipfsMetadata?.summary || "");
  const [forum, setForum] = useState(
    group.ipfsMetadata?.proposalForumURL || ""
  );
  const [description, setDescription] = useState(
    group.ipfsMetadata?.details || ""
  );
  const [threshold, setThreshold] = useState(
    group.policies[0]?.decision_policy?.threshold || ""
  );
  const [windowInput, setWindowInput] = useState("");
  const [votingUnit, setVotingUnit] = useState("days");
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    setName(group.ipfsMetadata?.title || "");
    setAuthors(group.ipfsMetadata?.authors || "");
    setSummary(group.ipfsMetadata?.summary || "");
    setForum(group.ipfsMetadata?.proposalForumURL || "");
    setDescription(group.ipfsMetadata?.details || "");
    setThreshold(group.policies[0]?.decision_policy?.threshold || "");
  }, [group]);

  const convertToSeconds = (input: string, unit: string) => {
    const value = parseFloat(input);
    let seconds;
    switch (unit) {
      case "hours":
        seconds = value * 3600;
        break;
      case "days":
        seconds = value * 86400;
        break;
      case "weeks":
        seconds = value * 604800;
        break;
      case "months":
        seconds = value * 2592000;
        break;
      default:
        seconds = value;
    }
    return seconds;
  };

  const [windowSeconds, setWindowSeconds] = useState(() =>
    convertToSeconds(windowInput, votingUnit)
  );

  const handleUnitChange = (e: { target: { value: any } }) => {
    const newUnit = e.target.value;
    setVotingUnit(newUnit);
    setWindowSeconds(convertToSeconds(windowInput, newUnit));
  };

  const handleWindowInputChange = (e: { target: { value: any } }) => {
    const newValue = e.target.value;
    setWindowInput(newValue);
    setWindowSeconds(convertToSeconds(newValue, votingUnit));
  };

  const votingWindow = parseFloat(
    group?.policies[0]?.decision_policy?.windows?.voting_period.slice(0, -1)
  );

  let formattedVotingWindow;
  switch (votingUnit) {
    case "hours":
      formattedVotingWindow = votingWindow / 60 / 60;
      break;
    case "days":
      formattedVotingWindow = votingWindow / 24 / 60 / 60;
      break;
    case "weeks":
      formattedVotingWindow = votingWindow / 7 / 24 / 60 / 60;
      break;
    case "months":
      formattedVotingWindow = votingWindow / 30 / 24 / 60 / 60;
      break;
    default:
      formattedVotingWindow = votingWindow;
  }

  const isAdmin = (address: string) => {
    const adminAddresses = [group.admin].filter(Boolean);
    return adminAddresses.includes(address);
  };

  const isPolicyAdmin = (address: string) => {
    const adminAddresses = [group.policies[0]?.admin].filter(Boolean);
    return adminAddresses.includes(address);
  };

  const initializeMembers = () => {
    return group.members.map((member) => ({
      group_id: member.group_id,
      member: member.member,
      isCoreMember: true,
      isActive: true,
      isAdmin: isAdmin(member.member.address),
      isPolicyAdmin: isPolicyAdmin(member.member.address),
    }));
  };

  const [members, setMembers] = useState(initializeMembers());

  useEffect(() => {
    setMembers(initializeMembers());
  }, [group]);

  const addMember = () => {
    const newMember = {
      group_id: members[0].group_id,
      member: {
        address: "",
        metadata: "",
        weight: "",
        added_at: new Date(),
      } as Member,
      isCoreMember: false,
      isActive: true,
      isAdmin: false,
      isPolicyAdmin: false,
    };
    setMembers([...members, newMember]);
  };

  const handleChange = (index: number, field: string, value: string) => {
    setMembers(
      members.map((member, idx) =>
        idx === index
          ? { ...member, member: { ...member.member, [field]: value } }
          : member
      )
    );
  };

  const handleMemberRemoval = (index: number) => {
    const member = members[index];
    if (member.isCoreMember) {
      const updatedMember = {
        ...member,
        isActive: !member.isActive,
        member: { ...member.member, weight: member.isActive ? "0" : "1" },
      };
      setMembers(
        members.map((mem, idx) => (idx === index ? updatedMember : mem))
      );
    } else {
      setMembers(members.filter((_, idx) => idx !== index));
    }
  };

  const hasStateChanged = (newValue: any, originalValue: any) => {
    return (
      newValue !== null && newValue !== undefined && newValue !== originalValue
    );
  };

  const buildMessages = () => {
    const messages = [];

    const newAdmin = members?.filter((member) => member?.isAdmin)[0]?.member
      ?.address;
    if (hasStateChanged(newAdmin, group.admin)) {
      messages.push(
        updateGroupAdmin({
          admin: group.admin,
          groupId: BigInt(group?.members[0]?.group_id),
          newAdmin: newAdmin,
        })
      );
    }

    const membersChanged = members.some(
      (member, index) =>
        hasStateChanged(
          member.member.address,
          group.members[index]?.member.address
        ) ||
        hasStateChanged(
          member.member.metadata,
          group.members[index]?.member.metadata
        ) ||
        hasStateChanged(
          member.member.weight,
          group.members[index]?.member.weight
        )
    );
    if (membersChanged) {
      messages.push(
        updateGroupMembers({
          admin: group.admin,
          groupId: BigInt(group?.members[0]?.group_id),
          memberUpdates: members?.map((member) => ({
            address: member?.member.address,
            metadata: member?.member.metadata,
            weight: member?.member.weight,
            added_at: member?.member.added_at,
          })),
        })
      );
    }

    if (
      hasStateChanged(name, group.ipfsMetadata?.title) ||
      hasStateChanged(authors, group.ipfsMetadata?.authors) ||
      hasStateChanged(summary, group.ipfsMetadata?.summary) ||
      hasStateChanged(forum, group.ipfsMetadata?.proposalForumURL) ||
      hasStateChanged(description, group.ipfsMetadata?.details)
    ) {
      messages.push(
        updateGroupMetadata({
          admin: group?.admin,
          groupId: BigInt(group?.members[0]?.group_id),
          metadata: JSON.stringify({
            title: name,
            authors: authors,
            summary: summary,
            proposalForumURL: forum,
            details: description,
          }),
        })
      );
    }

    const newPolicyAdmin = members?.filter((member) => member?.isPolicyAdmin)[0]
      ?.member?.address;
    if (hasStateChanged(newPolicyAdmin, group.policies[0]?.admin)) {
      messages.push(
        updateGroupPolicyAdmin({
          groupPolicyAddress: group?.policies[0].address,
          admin: group?.admin,
          newAdmin: newPolicyAdmin,
        })
      );
    }

    if (
      hasStateChanged(
        threshold,
        group.policies[0]?.decision_policy?.threshold
      ) ||
      hasStateChanged(
        windowSeconds,
        group.policies[0]?.decision_policy?.windows?.voting_period.seconds
      )
    ) {
      messages.push(
        updateGroupPolicyDecisionPolicy({
          groupPolicyAddress: group.policies[0].address,
          admin: group.admin,
          decisionPolicy: {
            threshold: threshold,
            percentage: "",
            windows: {
              votingPeriod: {
                nanos: 0,
                seconds: BigInt(0),
              },
              minExecutionPeriod: {
                nanos: 0,
                seconds: BigInt(0),
              },
            },
          },
        })
      );
    }

    if (
      messages.includes(
        updateGroupMetadata({
          admin: group?.admin,
          groupId: BigInt(group?.members[0]?.group_id),
          metadata: JSON.stringify({
            title: name,
            authors: authors,
            summary: summary,
            proposalForumURL: forum,
            details: description,
          }),
        })
      )
    ) {
      messages.push(
        updateGroupPolicyMetadata({
          groupPolicyAddress: group.policies[0].address,
          admin: group.admin,
          metadata: JSON.stringify({
            title: name,
            authors: authors,
            summary: summary,
            proposalForumURL: forum,
            details: description,
          }),
        })
      );
    }

    return messages;
  };

  const handleUpdate = async () => {
    const messages = buildMessages();

    if (messages.length === 0) {
      console.log("No changes detected");
      return;
    }

    setIsSigning(true);
    try {
      const fee = await estimateFee(address, messages);
      await tx(messages, {
        fee,
        onSuccess: () => {
          console.log("Update successful");
        },
      });
    } catch (error) {
      console.error("Error during update:", error);
    } finally {
      setIsSigning(false);
    }
  };
  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box absolute max-w-6xl mx-auto rounded-lg md:ml-20 shadow-lg min-h-96">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-1 top-1">
            ✕
          </button>
        </form>
        <h3 className="text-lg font-semibold ">Update Group</h3>
        <div className="divider divider-horizon -mt-0 "></div>
        <div className="md:flex sm:grid sm:grid-cols-1 md:flex-row gap-4  justify-between items-center ">
          <div className="relative bg-base-300 rounded-md p-4 sm:w-full md:w-1/2 max-w-6xl h-[480px] ">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="flex flex-row mb-2 gap-2 items-center">
                  <label htmlFor="name" className="block  text-sm font-medium">
                    Group Name
                  </label>
                  <div
                    className=""
                    data-tip="Group Name (can not exceed 24 characters)"
                  >
                    <PiInfoLight className="hover:group-[]" />
                  </div>
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder={
                    group?.ipfsMetadata?.title ?? "No title available"
                  }
                  maxLength={24}
                />
              </div>
              <div>
                <label
                  htmlFor="authors"
                  className="block mb-2 text-sm font-medium"
                >
                  Authors
                </label>
                <input
                  type="text"
                  id="authors"
                  name="authors"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder={
                    group?.ipfsMetadata?.authors ?? "No authors available"
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="summary"
                  className="block mb-2 text-sm font-medium"
                >
                  Summary
                </label>
                <input
                  type="text"
                  id="summary"
                  name="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder={
                    group?.ipfsMetadata?.summary ?? "No summary available"
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="threshold"
                  className="block mb-2 text-sm font-medium"
                >
                  Threshold
                </label>
                <input
                  type="number"
                  id="threshold"
                  name="threshold"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder={
                    group?.policies[0]?.decision_policy?.threshold ??
                    "No threshold available"
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="forum"
                  className="block mb-2 text-sm font-medium"
                >
                  Forum
                </label>
                <input
                  type="text"
                  id="forum"
                  name="forum"
                  value={forum}
                  onChange={(e) => setForum(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder={
                    group?.ipfsMetadata?.proposalForumURL ??
                    "No forum URL available"
                  }
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="window"
                  className="text-sm font-medium mb-2 block"
                >
                  Voting Window
                </label>
                <div className="flex flex-row gap-3">
                  <input
                    type="number"
                    id="window"
                    name="window"
                    value={windowInput}
                    onChange={handleWindowInputChange}
                    className="input input-bordered w-6/12"
                    placeholder={formattedVotingWindow.toString()}
                  />
                  <select
                    onChange={handleUnitChange}
                    value={votingUnit}
                    className="select select-bordered w-6/12 p-2"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea w-full textarea-bordered"
                  placeholder={
                    group?.ipfsMetadata?.details ?? "No description available"
                  }
                ></textarea>
              </div>
            </div>
          </div>
          <div className="relative p-4 bg-base-300 rounded-md sm:w-full md:w-1/2 max-w-6xl h-[480px]   ">
            <div className="flex flex-row justify-between items-center mb-2 -mt-1">
              <label className="text-sm font-medium ">Members</label>
              <button
                className="btn btn-xs btn-primary justify-center items-center"
                onClick={addMember}
              >
                +
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2  max-h-[26rem] overflow-y-auto">
              {members.map((member, index) => (
                <div
                  key={index}
                  className={`flex relative flex-col gap-2 px-4 py-2 rounded-md border-4 ${
                    member.isAdmin && member.isPolicyAdmin
                      ? "border-r-primary border-b-primary border-l-secondary border-t-secondary"
                      : member.isAdmin
                      ? "border-r-primary border-b-primary border-t-transparent border-l-transparent"
                      : member.isPolicyAdmin
                      ? "border-l-secondary border-t-secondary border-r-base-100 border-b-base-100 "
                      : "border-r-transparent border-b-transparent border-t-transparent border-l-transparent"
                  } transition-all duration-200 max-h-[12.4rem] ${
                    !member.isActive ? "bg-base-100" : "bg-base-200"
                  }  `}
                >
                  <div className="flex flex-row justify-between items-center">
                    <span className="text-light text-md"># {index + 1}</span>

                    <button
                      onClick={() => handleMemberRemoval(index)}
                      className={`btn btn-sm ${
                        member.isActive
                          ? "text-red-500 hover:bg-red-500"
                          : "text-primary hover:bg-primary "
                      }  hover:text-white bg-base-300`}
                    >
                      {member.isActive ? (
                        <PiTrashLight />
                      ) : (
                        <PiPlusCircleThin />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col gap-4 mb-2">
                    <input
                      type="text"
                      disabled={member.isCoreMember && !member.isActive}
                      value={member.member.metadata}
                      onChange={(e) =>
                        handleChange(index, "metadata", e.target.value)
                      }
                      className="input input-sm input-bordered w-full disabled:border-base-100"
                      placeholder={
                        member.isCoreMember ? member.member.metadata : "Name"
                      }
                    />

                    <input
                      type="text"
                      disabled={member.isCoreMember}
                      value={member.member.address}
                      onChange={(e) =>
                        handleChange(index, "address", e.target.value)
                      }
                      className="input input-sm input-bordered w-full disabled:border-base-100"
                      placeholder={
                        member.isCoreMember ? member.member.address : "Address"
                      }
                    />
                    <input
                      type="number"
                      disabled={member.isCoreMember && !member.isActive}
                      value={
                        member.isCoreMember && !member.isActive
                          ? "0"
                          : member.member.weight
                      }
                      onChange={(e) =>
                        handleChange(index, "weight", e.target.value)
                      }
                      className="input input-sm input-bordered w-full disabled:border-base-100"
                      placeholder={
                        member.isCoreMember ? member.member.weight : "Weight"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-neutral mr-2">Cancel</button>
          </form>
          <button
            className="btn btn-primary max-w-[6rem] w-full"
            onClick={handleUpdate}
            disabled={isSigning || buildMessages().length === 0}
          >
            {isSigning ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
