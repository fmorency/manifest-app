import React, { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

export const TruncatedAddressWithCopy = ({
  address,
  slice,
  size,
}: {
  address: string;
  slice: number;
  size?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (size === "small") {
    return (
      <div
        className="flex items-center space-x-2 text-xs min-w-22"
        onClick={handleCopy}
        style={{ cursor: "pointer" }}
      >
        <span className="truncate">{`${address?.slice(
          0,
          slice
        )}...${address?.slice(-6)}`}</span>
        {copied ? <FiCheck size="10" /> : <FiCopy size="10" />}
      </div>
    );
  }

  return (
    <div
      className="flex items-center space-x-2 min-w-22"
      onClick={handleCopy}
      style={{ cursor: "pointer" }}
    >
      <span className="truncate">{`${address?.slice(
        0,
        slice
      )}...${address?.slice(-6)}`}</span>
      {copied ? <FiCheck size="16" /> : <FiCopy size="16" />}
    </div>
  );
};

export const AddressWithCopy = ({ address }: { address: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div
      className="flex items-center space-x-2"
      onClick={handleCopy}
      style={{ cursor: "pointer" }}
    >
      <span>{address}</span>
      {copied ? <FiCheck size="16" /> : <FiCopy size="16" />}
    </div>
  );
};
