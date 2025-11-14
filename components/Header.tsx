import React from 'react';
import { UserProfile } from '../types';
import { UserIcon } from './Icons';

interface HeaderProps {
    profile: UserProfile;
    onNavigateToProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ profile, onNavigateToProfile }) => (
  <header className="flex justify-between items-center text-center p-4">
    <div className="w-12 h-12"></div> {/* Spacer to balance the profile button */}
    <div className="flex-1">
      <h1 className="text-3xl md:text-4xl font-bold text-cyan-400">Splice Box Manager</h1>
      <p className="text-slate-400 mt-2">Generate, track, and view details for your splice box IDs.</p>
    </div>
    <div className="w-12 h-12 flex items-center justify-center">
        <button
            onClick={onNavigateToProfile}
            className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 transition-all duration-200 ring-2 ring-transparent hover:ring-cyan-400 focus:outline-none focus:ring-cyan-400"
            aria-label="Open user profile"
        >
            {profile.profilePicture ? (
                <img src={profile.profilePicture} alt="User Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
                <UserIcon className="h-6 w-6" />
            )}
        </button>
    </div>
  </header>
);

export default Header;
