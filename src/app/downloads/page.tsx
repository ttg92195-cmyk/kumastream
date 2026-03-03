'use client';

import { useState } from 'react';
import { Header } from '@/components/movie/Header';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function DownloadsPage() {
  const [wifiOnly, setWifiOnly] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header title="Downloads" showSearch={false} />

      <div className="p-4">
        {/* Settings */}
        <div className="flex items-center justify-between py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Label htmlFor="wifi-only" className="text-white text-sm">
              Download with Wifi Only
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">{wifiOnly ? 'On' : 'Off'}</span>
            <Switch
              id="wifi-only"
              checked={wifiOnly}
              onCheckedChange={setWifiOnly}
            />
          </div>
        </div>

        {/* Downloaded List */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Downloaded List</h2>
            <button className="text-red-500 text-sm">Show select</button>
          </div>

          {/* Empty State */}
          <div className="text-center py-20">
            <p className="text-gray-500 mb-2">No downloads yet</p>
            <p className="text-gray-600 text-sm">
              Download movies and series to watch offline
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
