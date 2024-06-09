import { WalletSection } from "@/components";
import { ParamsSDKType as PoaParamType } from "@chalabi/manifestjs/dist/codegen/strangelove_ventures/poa/v1/params";
import { useChain } from "@cosmos-kit/react";
import ValidatorList from "@/components/admins/components/validatorList";
import Head from "next/head";

import React from "react";

import AdminOptions from "@/components/admins/components/adminOptions";
import StakingParams from "@/components/admins/components/stakingParams";
import {
  useGroupsByAdmin,
  usePendingValidators,
  usePoaParams,
  useStakingParams,
  useValidators,
} from "@/hooks";
import {
  ParamsSDKType,
  ValidatorSDKType,
} from "@chalabi/manifestjs/dist/codegen/cosmos/staking/v1beta1/staking";
import { PiWarning } from "react-icons/pi";

export default function Admins() {
  const { address, isWalletConnected } = useChain("manifest");
  const { poaParams, isPoaParamsLoading, refetchPoaParams } = usePoaParams();
  const {
    pendingValidators,
    isPendingValidatorsLoading,
    refetchPendingValidators,
  } = usePendingValidators();
  const { stakingParams, isParamsLoading, refetchParams } = useStakingParams();
  const { validators, isActiveValidatorsLoading, refetchActiveValidatorss } =
    useValidators();

  const { groupByAdmin } = useGroupsByAdmin(
    "manifest1afk9zr2hn2jsac63h4hm60vl9z3e5u69gndzf7c99cqge3vzwjzsfmy9qj"
  );
  const group = groupByAdmin?.groups?.[0];

  const isMember = group?.members?.some(
    (member) => member?.member?.address === address
  );

  return (
    <>
      <div className="max-w-5xl relative py-[2rem] mx-auto lg:mx-auto ">
        <Head>
          <title>Admins</title>
          <meta name="description" content="Interact with the PoA module" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="-ml-4 -mt-2 flex items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="tracking-tight leading-none text-4xl xl:text-4xl md:block hidden">
              Admins
            </h3>
            <h3 className="tracking-tight px-4 leading-none text-4xl xl:text-4xl md:hidden block">
              Admins
            </h3>
          </div>
        </div>
        <div className="mt-6 p-4 gap-4 flex flex-col  lg:flex-row md:flex-col sm:flex-col xs:flex-col rounded-md bg-base-200/20 blur-40 shadow-lg transition-opacity duration-300 ease-in-out animate-fadeIn">
          {!isWalletConnected && (
            <section className=" transition-opacity duration-300 ease-in-out animate-fadeIn">
              <div className="grid max-w-screen-xl bg-base-100 p-12 rounded-md w-full  mx-auto lg:gap-8 xl:gap-0  lg:grid-cols-12">
                <div className="mr-auto place-self-center lg:col-span-7">
                  <h1 className="max-w-2xl mb-4 text-2xl font-extrabold tracking-tight leading-none md:text-3xl xl:text-4xl ">
                    Connect your wallet!
                  </h1>
                  <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl t">
                    Use the button below to connect your wallet and start
                    changing parameters as an admin.
                  </p>
                  <WalletSection chainName="manifest" />
                </div>
                <div className="hidden lg:mt-0 lg:ml-24 lg:col-span-5 lg:flex">
                  <img src="/admin.svg" alt="groups" className=" h-60 w-60" />
                </div>
              </div>
            </section>
          )}

          {/* {!isGroupByMemberLoading && groupByMemberData.groups.length === 0 && (
            <section className=" transition-opacity duration-300 ease-in-out animate-fadeIn">
              <div className="grid max-w-screen-xl bg-base-100 p-12 rounded-md border-r-base-300 border-r-8 border-b-8 border-b-base-300 mx-auto lg:gap-8 xl:gap-0  lg:grid-cols-12">
                <div className="mr-auto place-self-center lg:col-span-7">
                  <h1 className="max-w-2xl mb-4 text-2xl font-extrabold tracking-tight leading-none md:text-3xl xl:text-4xl ">
                    On chain governance for collobrative decision making
                  </h1>
                  <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl t">
                    Groups are sets of members who can submit and vote on
                    proposals together. Proposals are composed of any message
                    type. Create your first group and get started.
                  </p>
                  <Link href="/groups/create" passHref>
                    <button className="mt-6 btn btn-primary btn-lg inline-flex items-center">
                      Create A Group
                    </button>
                  </Link>
                </div>
                <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                  <img src="/groups.svg" alt="groups" />
                </div>
              </div>
            </section>
          )} */}
          {/* {isGroupByMemberLoading && isWalletConnected && (
            <div className="flex flex-col gap-4 w-full  mx-auto justify-center  items-center transition-opacity duration-300 ease-in-out animate-fadeIn">
              <div className="flex flex-row w-full h-[46rem]  gap-4 ">
                <div className="skeleton h-full w-1/3"></div>
                <div className="skeleton h-full w-2/3"></div>
              </div>
              <div className="skeleton h-full w-full"></div>
            </div>
          )} */}
          {isWalletConnected && !isActiveValidatorsLoading && !isMember ? (
            <div className="flex flex-row w-full bg-base-100 rounded-md p-4">
              <div className="flex flex-col w-full h-full gap-4">
                <PiWarning className="text-6xl mx-auto text-red-500" />
                <a className="text-4xl mx-auto">Access Denied</a>
                <p className="text-lg mx-auto text-center max-w-prose">
                  You do not have permission to view this page. Only proof of
                  authority administrators or members of a group that is a proof
                  of authority admin may access this page.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <div className=" flex flex-col md:flex-row sm:flex-col xs:flex-col w-full gap-4 transition-opacity duration-300 ease-in-out animate-fadeIn">
                <div className="flex flex-col gap-4 justify-between items-center w-full">
                  <ValidatorList
                    activeValidators={validators ?? ({} as ValidatorSDKType[])}
                    pendingValidators={
                      pendingValidators ?? ({} as ValidatorSDKType[])
                    }
                  />
                  <div className="flex flex-row gap-4 justify-between items-center w-full">
                    <AdminOptions
                      group={group}
                      poaParams={poaParams ?? ({} as PoaParamType)}
                    />
                    <StakingParams
                      stakingParams={stakingParams ?? ({} as ParamsSDKType)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
