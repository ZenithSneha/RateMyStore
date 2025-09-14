import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Store, Star, TrendingUp } from "lucide-react";

export default function AdminDashboard({ stats }) {
  const statCards = [
    {
      title: "Total Platform Users",
      value: stats.totalUsers,
      icon: Users,
      bgColor: "bg-blue-500",
      trend: "All user roles"
    },
    {
      title: "My Created Stores", 
      value: stats.totalStores,
      icon: Store,
      bgColor: "bg-green-500",
      trend: "Stores created by you"
    },
    {
      title: "My Submitted Ratings",
      value: stats.totalRatings,
      icon: Star,
      bgColor: "bg-yellow-500",
      trend: "Ratings created by you"
    },
    {
      title: "Platform Health",
      value: "Excellent",
      icon: TrendingUp,
      bgColor: "bg-purple-500",
      trend: "System status"
    }
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden shadow-md">
              <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${stat.bgColor} rounded-full opacity-10`} />
              <CardHeader className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <CardTitle className="text-2xl md:text-3xl font-bold mt-2">
                      {stat.value}
                    </CardTitle>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor} bg-opacity-20`}>
                    <stat.icon className={`w-5 h-5 ${stat.bgColor.replace('bg-', 'text-')}`} />
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  {stat.trend}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold mb-2">Manage My Stores</h3>
                <p className="text-sm text-gray-600">View and manage stores you have created</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold mb-2">Manage All Users</h3>
                <p className="text-sm text-gray-600">Oversee all user accounts and permissions</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold mb-2">Add New User/Store</h3>
                <p className="text-sm text-gray-600">Create new user accounts or stores</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New store registered</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">New user signed up</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Rating submitted</p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}