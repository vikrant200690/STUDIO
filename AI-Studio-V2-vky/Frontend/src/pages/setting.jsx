import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/tokenService';
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Code,
  Globe,
  Zap,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Key,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  ChevronRight,
  Lock,
  Unlock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  HardDrive,
  Wifi,
  Smartphone,
  Laptop,
  Server,
  Activity,
  BarChart3,
  FileText,
  Image,
  Music,
  Video,
  Mic,
  Camera,
  Headphones,
  Bluetooth,
  Cpu,
  Battery,
  Power,
  MessageSquare,
  LogOut,
  LogIn,
  Crown,
  Sparkles,
  Brain,
  Wand2,
  Layers,
  Layout,
  Palette as PaletteIcon,
  Sliders,
  Bot,
  Workflow,
  GitBranch,
  Terminal,
  Archive,
  Cloud,
  CreditCard,
  Award,
  Star,
  Zap as ZapIcon,
  Users,
  Building,
  Home,
  Sidebar,
} from "lucide-react";
import SettingsSidebar from "../components/settingsSidebar";

const SettingsComponent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userPlan, setUserPlan] = useState("pro");
  const [settings, setSettings] = useState({
    // General Settings
    theme: "dark",
    language: "en",
    timezone: "UTC",
    autoSave: true,
    notifications: true,
    soundEnabled: true,

    // Profile Settings
    name: "AI Developer",
    email: "developer@nexusai.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",

    // Privacy & Security
    twoFactorAuth: true,
    sessionTimeout: 30,
    dataEncryption: true,
    analyticsOptIn: false,

    // Billing & Plans
    billingCycle: "monthly",
    autoRenewal: true,
  });

  const tabs = [
    { id: "general", name: "General", icon: <Settings className="w-4 h-4" /> },
    { id: "profile", name: "Profile", icon: <User className="w-4 h-4" /> },
    {
      id: "privacy",
      name: "Privacy & Security",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "billing",
      name: "Billing & Plans",
      icon: <CreditCard className="w-4 h-4" />,
    },
  ];

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogout = async () => {
    console.log("🚪 Logout initiated");
    
    try {
      await logout();
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout failed:", error);
    } finally {
      setIsLoggedIn(false);
      navigate("/login", { replace: true });
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const ToggleSwitch = ({
    enabled,
    onChange,
    label,
    description,
    premium = false,
  }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{label}</span>
          {premium && <Crown className="w-4 h-4 text-yellow-400" />}
        </div>
        {description && (
          <div className="text-sm text-white/60 mt-1">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-blue-500" : "bg-white/20"
        }`}
        disabled={premium && userPlan === "free"}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const Slider = ({
    value,
    onChange,
    min,
    max,
    step,
    label,
    description,
    premium = false,
  }) => (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{label}</span>
            {premium && <Crown className="w-4 h-4 text-yellow-400" />}
          </div>
          {description && (
            <div className="text-sm text-white/60">{description}</div>
          )}
        </div>
        <div className="text-blue-400 font-medium">{value}</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
        disabled={premium && userPlan === "free"}
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
            ((value - min) / (max - min)) * 100
          }%, rgba(255,255,255,0.2) ${
            ((value - min) / (max - min)) * 100
          }%, rgba(255,255,255,0.2) 100%)`,
        }}
      />
    </div>
  );

  const Select = ({
    value,
    onChange,
    options,
    label,
    description,
    premium = false,
  }) => (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{label}</span>
          {premium && <Crown className="w-4 h-4 text-yellow-400" />}
        </div>
        {description && (
          <div className="text-sm text-white/60">{description}</div>
        )}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        disabled={premium && userPlan === "free"}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-slate-800 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const Input = ({
    value,
    onChange,
    label,
    description,
    type = "text",
    placeholder,
    premium = false,
  }) => (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{label}</span>
          {premium && <Crown className="w-4 h-4 text-yellow-400" />}
        </div>
        {description && (
          <div className="text-sm text-white/60">{description}</div>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
        disabled={premium && userPlan === "free"}
      />
    </div>
  );

  const PlanCard = ({
    name,
    price,
    features,
    current,
    recommended = false,
  }) => (
    <div
      className={`p-6 rounded-lg border ${
        current
          ? "border-blue-500 bg-blue-500/10"
          : recommended
          ? "border-purple-500 bg-purple-500/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        {recommended && (
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
            Recommended
          </span>
        )}
        {current && (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
            Current Plan
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-4">{price}</div>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-sm text-white/80"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
          current
            ? "bg-white/10 text-white/60 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {current ? "Current Plan" : "Upgrade"}
      </button>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-400" />
          Appearance
        </h3>
        <div className="space-y-4">
          <Select
            value={settings.theme}
            onChange={(value) => updateSetting("theme", value)}
            label="Theme"
            description="Choose your preferred color scheme"
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
              { value: "auto", label: "Auto (System)" },
              { value: "cyber", label: "Cyber Blue" },
              { value: "neon", label: "Neon Purple" },
            ]}
          />
          <Select
            value={settings.language}
            onChange={(value) => updateSetting("language", value)}
            label="Language"
            description="Select your preferred language"
            options={[
              { value: "en", label: "English" },
              { value: "es", label: "Spanish" },
              { value: "fr", label: "French" },
              { value: "de", label: "German" },
              { value: "zh", label: "Chinese" },
              { value: "ja", label: "Japanese" },
              { value: "ko", label: "Korean" },
              { value: "ru", label: "Russian" },
            ]}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          Notifications
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.notifications}
            onChange={(value) => updateSetting("notifications", value)}
            label="Enable Notifications"
            description="Receive notifications for important events"
          />
          <ToggleSwitch
            enabled={settings.soundEnabled}
            onChange={(value) => updateSetting("soundEnabled", value)}
            label="Sound Notifications"
            description="Play sounds for notifications"
          />
          <ToggleSwitch
            enabled={settings.autoSave}
            onChange={(value) => updateSetting("autoSave", value)}
            label="Auto Save"
            description="Automatically save your work"
          />
        </div>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-400" />
          Personal Information
        </h3>
        <div className="space-y-4">
          <Input
            value={settings.name}
            onChange={(value) => updateSetting("name", value)}
            label="Full Name"
            description="Your display name"
          />
          <Input
            value={settings.email}
            onChange={(value) => updateSetting("email", value)}
            label="Email Address"
            description="Your primary email"
            type="email"
          />
          <Input
            value={settings.phone}
            onChange={(value) => updateSetting("phone", value)}
            label="Phone Number"
            description="Your contact number"
            type="tel"
          />
          <Input
            value={settings.location}
            onChange={(value) => updateSetting("location", value)}
            label="Location"
            description="Your current location"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Time & Region
        </h3>
        <div className="space-y-4">
          <Select
            value={settings.timezone}
            onChange={(value) => updateSetting("timezone", value)}
            label="Timezone"
            description="Your preferred timezone"
            options={[
              { value: "UTC", label: "UTC" },
              { value: "America/New_York", label: "Eastern Time" },
              { value: "America/Chicago", label: "Central Time" },
              { value: "America/Denver", label: "Mountain Time" },
              { value: "America/Los_Angeles", label: "Pacific Time" },
              { value: "Europe/London", label: "London" },
              { value: "Europe/Paris", label: "Paris" },
              { value: "Asia/Tokyo", label: "Tokyo" },
              { value: "Asia/Shanghai", label: "Shanghai" },
            ]}
          />
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Security
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.twoFactorAuth}
            onChange={(value) => updateSetting("twoFactorAuth", value)}
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
          />
          <ToggleSwitch
            enabled={settings.dataEncryption}
            onChange={(value) => updateSetting("dataEncryption", value)}
            label="Data Encryption"
            description="Encrypt your data at rest and in transit"
          />
          <Slider
            value={settings.sessionTimeout}
            onChange={(value) => updateSetting("sessionTimeout", value)}
            min={5}
            max={120}
            step={5}
            label="Session Timeout (minutes)"
            description="Automatically log out after inactivity"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-400" />
          Privacy
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.analyticsOptIn}
            onChange={(value) => updateSetting("analyticsOptIn", value)}
            label="Analytics & Telemetry"
            description="Help improve our service by sharing usage data"
          />
        </div>
      </div>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-400" />
          Subscription Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <PlanCard
            name="Free"
            price="$0/month"
            features={[
              "Basic features",
              "Limited messages",
              "Community support",
              "Standard response time",
            ]}
            current={userPlan === "free"}
          />
          <PlanCard
            name="Pro"
            price="$20/month"
            features={[
              "Advanced features",
              "Higher message limits",
              "Priority support",
              "Custom instructions",
              "Faster responses",
            ]}
            current={userPlan === "pro"}
            recommended={true}
          />
          <PlanCard
            name="Enterprise"
            price="Custom"
            features={[
              "All Pro features",
              "Unlimited messages",
              "Dedicated instances",
              "24/7 support",
              "API access",
              "Custom models",
            ]}
            current={userPlan === "enterprise"}
          />
        </div>
      </div>

      {/* <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-400" />
          Billing Cycle
        </h3>
        <div className="space-y-4">
          <Select
            value={settings.billingCycle}
            onChange={(value) => updateSetting("billingCycle", value)}
            label="Billing Frequency"
            description="How often you want to be billed"
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "yearly", label: "Yearly (Save 20%)" },
            ]}
          />
          <ToggleSwitch
            enabled={settings.autoRenewal}
            onChange={(value) => updateSetting("autoRenewal", value)}
            label="Auto Renewal"
            description="Automatically renew subscription"
          />
        </div>
      </div> */}

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Billing History
        </h3>
        <div className="space-y-2">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
            <div>
              <div className="font-medium">Pro Plan Subscription</div>
              <div className="text-sm text-white/60">July 1, 2024</div>
            </div>
            <div className="font-medium">$20.00</div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
            <div>
              <div className="font-medium">Pro Plan Subscription</div>
              <div className="text-sm text-white/60">June 1, 2024</div>
            </div>
            <div className="font-medium">$20.00</div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
            <div>
              <div className="font-medium">Pro Plan Subscription</div>
              <div className="text-sm text-white/60">May 1, 2024</div>
            </div>
            <div className="font-medium">$20.00</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "profile":
        return renderProfileSettings();
      case "privacy":
        return renderPrivacySettings();
      case "billing":
        return renderBillingSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <SettingsSidebar
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isLoggedIn={isLoggedIn}
      handleLogout={handleLogout}
      handleLogin={handleLogin}
      tabs={tabs}
      renderActiveTab={renderActiveTab}
    />
  );
};

export default SettingsComponent;
