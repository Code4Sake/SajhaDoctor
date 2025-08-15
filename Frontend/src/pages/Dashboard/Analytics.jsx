import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign,
  Clock,
  Star,
  Activity,
  Target,
  Eye,
  Download,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  PieChart,
  LineChart,
  AreaChart,
  User,
  Heart,
  CheckCircle2,
  AlertTriangle,
  Zap
} from 'lucide-react';

// Enhanced Card Component
const DashboardCard = ({ title, children, className = "", delay = 0, action, icon: Icon }) => (
  <div 
    className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-500 ${className}`}
    style={{ 
      animationDelay: `${delay}ms`,
      animation: 'slideInUp 0.6s ease-out forwards'
    }}
  >
    {title && (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="w-6 h-6 text-blue-600" />}
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center space-x-3">
          {action}
          <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
      </div>
    )}
    {children}
  </div>
);

// KPI Card Component
const KPICard = ({ title, value, change, trend, icon: Icon, color, delay = 0 }) => {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
    red: "from-red-50 to-red-100 border-red-200 text-red-700",
    indigo: "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700"
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div 
      className={`bg-gradient-to-r ${colorClasses[color]} rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'fadeInScale 0.6s ease-out forwards'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white p-3 rounded-2xl shadow-sm">
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {change}
          </span>
        </div>
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm font-medium opacity-80">{title}</p>
    </div>
  );
};

// Chart Component (Simplified Visualization)
const SimpleChart = ({ data, type = 'bar', color = 'blue', height = 'h-48' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    red: 'bg-red-500 hover:bg-red-600'
  };

  if (type === 'line') {
    return (
      <div className={`${height} flex items-end justify-between space-x-1 p-4`}>
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={`rgb(59 130 246)`} stopOpacity="0.8"/>
              <stop offset="100%" stopColor={`rgb(59 130 246)`} stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <path
            d={`M 0 ${200 - (data[0].value / maxValue) * 160} ${data.map((d, i) => 
              `L ${(i * 400) / (data.length - 1)} ${200 - (d.value / maxValue) * 160}`
            ).join(' ')}`}
            stroke={`rgb(59 130 246)`}
            strokeWidth="3"
            fill="none"
          />
          <path
            d={`M 0 200 L 0 ${200 - (data[0].value / maxValue) * 160} ${data.map((d, i) => 
              `L ${(i * 400) / (data.length - 1)} ${200 - (d.value / maxValue) * 160}`
            ).join(' ')} L 400 200 Z`}
            fill={`url(#gradient-${color})`}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${height} flex items-end justify-between space-x-2 p-4`}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-2 flex-1">
          <div 
            className={`${colorClasses[color]} rounded-t-lg w-full transition-all duration-500 hover:shadow-lg cursor-pointer`}
            style={{ height: `${(item.value / maxValue) * 100}%` }}
            title={`${item.label}: ${item.value}`}
          ></div>
          <span className="text-xs text-gray-600 text-center">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// Performance Metrics Component
const PerformanceMetrics = ({ delay = 0 }) => {
  const metrics = [
    { label: 'Patient Satisfaction', value: 98, target: 95, color: 'green' },
    { label: 'Response Time', value: 85, target: 90, color: 'orange' },
    { label: 'Treatment Success', value: 92, target: 90, color: 'blue' },
    { label: 'Follow-up Rate', value: 88, target: 85, color: 'purple' }
  ];

  const getStatusColor = (value, target) => {
    if (value >= target) return 'text-green-600';
    if (value >= target * 0.8) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div 
      className="space-y-4"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      {metrics.map((metric, index) => (
        <div key={index} className="bg-gray-50/80 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">{metric.label}</h4>
            <div className="flex items-center space-x-2">
              <span className={`font-bold ${getStatusColor(metric.value, metric.target)}`}>
                {metric.value}%
              </span>
              <Target className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{metric.target}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                metric.color === 'green' ? 'bg-green-500' :
                metric.color === 'orange' ? 'bg-orange-500' :
                metric.color === 'blue' ? 'bg-blue-500' :
                'bg-purple-500'
              }`}
              style={{ width: `${metric.value}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>Target: {metric.target}%</span>
            <span>100%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// Top Conditions Component
const TopConditions = ({ delay = 0 }) => {
  const conditions = [
    { name: 'Hypertension', count: 45, percentage: 35, color: 'bg-red-500' },
    { name: 'Diabetes', count: 38, percentage: 30, color: 'bg-orange-500' },
    { name: 'Anxiety', count: 25, percentage: 20, color: 'bg-purple-500' },
    { name: 'Migraine', count: 19, percentage: 15, color: 'bg-blue-500' }
  ];

  return (
    <div 
      className="space-y-4"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      {conditions.map((condition, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl hover:bg-gray-100/80 transition-colors">
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 ${condition.color} rounded-full`}></div>
            <div>
              <h4 className="font-semibold text-gray-900">{condition.name}</h4>
              <p className="text-sm text-gray-600">{condition.count} patients</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">{condition.percentage}%</p>
            <p className="text-xs text-gray-500">of total cases</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Recent Activity Feed
const ActivityFeed = ({ delay = 0 }) => {
  const activities = [
    {
      type: 'appointment',
      icon: Calendar,
      color: 'blue',
      title: 'Appointment completed',
      description: 'with Ramesh Thapa',
      time: '30 min ago',
      value: '₹800'
    },
    {
      type: 'review',
      icon: Star,
      color: 'yellow',
      title: '5-star review received',
      description: 'from Sita Sharma',
      time: '1 hour ago',
      value: '★★★★★'
    },
    {
      type: 'patient',
      icon: User,
      color: 'green',
      title: 'New patient registered',
      description: 'Maya Gurung',
      time: '2 hours ago',
      value: 'New'
    },
    {
      type: 'consultation',
      icon: Activity,
      color: 'purple',
      title: 'Video consultation',
      description: 'with Kumar Rai - 45 min',
      time: '3 hours ago',
      value: '₹1,200'
    }
  ];

  return (
    <div 
      className="space-y-4 max-h-96 overflow-y-auto"
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50/80 rounded-2xl hover:bg-gray-100/80 transition-colors">
          <div className={`p-2 rounded-xl ${
            activity.color === 'blue' ? 'bg-blue-100' :
            activity.color === 'yellow' ? 'bg-yellow-100' :
            activity.color === 'green' ? 'bg-green-100' :
            'bg-purple-100'
          }`}>
            <activity.icon className={`w-4 h-4 ${
              activity.color === 'blue' ? 'text-blue-600' :
              activity.color === 'yellow' ? 'text-yellow-600' :
              activity.color === 'green' ? 'text-green-600' :
              'text-purple-600'
            }`} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">{activity.title}</h4>
            <p className="text-gray-600 text-sm">{activity.description}</p>
            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
          </div>
          <div className="text-right">
            <span className="font-semibold text-gray-900 text-sm">{activity.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Sample data for charts
  const revenueData = [
    { label: 'Mon', value: 1200 },
    { label: 'Tue', value: 1800 },
    { label: 'Wed', value: 1400 },
    { label: 'Thu', value: 2200 },
    { label: 'Fri', value: 1900 },
    { label: 'Sat', value: 2800 },
    { label: 'Sun', value: 2100 }
  ];

  const patientData = [
    { label: 'Week 1', value: 28 },
    { label: 'Week 2', value: 32 },
    { label: 'Week 3', value: 25 },
    { label: 'Week 4', value: 38 }
  ];

  const appointmentData = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 48 },
    { label: 'Apr', value: 61 },
    { label: 'May', value: 55 },
    { label: 'Jun', value: 67 }
  ];

  // KPI data
  const kpis = [
    {
      title: 'Total Revenue',
      value: '₹45,200',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Total Patients',
      value: '248',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Appointments',
      value: '156',
      change: '+8.1%',
      trend: 'up',
      icon: Calendar,
      color: 'purple'
    },
    {
      title: 'Avg Session Time',
      value: '42 min',
      change: '+5.3%',
      trend: 'up',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Patient Rating',
      value: '4.9',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'indigo'
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '-1.1%',
      trend: 'down',
      icon: Target,
      color: 'red'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 rounded-3xl text-white p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-indigo-100 text-lg">Track your performance and insights</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <BarChart3 className="w-8 h-8 mb-2" />
                <p className="font-bold text-xl">94.2%</p>
                <p className="text-sm text-indigo-100">Success Rate</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <TrendingUp className="w-8 h-8 mb-2" />
                <p className="font-bold text-xl">+18%</p>
                <p className="text-sm text-indigo-100">Growth</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === '7d' ? 'bg-white/20 text-white' : 'text-indigo-100 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === '30d' ? 'bg-white/20 text-white' : 'text-indigo-100 hover:text-white'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange('90d')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === '90d' ? 'bg-white/20 text-white' : 'text-indigo-100 hover:text-white'
                }`}
              >
                90 Days
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpis.map((kpi, idx) => (
          <KPICard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            icon={kpi.icon}
            color={kpi.color}
            delay={idx * 50}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <DashboardCard 
          title="Revenue Trends" 
          icon={BarChart3}
          delay={100}
          action={
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="revenue">Revenue</option>
              <option value="patients">Patients</option>
              <option value="appointments">Appointments</option>
            </select>
          }
        >
          <SimpleChart 
            data={revenueData} 
            type="line" 
            color="blue" 
            height="h-64"
          />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">₹15,200</p>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-xs text-green-600 font-semibold">+22% vs last week</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₹52,800</p>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-xs text-blue-600 font-semibold">+18% vs last month</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₹2,171</p>
              <p className="text-sm text-gray-600">Daily Average</p>
              <p className="text-xs text-purple-600 font-semibold">Above target</p>
            </div>
          </div>
        </DashboardCard>

        {/* Patient Analytics */}
        <DashboardCard title="Patient Analytics" icon={Users} delay={200}>
          <SimpleChart 
            data={patientData} 
            type="bar" 
            color="purple" 
            height="h-64"
          />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">New Patients</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-xs text-purple-600">This month</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Returning</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">186</p>
              <p className="text-xs text-blue-600">Active patients</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Detailed Analytics */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Performance Metrics */}
        <DashboardCard title="Performance Metrics" icon={Target} delay={300}>
          <PerformanceMetrics delay={350} />
        </DashboardCard>

        {/* Top Conditions */}
        <DashboardCard title="Top Conditions Treated" icon={Activity} delay={400}>
          <TopConditions delay={450} />
        </DashboardCard>

        {/* Activity Feed */}
        <DashboardCard title="Recent Activity" icon={Zap} delay={500}>
          <ActivityFeed delay={550} />
        </DashboardCard>
      </div>

      {/* Appointment Insights */}
      <DashboardCard title="Appointment Insights" icon={Calendar} delay={600}>
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <SimpleChart 
              data={appointmentData} 
              type="bar" 
              color="green" 
              height="h-48"
            />
            <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Monthly Appointments</h4>
            <p className="text-sm text-gray-600">Steady growth in appointment bookings over the past 6 months</p>
          </div>
          <div className="space-y-4">
            <div className="bg-green-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Appointment Success Rate</h4>
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">94.2%</p>
              <p className="text-sm text-gray-600">Patients who completed their appointments</p>
              <div className="w-full bg-green-200 rounded-full h-2 mt-3">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">No-Show Rate</h4>
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-600 mb-2">5.8%</p>
              <p className="text-sm text-gray-600">Appointments missed without notice</p>
              <div className="w-full bg-orange-200 rounded-full h-2 mt-3">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '5.8%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Analytics; 