import * as React from 'react';

import { Typography } from '@mui/joy';

import { FormInputKey } from '~/common/components/forms/FormInputKey';
import { InlineError } from '~/common/components/InlineError';
import { Link } from '~/common/components/Link';
import { SetupFormRefetchButton } from '~/common/components/forms/SetupFormRefetchButton';

import { DModelSourceId } from '../../store-llms';
import { useLlmUpdateModels } from '../useLlmUpdateModels';
import { useSourceSetup } from '../useSourceSetup';

import { ModelVendorMistral } from './mistral.vendor';


const MISTRAL_REG_LINK = 'https://console.mistral.ai/';


export function MistralSourceSetup(props: { sourceId: DModelSourceId }) {

  // external state
  const { source, sourceHasLLMs, sourceSetupValid, access, hasNoBackendCap: needsUserKey, updateSetup } =
    useSourceSetup(props.sourceId, ModelVendorMistral);

  // derived state
  const { oaiKey: mistralKey } = access;

  const shallFetchSucceed = !needsUserKey || (!!mistralKey && sourceSetupValid);
  const showKeyError = !!mistralKey && !sourceSetupValid;

  // fetch models
  const { isFetching, refetch, isError, error } =
    useLlmUpdateModels(ModelVendorMistral, access, !sourceHasLLMs && shallFetchSucceed, source);

  return <>

    <Typography level='body-sm'>
      In order of capabilities we have Large, Medium, Small (Open 8x7B = Small 2312) and Tiny (Open 7B = Tiny 2312) models.
      Note the elegance of the numbers, representing the Year and Month or release (YYMM).
    </Typography>

    <SetupFormRefetchButton refetch={refetch} disabled={/*!shallFetchSucceed ||*/ isFetching} loading={isFetching} error={isError} />

    {isError && <InlineError error={error} />}

  </>;
}