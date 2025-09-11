'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

const Sidebar = ({ activeMenu, onMenuChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  
  return (
    <div 
      className={`bg-white min-h-screen border-r border-gray-100 transition-all duration-300 relative ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
      onMouseEnter={() => setShowArrow(true)}
      onMouseLeave={() => setShowArrow(false)}
    >
      {/* Header with Logo */}
      <div className="px-3 py-4 border-gray-100 relative">
        <div className={`flex ${isCollapsed ? 'justify-center items-center' : 'flex-col'} space-y-2`}>
          {isCollapsed ? (
            <Image
              src="/logo-demplon.png"
              alt="Demplon Logo"
              width={60}
              height={60}
              className="rounded"
            />
          ) : (
            <Image
              src="/logo-demplon.png"
              alt="Demplon Logo"
              width={150}
              height={150}
              className="rounded"
            />
          )}
        </div>
        
        {/* Toggle Arrow Button */}
        {showArrow && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg transition-all duration-200 z-10"
          >
            <svg 
              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                isCollapsed ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* User Profile Section */}
      <div className={`${isCollapsed ? 'px-2' : 'px-4'} py-3 border-gray-100 transition-all duration-300`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className={`${isCollapsed ? 'w-10 h-10' : 'w-10 h-10'} bg-red-500 rounded-full flex items-center justify-center transition-all duration-300`}>
            <span className="text-white font-semibold text-sm">DF</span>
          </div>
          {!isCollapsed && (
            <div className="opacity-100 transition-opacity duration-300">
              <div className="font-medium text-gray-900 text-sm">Difa Nugraha</div>
              <div className="text-xs text-gray-600">10122059</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`${isCollapsed ? 'px-2' : 'px-4'} py-4 transition-all duration-300`}> 
        {/* GENERALS Section */}
        <div className="mb-6">
          {!isCollapsed && (
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 opacity-100 transition-opacity duration-300">
              GENERALS
            </div>
          )}
          {isCollapsed && (
            <div className="h-0 mb-3 opacity-0 transition-all duration-300"></div>
          )}
          
          <ul className="space-y-1">
            {/* Home */}
            <li>
              <button
                onClick={() => onMenuChange('Home')}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2 transition-all duration-300 text-sm rounded-md ${
                  activeMenu === 'Home'
                    ? 'text-white'
                    : 'text-gray-950'
                }`}
                style={activeMenu === 'Home' ? { backgroundColor: '#01793b' } : {}}
                title={isCollapsed ? 'Home' : ''}
              >
                <svg className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} transition-all duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {!isCollapsed && <span className="opacity-100 transition-opacity duration-300">Home</span>}
              </button>
            </li>

            {/* Profile */}
            <li>
              <button
                onClick={() => onMenuChange('Profile')}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2 transition-all duration-300 text-sm rounded-md ${
                  activeMenu === 'Profile'
                    ? 'text-white'
                    : 'text-gray-950'
                }`}
                style={activeMenu === 'Profile' ? { backgroundColor: '#01793b' } : {}}
                title={isCollapsed ? 'Profile' : ''}
              >
                <svg className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} transition-all duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                {!isCollapsed && <span className="opacity-100 transition-opacity duration-300">Profile</span>}
              </button>
            </li>

            {/* Employment */}
            <li>
              <button
                onClick={() => onMenuChange('Employment')}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2 transition-all duration-300 text-sm rounded-md ${
                  activeMenu === 'Employment'
                    ? 'text-white'
                    : 'text-gray-950'
                }`}
                style={activeMenu === 'Employment' ? { backgroundColor: '#01793b' } : {}}
                title={isCollapsed ? 'Employment' : ''}
              >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} transition-all duration-300`}
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <polyline points="16 11 18 13 22 9"></polyline>
                </svg>
                {!isCollapsed && <span className="opacity-100 transition-opacity duration-300">Employment</span>}
              </button>
            </li>

            {/* Kehadiran, Koreksi, Cuti, dan Dinas */}
            <li>
              <button
                onClick={() => onMenuChange('Kehadiran')}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2 transition-all duration-300 text-sm rounded-md ${
                  activeMenu === 'Kehadiran'
                    ? 'text-white'
                    : 'text-gray-950'
                }`}
                style={activeMenu === 'Kehadiran' ? { backgroundColor: '#01793b' } : {}}
                title={isCollapsed ? 'Kehadiran, Koreksi, Cuti, dan Dinas' : ''}
              >
                <svg className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} flex-shrink-0 transition-all duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {!isCollapsed && <span className="text-left opacity-100 transition-opacity duration-300">Kehadiran, Koreksi, Cuti, dan Dinas</span>}
              </button>
            </li>
          </ul>
        </div>
        
        <div className="mb-6">
          {!isCollapsed && (
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 opacity-100 transition-opacity duration-300">
              APPS & FEATURE
            </div>
          )}
          {isCollapsed && (
            <div className="h-0 mb-3 opacity-0 transition-all duration-300"></div>
          )}
          
          <ul className="space-y-1">
            {/* SIADIL */}
            <li>
              <button
                onClick={() => onMenuChange('SIADIL')}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2 transition-all duration-300 text-sm rounded-md ${
                  activeMenu === 'SIADIL'
                    ? 'text-white'
                    : 'text-gray-950'
                }`}
                style={activeMenu === 'SIADIL' ? { backgroundColor: '#01793b' } : {}}
                title={isCollapsed ? 'SIADIL' : ''}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} transition-all duration-300`}
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" x2="8" y1="13" y2="13"></line>
                  <line x1="16" x2="8" y1="17" y2="17"></line>
                  <line x1="10" x2="8" y1="9" y2="9"></line>
                </svg>
                {!isCollapsed && <span className="opacity-100 transition-opacity duration-300">SIADIL</span>}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
