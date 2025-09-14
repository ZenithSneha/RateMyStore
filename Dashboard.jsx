import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Store } from "@/entities/Store";
import { Rating } from "@/entities/Rating";

import AdminDashboard from "../components/dashboard/AdminDashboard";
import UserDashboard from "../components/dashboard/UserDashboard";
import OwnerDashboard from "../components/dashboard/OwnerDashboard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        // RLS means these lists are now filtered by the current user
        const [users, stores, ratings] = await Promise.all([
          currentUser.role === 'admin' ? User.list() : Promise.resolve([]),
          Store.list(),
          Rating.list()
        ]);

        setStats({
          totalUsers: users.length,
          totalStores: stores.length,
          totalRatings: ratings.length
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
      setIsLoading(false);
    };
    
    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user?.role === 'admin') {
    return <AdminDashboard stats={stats} />;
  }
  
  // Combine User and Owner dashboards as they are now very similar
  return <OwnerDashboard user={user} />;
}