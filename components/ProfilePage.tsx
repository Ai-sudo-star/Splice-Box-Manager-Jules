import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { CameraIcon, UserIcon } from './Icons';

interface ProfilePageProps {
    profile: UserProfile;
    onSave: (newProfile: UserProfile) => void;
    onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onSave, onBack }) => {
    const [formData, setFormData] = useState<UserProfile>(profile);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [name]: checked,
            },
        }));
    };
    
    const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <main className="mt-8 max-w-3xl mx-auto animate-fade-in-down">
            <div className="bg-slate-800 p-6 sm:p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4">User Profile</h2>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 ring-4 ring-slate-700">
                                {formData.profilePicture ? (
                                    <img src={formData.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <UserIcon className="w-12 h-12" />
                                )}
                            </div>
                             <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
                                aria-label="Change profile picture"
                            >
                                <CameraIcon />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePictureUpload}
                                className="hidden"
                                accept="image/png, image/jpeg, image/gif"
                            />
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-xl font-semibold text-white">{formData.displayName}</h3>
                            <p className="text-slate-400">Update your photo and personal details.</p>
                        </div>
                    </div>
                    
                    {/* Form Fields */}
                    <div className="space-y-6">
                         <div>
                            <label htmlFor="displayName" className="block text-slate-300 mb-2 font-semibold">Display Name</label>
                            <input
                                id="displayName"
                                name="displayName"
                                type="text"
                                value={formData.displayName}
                                onChange={handleInputChange}
                                className="w-full bg-slate-700 border border-slate-600 text-white p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        <div>
                            <h4 className="text-slate-300 font-semibold mb-3">Notification Preferences</h4>
                            <div className="space-y-3">
                                <label htmlFor="emailNotifications" className="flex items-center justify-between p-3 bg-slate-700 rounded-md cursor-pointer">
                                    <span className="text-white">Email Notifications</span>
                                    <div className="relative inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            id="emailNotifications"
                                            name="email"
                                            className="sr-only"
                                            checked={formData.notifications.email}
                                            onChange={handleNotificationChange}
                                        />
                                        <div className="w-11 h-6 bg-slate-600 rounded-full toggle-bg transition"></div>
                                    </div>
                                </label>
                                 <label htmlFor="pushNotifications" className="flex items-center justify-between p-3 bg-slate-700 rounded-md cursor-pointer">
                                    <span className="text-white">Push Notifications</span>
                                     <div className="relative inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            id="pushNotifications"
                                            name="push"
                                            className="sr-only"
                                            checked={formData.notifications.push}
                                            onChange={handleNotificationChange}
                                        />
                                        <div className="w-11 h-6 bg-slate-600 rounded-full toggle-bg transition"></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-4 border-t border-slate-700">
                        <button type="button" onClick={onBack} className="bg-slate-600 hover:bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-md transition-all duration-200">
                            Back to Manager
                        </button>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ProfilePage;
