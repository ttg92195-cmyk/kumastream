'use client';

import { Header } from '@/components/movie/Header';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronRight, Moon, Bell, Download, Shield, HelpCircle, Info } from 'lucide-react';
import Link from 'next/link';

interface SettingsItemProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  action?: 'toggle' | 'link';
  href?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function SettingsItem({
  icon: Icon,
  label,
  description,
  action,
  href,
  checked,
  onCheckedChange,
}: SettingsItemProps) {
  const content = (
    <div className="flex items-center justify-between py-4 border-b border-gray-800">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <p className="text-white text-sm">{label}</p>
          {description && (
            <p className="text-gray-500 text-xs mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {action === 'toggle' && (
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      )}
      {action === 'link' && (
        <ChevronRight className="w-5 h-5 text-gray-500" />
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header title="Settings" showSearch={false} />

      <div className="p-4">
        {/* Appearance */}
        <section className="mb-6">
          <h2 className="text-gray-500 text-xs font-medium mb-2 uppercase">
            Appearance
          </h2>
          <SettingsItem
            icon={Moon}
            label="Dark Mode"
            description="Enable dark theme"
            action="toggle"
            checked={true}
          />
        </section>

        {/* Notifications */}
        <section className="mb-6">
          <h2 className="text-gray-500 text-xs font-medium mb-2 uppercase">
            Notifications
          </h2>
          <SettingsItem
            icon={Bell}
            label="Push Notifications"
            description="Get notified about new releases"
            action="toggle"
            checked={true}
          />
          <SettingsItem
            icon={Download}
            label="Download Notifications"
            description="Get notified when downloads complete"
            action="toggle"
            checked={false}
          />
        </section>

        {/* Account */}
        <section className="mb-6">
          <h2 className="text-gray-500 text-xs font-medium mb-2 uppercase">
            Account
          </h2>
          <SettingsItem
            icon={Shield}
            label="Admin Login"
            description="Login as admin to manage content"
            action="link"
            href="/admin/login"
          />
        </section>

        {/* About */}
        <section className="mb-6">
          <h2 className="text-gray-500 text-xs font-medium mb-2 uppercase">
            About
          </h2>
          <SettingsItem
            icon={HelpCircle}
            label="Help & Support"
            action="link"
          />
          <SettingsItem
            icon={Info}
            label="About CINE STREAM"
            description="Version 1.0.0"
            action="link"
          />
        </section>
      </div>
    </div>
  );
}
