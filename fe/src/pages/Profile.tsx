import React from 'react';
import { FaBook, FaTags, FaRocket } from 'react-icons/fa';

interface UserStats {
  notesCreated: number;
  tagsUsed: number;
  projectsCompleted: number;
}

interface UserProfileProps {
  name: string;
  bio: string;
  profilePicUrl: string;
  stats: UserStats;
}

const Profile: React.FC<UserProfileProps> = ({ name, bio, profilePicUrl, stats }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-2xl">
        
        {/* Profile Header Section */}
        <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute inset-0 flex items-center justify-center -bottom-16">
            <img
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              src={profilePicUrl}
              alt={`${name}'s profile`}
            />
          </div>
        </div>

        {/* Profile Content Section */}
        <div className="pt-20 pb-8 px-6 sm:px-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">{bio}</p>
        </div>
        
        <hr className="border-gray-200 mx-6 sm:mx-10" />

        {/* User Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 px-6 sm:px-10">
          
          {/* Notes Created Stat */}
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <FaBook className="text-blue-500 text-3xl mb-2" />
            <span className="text-2xl font-bold text-gray-800">{stats.notesCreated}</span>
            <span className="text-sm text-gray-500">Notes Created</span>
          </div>
          
          {/* Tags Used Stat */}
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <FaTags className="text-purple-500 text-3xl mb-2" />
            <span className="text-2xl font-bold text-gray-800">{stats.tagsUsed}</span>
            <span className="text-sm text-gray-500">Tags Used</span>
          </div>

          {/* Projects Completed Stat */}
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <FaRocket className="text-green-500 text-3xl mb-2" />
            <span className="text-2xl font-bold text-gray-800">{stats.projectsCompleted}</span>
            <span className="text-sm text-gray-500">Projects</span>
          </div>
        </div>

        {/* Example of a clickable edit button or link */}
        <div className="p-6 sm:p-10 text-center">
          <a
            href="#"
            className="inline-block px-8 py-3 bg-gray-800 text-white rounded-full font-medium shadow-lg hover:bg-gray-700 transition-colors"
          >
            Edit Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;