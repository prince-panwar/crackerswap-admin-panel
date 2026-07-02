import { useState } from 'react';
import { adminSettings } from '@/mocks/adminData';
import ConfirmationModal from './components/ConfirmationModal';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(adminSettings);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSave = () => {
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    showToast('Settings updated');
  };

  const handleReset = () => {
    setSettings(adminSettings);
    showToast('Settings reset to defaults');
  };

  const updateDiscovery = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, discovery: { ...prev.discovery, [field]: value } }));
  };

  const updateFeatured = (field: string, value: number | boolean) => {
    setSettings(prev => ({ ...prev, featured: { ...prev.featured, [field]: value } }));
  };

  const updateMaintenance = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, maintenance: { ...prev.maintenance, [field]: value } }));
  };

  const updateData = (field: string, value: number) => {
    setSettings(prev => ({ ...prev, data: { ...prev.data, [field]: value } }));
  };

  const updateNotification = (field: string, value: boolean) => {
    setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, [field]: value } }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Discovery Settings */}
      <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1A1A2E]/40">
          <h3 className="text-sm font-semibold text-[#F6F2EA]">Discovery Settings</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Token Listing Threshold</label>
            <input
              type="text"
              value={settings.discovery.tokenListingThreshold}
              onChange={(e) => updateDiscovery('tokenListingThreshold', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] outline-none focus:border-[#6C4DFF]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Auto-Hide Threshold</label>
            <input
              type="text"
              value={settings.discovery.autoHideThreshold}
              onChange={(e) => updateDiscovery('autoHideThreshold', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] outline-none focus:border-[#6C4DFF]/30"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#D8D1E6]">Require Logo Verification</p>
              <p className="text-xs text-[#6E667E]">Tokens without verified logos remain hidden</p>
            </div>
            <button
              onClick={() => updateDiscovery('requireLogoVerification', !settings.discovery.requireLogoVerification)}
              className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${
                settings.discovery.requireLogoVerification ? 'bg-[#34D07F]' : 'bg-[#2A2A3E]'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                settings.discovery.requireLogoVerification ? 'translate-x-5' : ''
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Token Settings */}
      <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1A1A2E]/40">
          <h3 className="text-sm font-semibold text-[#F6F2EA]">Featured Token Settings</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Max Featured Slots</label>
            <input
              type="number"
              value={settings.featured.maxSlots}
              onChange={(e) => updateFeatured('maxSlots', parseInt(e.target.value) || 8)}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] outline-none focus:border-[#6C4DFF]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Max Per Chain</label>
            <input
              type="number"
              value={settings.featured.maxPerChain}
              onChange={(e) => updateFeatured('maxPerChain', parseInt(e.target.value) || 4)}
              className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] outline-none focus:border-[#6C4DFF]/30"
            />
          </div>
        </div>
      </div>

      {/* Maintenance Banner */}
      <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1A1A2E]/40">
          <h3 className="text-sm font-semibold text-[#F6F2EA]">Maintenance Banner</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#D8D1E6]">Enable Banner</p>
              <p className="text-xs text-[#6E667E]">Show maintenance notice to users</p>
            </div>
            <button
              onClick={() => updateMaintenance('bannerEnabled', !settings.maintenance.bannerEnabled)}
              className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${
                settings.maintenance.bannerEnabled ? 'bg-[#34D07F]' : 'bg-[#2A2A3E]'
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                settings.maintenance.bannerEnabled ? 'translate-x-5' : ''
              }`} />
            </button>
          </div>
          {settings.maintenance.bannerEnabled && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Banner Text</label>
                <textarea
                  value={settings.maintenance.bannerText}
                  onChange={(e) => updateMaintenance('bannerText', e.target.value)}
                  rows={2}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] outline-none resize-none focus:border-[#6C4DFF]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Banner Type</label>
                <select
                  value={settings.maintenance.bannerType}
                  onChange={(e) => updateMaintenance('bannerType', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#D8D1E6] outline-none cursor-pointer"
                >
                  <option>Info</option>
                  <option>Warning</option>
                  <option>Critical</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1A1A2E]/40">
          <h3 className="text-sm font-semibold text-[#F6F2EA]">Notification Preferences</h3>
        </div>
        <div className="p-5 space-y-3">
          {[
            { key: 'newTokenIngestion', label: 'New Token Ingestion', desc: 'When a new token enters the ingestion queue' },
            { key: 'tokenFlagged', label: 'Token Flagged', desc: 'When a moderator flags a token for review' },
            { key: 'syncJobDelayed', label: 'Sync Job Delayed', desc: 'When a data sync job falls behind schedule' },
            { key: 'quoteServiceDegraded', label: 'Quote Service Degraded', desc: 'When quote service performance degrades' },
            { key: 'adminActionRequired', label: 'Admin Action Required', desc: 'When manual admin intervention is needed' },
          ].map((notif) => (
            <div key={notif.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-[#D8D1E6]">{notif.label}</p>
                <p className="text-xs text-[#6E667E]">{notif.desc}</p>
              </div>
              <button
                onClick={() => updateNotification(notif.key, !(settings.notifications as Record<string, boolean>)[notif.key])}
                className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${
                  (settings.notifications as Record<string, boolean>)[notif.key] ? 'bg-[#34D07F]' : 'bg-[#2A2A3E]'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                  (settings.notifications as Record<string, boolean>)[notif.key] ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Refresh Settings */}
      <div className="rounded-2xl bg-[#0F0D1A] border border-[#1A1A2E]/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1A1A2E]/40">
          <h3 className="text-sm font-semibold text-[#F6F2EA]">Data Refresh Settings</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Refresh Interval (seconds)</label>
              <input
                type="number"
                value={settings.data.refreshIntervalSeconds}
                onChange={(e) => updateData('refreshIntervalSeconds', parseInt(e.target.value) || 15)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] outline-none focus:border-[#6C4DFF]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#D8D1E6] mb-1.5">Stale Threshold (seconds)</label>
              <input
                type="number"
                value={settings.data.staleThresholdSeconds}
                onChange={(e) => updateData('staleThresholdSeconds', parseInt(e.target.value) || 60)}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0618] border border-[#1A1A2E] text-sm text-[#F6F2EA] outline-none focus:border-[#6C4DFF]/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button onClick={handleReset} className="px-6 py-3 rounded-full border border-[#2A2A3E]/60 text-sm font-medium text-[#A69DB7] hover:bg-[#1A1A2E]/40 transition-all cursor-pointer whitespace-nowrap">
          Reset Defaults
        </button>
        <button onClick={handleSave} className="px-6 py-3 rounded-full bg-[#6C4DFF]/10 border border-[#6C4DFF]/20 text-[#7B61FF] text-sm font-semibold hover:bg-[#6C4DFF]/20 transition-all cursor-pointer whitespace-nowrap">
          Save Changes
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-4 py-2.5 rounded-full bg-[#0F0D1A] border border-[#1A1A2E] shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-sm text-[#D8D1E6] animate-slide-down">
          <i className="ri-checkbox-circle-line text-[#34D07F] mr-2"></i>
          {toast}
        </div>
      )}

      {/* Confirm Save */}
      <ConfirmationModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title="Update settings?"
        description="These changes will affect platform behavior. Some may require a brief propagation delay."
        confirmLabel="Save Changes"
        variant="default"
      />
    </div>
  );
}