import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { LocalitiesView } from './components/localities/LocalitiesView';
import { PeopleView } from './components/people/PeopleView';
import { ActivitiesView } from './components/activities/ActivitiesView';
import { StudyCirclesView } from './components/studycircles/StudyCirclesView';
import { ChildrensClassesView } from './components/childrensclasses/ChildrensClassesView';
import { JuniorYouthView } from './components/junioryouth/JuniorYouthView';
import { DevotionalsView } from './components/devotionals/DevotionalsView';
import { HomeVisitsView } from './components/homevisits/HomeVisitsView';
import { VisitsView } from './components/visits/VisitsView';
import { NewBahaisView } from './components/newbahais/NewBahaisView';
import { CalendarView } from './components/calendar/CalendarView';
import { FollowUpsView } from './components/followups/FollowUpsView';
import { ReportsView } from './components/reports/ReportsView';
import { CyclesView } from './components/cycles/CyclesView';
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { QuickRecordModal } from './components/modals/QuickRecordModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';

const AppContent: React.FC = () => {
  const { activeTab, theme } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickRecordOpen, setIsQuickRecordOpen] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onQuickRecord={() => setIsQuickRecordOpen(true)} />;
      case 'localities':
        return <LocalitiesView />;
      case 'people':
        return <PeopleView />;
      case 'activities':
        return <ActivitiesView />;
      case 'studycircles':
        return <StudyCirclesView />;
      case 'childrensclasses':
        return <ChildrensClassesView />;
      case 'junioryouth':
        return <JuniorYouthView />;
      case 'devotionals':
        return <DevotionalsView />;
      case 'homevisits':
        return <HomeVisitsView />;
      case 'visits':
        return <VisitsView />;
      case 'newbahais':
        return <NewBahaisView />;
      case 'calendar':
        return <CalendarView />;
      case 'followups':
        return <FollowUpsView />;
      case 'reports':
        return <ReportsView />;
      case 'cycles':
        return <CyclesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onQuickRecord={() => setIsQuickRecordOpen(true)} />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} antialiased font-sans transition-colors duration-200`}>
      <div className="flex flex-col min-h-screen">
        
        {/* Header Navigation */}
        <Header 
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onQuickRecord={() => setIsQuickRecordOpen(true)}
        />

        {/* Main Content Area with Sidebar */}
        <div className="flex flex-1 max-w-7xl w-full mx-auto">
          {/* Desktop Sidebar */}
          <Sidebar />

          {/* View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
            {renderTabContent()}
          </main>
        </div>

        {/* Mobile Navigation Drawer */}
        <MobileNav 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Quick Field Record Modal */}
        <QuickRecordModal 
          isOpen={isQuickRecordOpen}
          onClose={() => setIsQuickRecordOpen(false)}
        />

        {/* Global Search Dialog */}
        <GlobalSearchModal />

      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
