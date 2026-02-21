
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { PlanRetirement } from './pages/PlanRetirement';
import { VerifyIdentity } from './pages/VerifyIdentity';
import { OnboardingFlow } from './pages/OnboardingFlow';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/plan-retirement" element={<PlanRetirement />} />
        <Route path="/verify-identity" element={<VerifyIdentity />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
      </Routes>
    </Router>
  );
}

export default App;
