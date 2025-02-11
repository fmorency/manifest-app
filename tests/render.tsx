import React from 'react';
import { render } from '@testing-library/react';
import { ChainProvider } from '@cosmos-kit/react';
import { ToastProvider } from '@/contexts';

import {
  assets as manifestAssets,
  chain as manifestChain,
} from 'chain-registry/testnet/manifesttestnet';
import {
  assets as osmosisAssets,
  chain as osmosisChain,
} from 'chain-registry/testnet/osmosistestnet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SkipProvider } from '@/contexts/skipGoContext';

const defaultOptions = {
  chains: [manifestChain, osmosisChain],
  assetLists: [manifestAssets, osmosisAssets],
  wallets: [],
};

export const renderWithChainProvider = (ui: React.ReactElement, options = {}) => {
  const combinedOptions = { ...defaultOptions, ...options };
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <ChainProvider {...combinedOptions}>
        <SkipProvider>
          <ToastProvider>{ui}</ToastProvider>
        </SkipProvider>
      </ChainProvider>
    </QueryClientProvider>,
    options
  );
};
