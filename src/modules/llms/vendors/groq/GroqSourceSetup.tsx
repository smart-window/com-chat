import * as React from 'react';

import { Typography } from '@mui/joy';

import { InlineError } from '~/common/components/InlineError';
import { Link } from '~/common/components/Link';
import { SetupFormRefetchButton } from '~/common/components/forms/SetupFormRefetchButton';

import type { DModelSourceId } from '../../store-llms';
import { ModelVendorGroq } from './groq.vendor';
import { useLlmUpdateModels } from '../../llm.client.hooks';
import { useSourceSetup } from '../useSourceSetup';


const GROQ_REG_LINK = 'https://console.groq.com/keys';


export function GroqSourceSetup(props: { sourceId: DModelSourceId }) {

  // external state
  const {
    source, sourceHasLLMs, access,
    sourceSetupValid, hasNoBackendCap: needsUserKey, updateSetup,
  } = useSourceSetup(props.sourceId, ModelVendorGroq);

  // derived state
  const { oaiKey: groqKey } = access;

  // key validation
  const shallFetchSucceed = !needsUserKey || (!!groqKey && sourceSetupValid);
  const showKeyError = !!groqKey && !sourceSetupValid;

  // fetch models
  const { isFetching, refetch, isError, error } =
    useLlmUpdateModels(!sourceHasLLMs && shallFetchSucceed, source);


  return <>

    <Typography level='body-sm'>
      <Link href='https://console.groq.com/docs/quickstart'>Groq</Link> offers inference
      as a service for a variety of models. See the <Link href='https://www.groq.com/' target='_blank'>Groq</Link> website for more information.
    </Typography>

    <SetupFormRefetchButton refetch={refetch} disabled={/*!shallFetchSucceed ||*/ isFetching} loading={isFetching} error={isError} />

    {isError && <InlineError error={error} />}

  </>;
}
