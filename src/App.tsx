/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useAppContext } from './store';
import { Shell } from './components/Shell';
import { Launchpad } from './views/Launchpad';
import { Dashboard } from './views/Dashboard';
import { ManageGatePasses } from './views/ManageGatePasses';
import { ObjectPage } from './views/ObjectPage';
import { CreateGatePass } from './views/CreateGatePass';
import { Reports } from './views/Reports';
import { ScannerView } from './views/ScannerView';

function ViewRouter() {
  const { currentView } = useAppContext();

  switch (currentView) {
    case 'launchpad':
      return <Launchpad />;
    case 'dashboard':
      return <Dashboard />;
    case 'manageGatePasses':
      return <ManageGatePasses />;
    case 'objectPage':
      return <ObjectPage />;
    case 'createGatePass':
      return <CreateGatePass />;
    case 'reports':
      return <Reports />;
    case 'scanner':
      return <ScannerView />;
    default:
      return <Launchpad />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Shell>
        <ViewRouter />
      </Shell>
    </AppProvider>
  );
}

