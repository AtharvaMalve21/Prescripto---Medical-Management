import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  Phone,
  Mail,
} from "lucide-react";

const DoctorDashboard = () => {
  // Mock data based on your backend response structure
  const [dashboardData, setDashboardData] = useState({
    appointments: [],
    recentAppointments: [
      {
        _id: "688aff20a8ea04ebab5781cd",
        patient: {
          _id: "688aff0fa8ea04ebab5781c2",
          name: "Kim Lee",
          email: "kimlee@dev.com",
        },
        doctor: "6889e9a42390b2bc74396d90",
        amount: 500,
        date: 1753939744724,
        slotDate: "2025-08-01",
        slotTime: "10:00 AM",
        status: "pending",
        paymentStatus: "paid",
        isCompleted: true,
      },
      {
        _id: "688a8364d071a6c719caeda6",
        patient: {
          _id: "688a8364d071a6c719caeda6",
          name: "John Smith",
          email: "john@dev.com",
        },
        doctor: "687e1dc9aff41f0dfc0d542c",
        amount: 650,
        date: 1753908068019,
        slotDate: "2025-07-30",
        slotTime: "2:00 PM",
        status: "completed",
        paymentStatus: "paid",
        isCompleted: true,
      },
      {
        _id: "688a5f1f69122764e5b71b10",
        patient: {
          _id: "6882985cbb65da874af6f795",
          name: "Sarah Johnson",
          email: "sarah@dev.com",
        },
        doctor: "6889f9c35325b624e9825d58",
        amount: 850,
        date: 1753898783863,
        slotDate: "2025-07-29",
        slotTime: "11:00 AM",
        status: "completed",
        paymentStatus: "paid",
        isCompleted: true,
      },
    ],
    stats: {
      totalAppointments: 14,
      todayAppointments: 2,
      thisWeekAppointments: 8,
      thisMonthAppointments: 11,
      completedAppointments: 2,
      pendingAppointments: 12,
      totalEarnings: 1150,
    },
    todayAppointments: [
      {
        _id: "688a5f1f69122764e5b71b10",
        patient: {
          _id: "6882985cbb65da874af6f795",
          name: "Atharva Malve",
          email: "atharvamalve@dev.com",
        },
        doctor: "6889f9c35325b624e9825d58",
        amount: 850,
        date: 1753898783863,
        slotDate: "2025-07-31",
        slotTime: "11:00 AM",
        status: "cancelled",
        paymentStatus: "paid",
        isCompleted: false,
      },
      {
        _id: "6887c1da6298863bd5ac9b29",
        patient: {
          _id: "6887c1da6298863bd5ac9b29",
          name: "Emma Wilson",
          email: "emma@dev.com",
        },
        doctor: "687e20eeaff41f0dfc0d5454",
        amount: 600,
        date: 1753727450597,
        slotDate: "2025-07-31",
        slotTime: "3:00 PM",
        status: "pending",
        paymentStatus: "paid",
        isCompleted: false,
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  // In your actual implementation, replace this with your API call
  useEffect(() => {
    // fetchDashboardData();
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { stats, recentAppointments, todayAppointments } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Doctor Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's your practice overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalAppointments || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today's Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.todayAppointments || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedAppointments || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalEarnings || 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.thisWeekAppointments || 0}
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.thisMonthAppointments || 0}
                </p>
              </div>
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.pendingAppointments || 0}
                </p>
              </div>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Today's Appointments ({todayAppointments.length})
              </h2>
            </div>
            <div className="p-6">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No appointments scheduled for today
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {appointment.patient.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Mail className="h-4 w-4 mr-1" />
                            {appointment.patient.email}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {appointment.slotTime}
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(appointment.amount)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                              appointment.paymentStatus
                            )}`}
                          >
                            {appointment.paymentStatus}
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Recent Appointments ({recentAppointments.length})
              </h2>
            </div>
            <div className="p-6">
              {recentAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent appointments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {appointment.patient.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(appointment.date)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {appointment.slotTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(appointment.amount)}
                          </p>
                          {appointment.isCompleted && (
                            <CheckCircle className="h-4 w-4 text-green-600 ml-auto mt-1" />
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                              appointment.paymentStatus
                            )}`}
                          >
                            {appointment.paymentStatus}
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
