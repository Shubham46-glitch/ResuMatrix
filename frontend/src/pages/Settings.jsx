import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Key, Mail, Smartphone, Globe, CreditCard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, updateProfile, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [activeTab, setActiveTab] = useState('Profile');

  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(' ') : [''];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
      setAvatarPreview(user.avatar || '');
      setWeeklyReports(user.weeklyReports || false);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (!fullName) {
        alert('Name cannot be empty');
        setIsSaving(false);
        return;
      }
      await updateProfile({ name: fullName, avatar, weeklyReports });
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDarkModeToggle = () => {
    alert('ResuMatrix is permanently set to Dark Mode for the best matrix aesthetics!');
    setIsDarkMode(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    setAvatarPreview('');
  };

  const handlePasswordReset = async () => {
    try {
      if (!user?.email) {
        alert('Email not found. Cannot send reset link.');
        return;
      }
      const { data } = await axios.post('/api/auth/forgotpassword', { email: user.email });
      alert(data.message || 'Password reset link sent to your email!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reset email.');
    }
  };

  const handleNotImplemented = (feature) => {
    alert(`${feature} settings are coming soon!`);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure? This action cannot be undone and will permanently delete your account and all associated data.")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete('/api/auth/me', config);
        logout();
        navigate('/');
        alert("Your account has been successfully deleted.");
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete account');
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Notifications':
        return (
          <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Bell className="h-5 w-5 text-matrix-accent" /> Notification Settings</h3>
            <p className="text-matrix-text-muted mb-6">Manage how you receive alerts and updates.</p>
            <div className="space-y-4">
               <div className="flex items-center justify-between py-3 border-b border-matrix-border/50">
                   <div>
                       <p className="text-white font-medium">Email Alerts</p>
                       <p className="text-matrix-text-muted text-sm">Receive emails when an analysis is complete.</p>
                   </div>
                   <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                       <input type="checkbox" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-matrix-accent appearance-none cursor-pointer right-0" />
                       <label className="toggle-label block overflow-hidden h-6 rounded-full bg-matrix-accent cursor-pointer"></label>
                   </div>
               </div>
               <div className="flex items-center justify-between py-3 border-b border-matrix-border/50">
                   <div>
                       <p className="text-white font-medium">Push Notifications</p>
                       <p className="text-matrix-text-muted text-sm">Receive browser push notifications.</p>
                   </div>
                   <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                       <input type="checkbox" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-[#232D42] appearance-none cursor-pointer" />
                       <label className="toggle-label block overflow-hidden h-6 rounded-full bg-[#232D42] cursor-pointer"></label>
                   </div>
               </div>
            </div>
            <div className="mt-8 p-4 bg-[#1C2333] border border-matrix-border rounded-xl">
               <p className="text-sm text-matrix-text-muted italic">Note: These settings are currently in preview mode.</p>
            </div>
          </div>
        );
      case 'Privacy':
        return (
          <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-matrix-success" /> Privacy & Security</h3>
            <p className="text-matrix-text-muted mb-6">Secure your account and manage your data.</p>
            <div className="space-y-4">
                <button onClick={handlePasswordReset} className="w-full text-left px-4 py-3 bg-[#0B0F19] border border-matrix-border hover:border-matrix-accent rounded-xl text-white transition-colors">
                    <div className="font-medium">Change Password</div>
                    <div className="text-sm text-matrix-text-muted mt-1">Send a reset link to your registered email address.</div>
                </button>
                <button onClick={handleDeleteAccount} className="w-full text-left px-4 py-3 bg-[#1D1316] border border-matrix-warning/30 hover:border-matrix-warning rounded-xl text-matrix-warning transition-colors">
                    <div className="font-medium text-[#FCA5A5]">Delete Account</div>
                    <div className="text-sm text-matrix-warning/70 mt-1">Permanently remove your account and all resume data.</div>
                </button>
            </div>
          </div>
        );
      case 'Billing':
        return (
          <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5 text-[#EAB308]" /> Billing & Subscription</h3>
            <div className="p-6 bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-matrix-border rounded-xl mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CreditCard className="h-24 w-24 text-white" />
                </div>
                <h4 className="text-white font-bold text-xl mb-1">Free Tier</h4>
                <p className="text-matrix-text-muted text-sm mb-4">You are currently on the basic plan.</p>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white">$0</span>
                    <span className="text-matrix-text-muted mb-1">/month</span>
                </div>
            </div>
            <button onClick={() => alert("Upgrading to premium is coming soon!")} className="w-full py-3 bg-matrix-accent hover:bg-matrix-accent-hover text-white rounded-xl font-medium transition-colors shadow-lg shadow-matrix-accent/20">
                Upgrade to Premium
            </button>
          </div>
        );
      case 'Profile':
      default:
        return (
          <>
            {/* Profile Section */}
            <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Public Profile</h3>
                
                <div className="flex items-center gap-6 mb-6">
                    <div className="h-20 w-20 rounded-full bg-matrix-accent flex items-center justify-center text-2xl font-bold text-white border-2 border-matrix-border uppercase overflow-hidden">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            firstName ? firstName[0] : 'U'
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <div>
                            <input type="file" id="avatarUpload" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            <label htmlFor="avatarUpload" className="cursor-pointer bg-[#2D3346] hover:bg-[#384056] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                Change Avatar
                            </label>
                        </div>
                        <button onClick={handleRemoveAvatar} className="text-matrix-warning hover:text-[#FCA5A5] text-sm font-medium transition-colors">Remove</button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-matrix-text-muted mb-1">First Name</label>
                            <input 
                                type="text" 
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full bg-[#0B0F19] border border-matrix-border rounded-lg px-4 py-2.5 text-white focus:border-matrix-accent focus:ring-1 focus:ring-matrix-accent outline-none transition-all" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-matrix-text-muted mb-1">Last Name</label>
                            <input 
                                type="text" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full bg-[#0B0F19] border border-matrix-border rounded-lg px-4 py-2.5 text-white focus:border-matrix-accent focus:ring-1 focus:ring-matrix-accent outline-none transition-all" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-matrix-text-muted mb-1">Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            disabled
                            className="w-full bg-[#0B0F19] border border-matrix-border rounded-lg px-4 py-2.5 text-matrix-text-muted cursor-not-allowed focus:border-matrix-accent focus:ring-1 focus:ring-matrix-accent outline-none transition-all opacity-70" 
                        />
                        <p className="text-xs text-matrix-text-muted mt-1">Email address cannot be changed.</p>
                    </div>
                </div>
            </div>

            {/* Account Preferences */}
            <div className="bg-matrix-panel border border-matrix-border rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Account Preferences</h3>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-matrix-border/50">
                        <div>
                            <p className="text-white font-medium">Dark Mode</p>
                            <p className="text-matrix-text-muted text-sm">Always use the dark matrix theme.</p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input 
                                type="checkbox" 
                                id="toggle1" 
                                checked={isDarkMode}
                                onChange={handleDarkModeToggle}
                                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-matrix-accent appearance-none cursor-pointer right-0" 
                            />
                            <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-matrix-accent cursor-pointer"></label>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-white font-medium">Weekly Reports</p>
                            <p className="text-matrix-text-muted text-sm">Receive a weekly email summarizing your ATS scores.</p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input 
                              type="checkbox" 
                              id="toggle2" 
                              checked={weeklyReports}
                              onChange={() => setWeeklyReports(!weeklyReports)}
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-[#232D42] appearance-none cursor-pointer" 
                            />
                            <label htmlFor="toggle2" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${weeklyReports ? 'bg-matrix-accent' : 'bg-[#232D42]'}`}></label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="bg-matrix-accent hover:bg-matrix-accent-hover text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(99,102,241,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-matrix-text-muted mb-8">Manage your profile, preferences, and billing details.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Settings Sidebar */}
            <div className="space-y-1">
                <button onClick={() => setActiveTab('Profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'Profile' ? 'bg-matrix-panel border border-matrix-border text-white' : 'text-matrix-text-muted hover:text-white hover:bg-matrix-panel/50'}`}>
                    <User className="h-4 w-4" /> Profile
                </button>
                <button onClick={() => setActiveTab('Notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'Notifications' ? 'bg-matrix-panel border border-matrix-border text-white' : 'text-matrix-text-muted hover:text-white hover:bg-matrix-panel/50'}`}>
                    <Bell className="h-4 w-4" /> Notifications
                </button>
                <button onClick={() => setActiveTab('Privacy')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'Privacy' ? 'bg-matrix-panel border border-matrix-border text-white' : 'text-matrix-text-muted hover:text-white hover:bg-matrix-panel/50'}`}>
                    <Shield className="h-4 w-4" /> Privacy & Security
                </button>
                <button onClick={() => setActiveTab('Billing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'Billing' ? 'bg-matrix-panel border border-matrix-border text-white' : 'text-matrix-text-muted hover:text-white hover:bg-matrix-panel/50'}`}>
                    <CreditCard className="h-4 w-4" /> Billing
                </button>
            </div>

            {/* Settings Content */}
            <div className="md:col-span-3 space-y-6">
                {renderContent()}
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
