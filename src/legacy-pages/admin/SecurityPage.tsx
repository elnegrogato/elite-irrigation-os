// src/pages/admin/SecurityPage.tsx
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity, Lock } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface SecurityStats {
  period: string;
  failedLogins: number;
  successfulLogins: number;
  suspiciousActivity: number;
  activeSessions: number;
  blockedIPs: number;
  securityScore: number;
}

interface SecurityInsight {
  hasAnomalies: boolean;
  anomalies: string[];
}

export default function SecurityPage() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'sessions' | 'blocked'>('overview');

  // Fetch security data
  const securityStats = useQuery(api.securityMonitoring.getSecurityInsights) as SecurityStats | undefined;
  const recommendations = useQuery(api.securityMonitoring.getSecurityRecommendations) as string[] | undefined;

  // For sessions and blocked IPs, you'd need additional queries
  // These are placeholder states
  const [sessions, setSessions] = useState<any[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<any[]>([]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-elite-600" />
            Security Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Monitor and manage application security</p>
        </div>
      </div>

      {/* Security Score */}
      {securityStats && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-l-4 border-elite-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Health Score</h2>
              <p className="text-gray-600">Based on the last {securityStats.period}</p>
            </div>
            <div className="text-right">
              <div className={`text-6xl font-bold ${getScoreColor(securityStats.securityScore)}`}>
                {securityStats.securityScore}
              </div>
              <div className={`text-xl font-semibold ${getScoreColor(securityStats.securityScore)}`}>
                {getScoreLabel(securityStats.securityScore)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Failed Logins</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {securityStats?.failedLogins || 0}
              </p>
            </div>
            <XCircle className="w-12 h-12 text-red-600 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Successful Logins</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {securityStats?.successfulLogins || 0}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Suspicious Activity</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {securityStats?.suspiciousActivity || 0}
              </p>
            </div>
            <AlertTriangle className="w-12 h-12 text-yellow-600 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Blocked IPs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {securityStats?.blockedIPs || 0}
              </p>
            </div>
            <Lock className="w-12 h-12 text-elite-600 opacity-80" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'overview'
                  ? 'border-elite-600 text-elite-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('sessions')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'sessions'
                  ? 'border-elite-600 text-elite-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Active Sessions
            </button>
            <button
              onClick={() => setSelectedTab('blocked')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'blocked'
                  ? 'border-elite-600 text-elite-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Blocked IPs
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Recommendations</h3>
              {recommendations && recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No security recommendations at this time
                </div>
              )}
            </div>
          )}

          {selectedTab === 'sessions' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions ({securityStats?.activeSessions || 0})</h3>
              <div className="text-center py-8 text-gray-500">
                Session management would be implemented here
              </div>
            </div>
          )}

          {selectedTab === 'blocked' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Blocked IP Addresses ({securityStats?.blockedIPs || 0})</h3>
              <div className="text-center py-8 text-gray-500">
                Blocked IP management would be implemented here
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
