import * as React from 'react';

import { ModelsModal } from '~/modules/llms/models-modal/ModelsModal';
import { WalletModal } from '../../../apps/wallet-modal/WalletModal';
import { APIModal } from '../../../apps/api-modal/APIModal';
import { SettingsModal } from '../../../apps/settings-modal/SettingsModal';
import { ShortcutsModal } from '../../../apps/settings-modal/ShortcutsModal';
import { useOptimaLayout } from './useOptimaLayout';


export function Modals(props: { suspendAutoModelsSetup?: boolean }) {

  // external state
  const {
    showPreferencesTab, closePreferences,
    showShortcuts, openShortcuts, closeShortcuts,
  } = useOptimaLayout();

  return <>

    {/* Overlay Settings */}
    <SettingsModal open={!!showPreferencesTab} tabIndex={showPreferencesTab} onClose={closePreferences} onOpenShortcuts={openShortcuts} />

    {/* Overlay Models + LLM Options */}
    <ModelsModal suspendAutoModelsSetup={props.suspendAutoModelsSetup} />

    {/* Overlay Wallet */}
    <WalletModal />

    {/* Overlay API */}
    <APIModal />

    {/* Overlay Shortcuts */}
    {showShortcuts && <ShortcutsModal onClose={closeShortcuts} />}

  </>;
}