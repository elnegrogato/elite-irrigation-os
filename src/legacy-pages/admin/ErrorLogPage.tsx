// src/pages/admin/ErrorLogPage.tsx
import React, { useState, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Filter,
  Download,
  Trash2,
  Search,
  ChevronDown,
} from 'lucide-react';

interface ErrorLog {
  _id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  code?: string;
  context?: string;
  stack?: string;
  userId?: string;
  createdAt: number;
}

export default function ErrorLogPage() {
  // In a real app, you'd fetch this from a Convex query
  // For now, we'll use mock data
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'error' | 'warning' | 'info',
    severity: 'all' as 'all' | 'low' | 'medium' | 'high' | 'critical',
    search: '',
  });

  const mockErrors: ErrorLog[] = [
    {
      _id: '1',
      type: 'error',
      severity: 'critical',
      message: 'Database connection failed',
      code: 'DB_ERROR',
      context: 'API: /api/estimates',
      stack: 'Error: Database connection failed\n    at APIHandler...',
      userId: 'user123',
      createdAt: Date.now() - 1000 * 60 * 5,
    },
    {
      _id: '2',
      type: 'warning',
      severity: 'medium',
      message: 'Rate limit approaching',
      code: 'RATE_LIMIT',
      context: 'API: /api/leads',
      userId: 'user456',
      createdAt: Date.now() - 1000 * 60 * 15,
    },
    {
      _id: '3',
      type: 'error',
      severity: 'high',
      message: 'Authentication failed',
      code: 'AUTH_ERROR',
      context: 'TechLoginPage',
      userId: 'user789',
      createdAt: Date.now() - 1000 * 60 * 30,
    },
  ];

  const filteredErrors = useMemo(() => {
    return mockErrors.filter((error) => {
      if (filters.type !== 'all' && error.type !== filters.type) return false;
      if (filters.severity !== 'all' && error.severity !== filters.severity) return false;
      if (filters.search && !error.message.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const errorCounts = useMemo(() => {
    return {
      total: mockErrors.length,
      critical: mockErrors.filter((e) => e.severity === 'critical').length,
      high: mockErrors.filter((e) => e.severity === 'high').length,
      medium: mockErrors.filter((e) => e.severity === 'medium').length,
      low: mockErrors.filter((e) => e.severity === 'low').length,
    };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const exportErrorLog = () => {
    const data = JSON.stringify(filteredErrors, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">Error Log</h1>
            <p className="text-sm text-slate-500 mt-1">Monitor and analyze application errors</p>
          </div>
          <button
            onClick={exportErrorLog}
            className="inline-flex items-center gap-2 px-4 py-2 bg-elite-900 text-white rounded-lg hover:bg-elite-800 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export Log
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-sm text-slate-500 mb-1">Total Errors</div>
            <div className="text-2xl font-bold text-slate-900">{errorCounts.total}</div>
          </div>
          <div className="bg-white border border-red-200 rounded-lg p-4">
            <div className="text-sm text-red-600 mb-1">Critical</div>
            <div className="text-2xl font-bold text-red-700">{errorCounts.critical}</div>
          </div>
          <div className="bg-white border border-orange-200 rounded-lg p-4">
            <div className="text-sm text-orange-600 mb-1">High</div>
            <div className="text-2xl font-bold text-orange-700">{errorCounts.high}</div>
          </div>
          <div className="bg-white border border-amber-200 rounded-lg p-4">
            <div className="text-sm text-amber-600 mb-1">Medium</div>
            <div className="text-2xl font-bold text-amber-700">{errorCounts.medium}</div>
          </div>
          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-600 mb-1">Low</div>
            <div className="text-2xl font-bold text-blue-700">{errorCounts.low}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search errors..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-elite-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:border-elite-500 focus:outline-none text-sm"
              >
                <option value="all">All Types</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value as any })}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:border-elite-500 focus:outline-none text-sm"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error List */}
        <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
          {filteredErrors.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No errors found</div>
          ) : (
            filteredErrors.map((error) => (
              <div key={error._id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">{getTypeIcon(error.type)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">{error.message}</h3>
                        {error.code && (
                          <span className="text-xs text-slate-500 font-mono">{error.code}</span>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(
                          error.severity
                        )}`}
                      >
                        {error.severity}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-slate-600">
                      {error.context && (
                        <p>
                          <span className="font-medium">Context:</span> {error.context}
                        </p>
                      )}
                      {error.userId && (
                        <p>
                          <span className="font-medium">User:</span> {error.userId}
                        </p>
                      )}
                      <p className="text-xs text-slate-400">
                        {new Date(error.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {error.stack && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-700">
                          View Stack Trace
                        </summary>
                        <pre className="mt-2 bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
