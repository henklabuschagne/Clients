import { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { apiConfig } from '../lib/api/config';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Settings,
  RotateCcw,
  Database,
  Zap,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';

export function DevApiPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const { clients, vpns, connections, servers, contacts, licenses, tickets, updates, customizations, notes, actions } = useAppStore(
    'clients', 'vpns', 'connections', 'servers', 'contacts', 'licenses', 'tickets', 'updates', 'customizations', 'notes'
  );

  const [latencyEnabled, setLatencyEnabled] = useState(apiConfig.simulateLatency);
  const [errorRate, setErrorRate] = useState(apiConfig.errorRate);

  const handleToggleLatency = () => {
    apiConfig.simulateLatency = !apiConfig.simulateLatency;
    setLatencyEnabled(apiConfig.simulateLatency);
  };

  const handleErrorRateChange = (rate: number) => {
    apiConfig.errorRate = rate;
    setErrorRate(rate);
  };

  const handleReset = () => {
    actions.resetToDefaults();
    setShowConfirmReset(false);
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-brand-main text-white p-3 rounded-full shadow-lg hover:bg-brand-main-light transition-colors"
        title="Developer API Panel"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
      <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-2">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Dev API Panel</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-gray-700 rounded p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[70vh] overflow-auto">
        {/* Data Store Stats */}
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Database className="w-3 h-3" /> Data Store
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Clients</span>
              <Badge variant="secondary">{clients.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VPNs</span>
              <Badge variant="secondary">{vpns.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Connections</span>
              <Badge variant="secondary">{connections.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Servers</span>
              <Badge variant="secondary">{servers.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contacts</span>
              <Badge variant="secondary">{contacts.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Licenses</span>
              <Badge variant="secondary">{licenses.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tickets</span>
              <Badge variant="secondary">{tickets.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Updates</span>
              <Badge variant="secondary">{updates.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customizations</span>
              <Badge variant="secondary">{customizations.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Notes</span>
              <Badge variant="secondary">{notes.length}</Badge>
            </div>
          </div>
        </div>

        {/* API Config */}
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Zap className="w-3 h-3" /> API Simulation
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Simulated Latency</span>
              <button
                onClick={handleToggleLatency}
                className={`px-2 py-0.5 rounded text-xs ${latencyEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
              >
                {latencyEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className="text-xs text-gray-400">{(errorRate * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={errorRate}
                onChange={(e) => handleErrorRateChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Data Persistence */}
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Data Persistence
          </h3>
          {!showConfirmReset ? (
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => setShowConfirmReset(true)}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset All Data to Defaults
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-red-600">This will clear ALL localStorage data and reload with default demo data. Are you sure?</p>
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" className="flex-1" onClick={handleReset}>
                  Confirm Reset
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowConfirmReset(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}