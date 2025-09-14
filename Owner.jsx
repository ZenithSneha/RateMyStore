import React, { useState, useEffect, useCallback } from "react";
import { Store } from "@/entities/Store";
import { Rating } from "@/entities/Rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, TrendingUp, Building2 } from "lucide-react";

export default function OwnerDashboard({ user }) {
  const [myStores, setMyStores] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadStoreData = useCallback(async () => {
    setIsLoading(true);
    try {
      // With RLS, these API calls now return only the user's own documents.
      const [stores, ratings] = await Promise.all([
        Store.list(),
        Rating.list()
      ]);
      setMyStores(stores);
      setMyRatings(ratings);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if(user) {
      loadStoreData();
    }
  }, [user, loadStoreData]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const averageRating = myRatings.length > 0 
    ? myRatings.reduce((sum, r) => sum + r.rating_value, 0) / myRatings.length 
    : 0;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}! Here's an overview of your activity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-green-500 rounded-full opacity-10" />
            <CardHeader className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">My Stores</p>
                  <CardTitle className="text-2xl md:text-3xl font-bold mt-2">
                    {myStores.length}
                  </CardTitle>
                </div>
                <div className="p-3 rounded-xl bg-green-500 bg-opacity-20">
                  <Building2 className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <Card className="relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-blue-500 rounded-full opacity-10" />
            <CardHeader className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">My Ratings</p>
                  <CardTitle className="text-2xl md:text-3xl font-bold mt-2">
                    {myRatings.length}
                  </CardTitle>
                </div>
                <div className="p-3 rounded-xl bg-blue-500 bg-opacity-20">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-yellow-500 rounded-full opacity-10" />
            <CardHeader className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">My Average Rating</p>
                  <CardTitle className="text-2xl md:text-3xl font-bold mt-2 flex items-center gap-2">
                    {averageRating.toFixed(1)}
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  </CardTitle>
                </div>
                <div className="p-3 rounded-xl bg-yellow-500 bg-opacity-20">
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>My Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myStores.map((store) => (
                <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{store.name}</h3>
                    <p className="text-sm text-gray-600">{store.address}</p>
                  </div>
                  <Badge variant="outline">Owner</Badge>
                </div>
              ))}
              {myStores.length === 0 && (
                <p className="text-gray-500 text-center py-4">You haven't created any stores yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}