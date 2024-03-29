import { LocalAIIcon } from '~/common/components/icons/vendors/LocalAIIcon';

import type { IModelVendor } from '../IModelVendor';
import type { OpenAIAccessSchema } from '../../server/openai/openai.router';

import { LLMOptionsOpenAI, ModelVendorOpenAI } from '../openai/openai.vendor';
import { OpenAILLMOptions } from '../openai/OpenAILLMOptions';

import { LocalAISourceSetup } from './LocalAISourceSetup';
import { backendCaps } from '~/modules/backend/state-backend';


export interface SourceSetupLocalAI {
  localAIHost: string;  // use OpenAI-compatible non-default hosts (full origin path)
  localAIKey: string;   // use OpenAI-compatible API keys
}

export const ModelVendorLocalAI: IModelVendor<SourceSetupLocalAI, OpenAIAccessSchema, LLMOptionsOpenAI> = {
  id: 'localai',
  name: 'LocalAI',
  rank: 22,
  location: 'local',
  instanceLimit: 4,
  hasBackendCap: () => {
    const { hasLlmLocalAIHost, hasLlmLocalAIKey } = backendCaps();
    return hasLlmLocalAIHost || hasLlmLocalAIKey;
  },

  // components
  Icon: LocalAIIcon,
  SourceSetupComponent: LocalAISourceSetup,
  LLMOptionsComponent: OpenAILLMOptions,

  // functions
  initializeSetup: () => ({
    localAIHost: '',
    localAIKey: '',
  }),
  getTransportAccess: (partialSetup) => ({
    dialect: 'localai',
    oaiKey: partialSetup?.localAIKey || '',
    oaiOrg: '',
    oaiHost: partialSetup?.localAIHost || '',
    heliKey: '',
    moderationCheck: false,
    defaultCheck: false,
  }),

  // OpenAI transport ('localai' dialect in 'access')
  rpcUpdateModelsQuery: ModelVendorOpenAI.rpcUpdateModelsQuery,
  rpcChatGenerateOrThrow: ModelVendorOpenAI.rpcChatGenerateOrThrow,
  streamingChatGenerateOrThrow: ModelVendorOpenAI.streamingChatGenerateOrThrow,
};
