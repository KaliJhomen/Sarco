'use client';
import AdminNavbar from '@/components/admin/Navbar';
import Sidebar from '@/components/admin/Sidebar';
import React from 'react';
import withAuth from '@/components/common/withAuth'; // Import the HOC

const Layout = ({ children }) => {
  return (
    <div>
      <AdminNavbar />
      <div className="flex w-full">
        <Sidebar />
        {children}
      </div>
    </div>
  );
};

export default withAuth(Layout); // Wrap the layout with the HOC