import React from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { Outlet } from 'react-router-dom';

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      <AnimatedLogo />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
