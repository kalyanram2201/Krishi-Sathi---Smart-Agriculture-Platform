import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  Leaf,
  CloudRain,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const actions = [
    {
      icon: Brain,
      title: "Disease Detection",
      text: "Scan crop leaves for diseases",
      path: "/disease-detection",
      color: "bg-red-500",
    },
    {
      icon: Leaf,
      title: "Crop Suggestions",
      text: "Get crop recommendations",
      path: "/crop-suggestion",
      color: "bg-green-500",
    },
    {
      icon: CloudRain,
      title: "Weather Forecast",
      text: "Check weather conditions",
      path: "/weather",
      color: "bg-blue-500",
    },
    {
      icon: ShoppingBag,
      title: "Marketplace",
      text: "Buy farming supplies",
      path: "/marketplace",
      color: "bg-purple-500",
    },
  ];

  const activities = [
    {
      icon: CheckCircle,
      title: "Disease scan completed",
      text: "Tomato leaf - Healthy",
      time: "2 hours ago",
      type: "success",
    },
    {
      icon: AlertTriangle,
      title: "Weather alert",
      text: "Heavy rainfall expected tomorrow",
      time: "4 hours ago",
      type: "warning",
    },
    {
      icon: Leaf,
      title: "Crop suggestion generated",
      text: "Wheat recommended for your soil",
      time: "1 day ago",
      type: "info",
    },
    {
      icon: ShoppingBag,
      title: "Order placed",
      text: "Organic fertilizer - 50kg",
      time: "2 days ago",
      type: "success",
    },
  ];

  const stats = [
    {
      title: "Crops Monitored",
      value: "12",
      change: "+2 this month",
      color: "text-green-600",
    },
    {
      title: "Disease Scans",
      value: "45",
      change: "+8 this week",
      color: "text-blue-600",
    },
    {
      title: "Healthy Plants",
      value: "98%",
      change: "+3% improvement",
      color: "text-green-600",
    },
    {
      title: "Orders Placed",
      value: "8",
      change: "+3 this month",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Farmer Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening on your farm.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{item.title}</p>
                  <p className="text-3xl font-bold mt-2">{item.value}</p>
                  <p className={`text-sm mt-1 ${item.color}`}>
                    {item.change}
                  </p>
                </div>
                <TrendingUp className={`h-8 w-8 ${item.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QUICK ACTIONS */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {actions.map((action) => (
                <Link
                  key={action.title}
                  to={action.path}
                  className="group p-4 border rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-center">
                    <div className={`${action.color} p-2 rounded-lg`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {action.text}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* ACTIVITY */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Activities</h2>
            </div>

            <div className="p-6 space-y-4">
              {activities.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      item.type === "success"
                        ? "bg-green-100"
                        : item.type === "warning"
                        ? "bg-yellow-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        item.type === "success"
                          ? "text-green-600"
                          : item.type === "warning"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.text}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
