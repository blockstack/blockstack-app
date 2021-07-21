import { atom } from 'jotai';
import { currentNetworkState } from '@store/networks';
import {
  Configuration,
  AccountsApi,
  SmartContractsApi,
  InfoApi,
  BlocksApi,
  FeesApi,
} from '@stacks/blockchain-api-client';
import { fetcher } from '@common/api/wrapped-fetch';
import { MICROBLOCKS_ENABLED } from '@common/constants';
import type { Middleware, RequestContext } from '@stacks/blockchain-api-client';

// Used to display microblock, this passes unanchored=true to the search param
const unanchoredMiddleware: Middleware = {
  pre: (context: RequestContext) => {
    const url = new URL(context.url);
    url.searchParams.set('unanchored', 'true');
    return Promise.resolve({
      init: context.init,
      url: url.toString(),
    });
  },
};

export const apiClientConfiguration = atom<Configuration>(get => {
  const network = get(currentNetworkState);
  const middleware: Middleware[] = [];
  if (MICROBLOCKS_ENABLED) middleware.push(unanchoredMiddleware);
  return new Configuration({
    basePath: network.url,
    fetchApi: fetcher,
    middleware,
  });
});

export const smartContractClientState = atom<SmartContractsApi>(get => {
  const config = get(apiClientConfiguration);
  return new SmartContractsApi(config);
});

export const accountsApiClientState = atom<AccountsApi>(get => {
  const config = get(apiClientConfiguration);
  return new AccountsApi(config);
});

export const infoApiClientState = atom<InfoApi>(get => {
  const config = get(apiClientConfiguration);
  return new InfoApi(config);
});

export const blocksApiClientState = atom<BlocksApi>(get => {
  const config = get(apiClientConfiguration);
  return new BlocksApi(config);
});

export const feesApiClientState = atom<FeesApi>(get => {
  const config = get(apiClientConfiguration);
  return new FeesApi(config);
});
