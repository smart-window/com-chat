import { Typography } from '@mui/joy';

import { InlineError } from '~/common/components/InlineError';
import { SetupFormRefetchButton } from '~/common/components/forms/SetupFormRefetchButton';

import { DModelSourceId } from '../../store-llms';
import { useLlmUpdateModels } from '../../llm.client.hooks';
import { useSourceSetup } from '../useSourceSetup';

import { ModelVendorMistral } from './mistral.vendor';

export function MistralSourceSetup(props: { sourceId: DModelSourceId }) {

  // external state
  const { source, sourceHasLLMs, sourceSetupValid, access, hasNoBackendCap: needsUserKey, updateSetup } =
    useSourceSetup(props.sourceId, ModelVendorMistral);

  // derived state
  const { oaiKey: mistralKey } = access;

  const shallFetchSucceed = !needsUserKey || (!!mistralKey && sourceSetupValid);

  // fetch models
  const { isFetching, refetch, isError, error } =
    useLlmUpdateModels(!sourceHasLLMs && shallFetchSucceed, source);

  return <>

    <Typography level='body-sm'>
      In order of capabilities we have Large, Medium, Small (Open 8x7B = Small 2312) and Tiny (Open 7B = Tiny 2312) models.
      Note the elegance of the numbers, representing the Year and Month or release (YYMM).
    </Typography>

    <SetupFormRefetchButton refetch={refetch} disabled={/*!shallFetchSucceed ||*/ isFetching} loading={isFetching} error={isError} />

    {isError && <InlineError error={error} />}

  </>;
}