import React from 'react';
import { OpsPilotExecutiveOverview } from './OpsPilotExecutiveOverview';
import { OpsPilotDashboard } from './OpsPilotDashboard';
import { OpsPilotView } from './OpsPilotView';
import { OpsPilotConnections } from './OpsPilotConnections';
import { OpsPilotGovernance } from './OpsPilotGovernance';
import { OpsPilotCopilot } from './OpsPilotCopilot';

interface OpsPilotAppProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const OpsPilotApp: React.FC<OpsPilotAppProps> = ({ activeTab, setActiveTab }) => {
  if (activeTab === 'opspilot/overview') {
    return <OpsPilotExecutiveOverview onNavigateToTab={setActiveTab} />;
  }
  if (activeTab === 'opspilot/investigation') {
    return <OpsPilotView />;
  }
  if (activeTab === 'opspilot/connections') {
    return <OpsPilotConnections />;
  }
  if (activeTab === 'opspilot/governance') {
    return <OpsPilotGovernance />;
  }
  if (activeTab === 'opspilot/copilot') {
    return <OpsPilotCopilot />;
  }

  // Default route: opspilot / opspilot/dashboard
  return <OpsPilotDashboard />;
};
