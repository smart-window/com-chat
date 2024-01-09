import * as React from 'react';

import { Button, Typography } from '@mui/joy';

import { FormInputKey } from '~/common/components/forms/FormInputKey';
import { InlineError } from '~/common/components/InlineError';
import { Link } from '~/common/components/Link';
import { SetupFormRefetchButton } from '~/common/components/forms/SetupFormRefetchButton';
import { apiQuery } from '~/common/util/trpc.client';
import { getCallbackUrl } from '~/common/app.routes';

import { DModelSourceId, useModelsStore, useSourceSetup } from '../../store-llms';
import { modelDescriptionToDLLM } from '../openai/OpenAISourceSetup';

import { isValidHFKey, ModelVendorHf } from './hf.vendor';


export function HfSourceSetup(props: { sourceId: DModelSourceId }) {

  // external state
  const { source, sourceHasLLMs, access, updateSetup } =
    useSourceSetup(props.sourceId, ModelVendorHf);

  // derived state
  const { oaiKey } = access;

  const needsUserKey = !ModelVendorHf.hasBackendCap?.();
  const keyValid = isValidHFKey(oaiKey);
  const keyError = (/*needsUserKey ||*/ !!oaiKey) && !keyValid;
  const shallFetchSucceed = oaiKey ? keyValid : !needsUserKey;

  // fetch models
  const { isFetching, refetch, isError, error } = apiQuery.llmOpenAI.listModels.useQuery({ access }, {
    enabled: !sourceHasLLMs && shallFetchSucceed,
    onSuccess: models => source && useModelsStore.getState().setLLMs(
      models.models.map(model => modelDescriptionToDLLM(model, source)),
      props.sourceId,
    ),
    staleTime: Infinity,
  });

  const handleHuggingFaceLogin = () => {
    // replace the current page with the OAuth page
    const oauthUrl = 'https://huggingface.co/';
    window.open(oauthUrl, '_self');
    // ...bye / see you soon at the callback location...
  };


  return <>
    The collaboration platform. Host and collaborate on unlimited models, datasets and applications. Hub activity feed. Move faster.
    {/* <Typography level='body-sm'>
      <Link href='https://commune-t.pages.dev' target='_blank'>Commune</Link> is a protocol that aims to connect all developer tools into one network, fostering a more shareable, reusable, and open economy.
    </Typography> */}

    <FormInputKey
      id='hf-key' label='Hugging Face API Key'
      rightLabel={<>{needsUserKey
        ? !oaiKey && <Link level='body-sm' href='https://huggingface.co/settings/tokens' target='_blank'>your keys</Link>
        : '✔️ already set in server'
      }
      </>}
      value={oaiKey} onChange={value => updateSetup({ oaiKey: value })}
      required={needsUserKey} isError={keyError}
      placeholder='hf_...'
    />

    <Typography level='body-sm'>
      A selection of <Link href='https://huggingface.co/models' target='_blank'>Hugging Face models</Link> are
      made available without charge. You can get an API key by using the Login button below.
    </Typography>

    <SetupFormRefetchButton
      refetch={refetch} disabled={!shallFetchSucceed || isFetching} error={isError}
      leftButton={
        <Button
          color='neutral' variant={(needsUserKey && !keyValid) ? 'solid' : 'outlined'}
          onClick={handleHuggingFaceLogin}
          endDecorator={(needsUserKey && !keyValid) ? '🎁' : undefined}
        >
          Hugging Face Login
        </Button>
      }
    />

    {isError && <InlineError error={error} />}

  </>;
}
