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
import { FriendsComingInView } from './components/friendscomingin/FriendsComingInView';
import { FriendsGoingOutView } from './components/friendsgoingout/FriendsGoingOutView';
import { CalendarView } from './components/calendar/CalendarView';
import { FollowUpsView } from './components/followups/FollowUpsView';
import { ReportsView } from './components/reports/ReportsView';
import { CyclesView } from './components/cycles/CyclesView';
import { SettingsView } from './components/settings/SettingsView';
import { LoginPage } from './components/auth/LoginPage';
import { AppLogo } from './components/common/AppLogo';
import { OfflineIndicator } from './components/common/OfflineIndicator';

// Modals
import { QuickRecordModal } from './components/modals/QuickRecordModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { MultiPersonEntryModal } from './components/modals/MultiPersonEntryModal';
import { SecurityPinModal } from './components/modals/SecurityPinModal';

const AppContent: React.FC = () => {
  const { activeTab, theme, currentUser, hasEnteredApp, isAuthLoading } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickRecordOpen, setIsQuickRecordOpen] = useState(false);
  const [isMultiEntryOpen, setIsMultiEntryOpen] = useState(false);
  const [isSecurityPinOpen, setIsSecurityPinOpen] = useState(false);

  // Initial loading splash screen
  if (isAuthLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} antialiased transition-colors duration-200`}>
        <AppLogo size="xl" showText={false} className="mb-4 animate-pulse" />
        <h2 className="text-xl font-bold tracking-tight">Kimana Cluster Tracker</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Connecting to Kimana Community services...</p>
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mt-4" />
      </div>
    );
  }

  // Welcome user with login page upon opening the app until logged in and role is selected
  if (!currentUser || !hasEnteredApp) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} antialiased font-sans transition-colors duration-200`}>
        <LoginPage />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            onQuickRecord={() => setIsQuickRecordOpen(true)} 
            onOpenMultiEntry={() => setIsMultiEntryOpen(true)} 
          />
        );
      case 'localities':
        return <LocalitiesView />;
      case 'people':
        return <PeopleView />;
      case 'friendscomingin':
        return <FriendsComingInView />;
      case 'friendsgoingout':
        return <FriendsGoingOutView />;
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
        return <FriendsComingInView />;
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
      case 'login':
        return <LoginPage />;
      default:
        return (
          <DashboardView 
            onQuickRecord={() => setIsQuickRecordOpen(true)} 
            onOpenMultiEntry={() => setIsMultiEntryOpen(true)} 
          />
        );
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} antialiased font-sans transition-colors duration-200`}>
      <div className="flex flex-col min-h-screen">
        
        {/* Header Navigation */}
        <Header 
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onQuickRecord={() => setIsQuickRecordOpen(true)}
          onOpenMultiEntry={() => setIsMultiEntryOpen(true)}
          onOpenSecurityPin={() => setIsSecurityPinOpen(true)}
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
          onOpenMultiEntry={() => {
            setIsQuickRecordOpen(false);
            setIsMultiEntryOpen(true);
          }}
        />

        {/* Multi-Person Data Entry Modal */}
        <MultiPersonEntryModal 
          isOpen={isMultiEntryOpen}
          onClose={() => setIsMultiEntryOpen(false)}
        />

        {/* Security Access Control / PIN Modal */}
        <SecurityPinModal 
          isOpen={isSecurityPinOpen}
          onClose={() => setIsSecurityPinOpen(false)}
        />

        {/* Global Search Dialog */}
        <GlobalSearchModal />

        {/* Offline PWA Connectivity Indicator */}
        <OfflineIndicator />

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
