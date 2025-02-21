import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Link as LinkIcon, BarChart, LogOut, LogIn, Github } from 'lucide-react';

export function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
<div className="relative min-h-screen overflow-hidden">
  {/* Scrolling background wrapper */}
  <div className="absolute top-0 left-0 flex w-[200%] h-full animate-scroll">
    {/* Two identical background divs for seamless looping */}
    <div className="w-1/2 h-full bg-cover bg-center bg-[url('https://4kwallpapers.com/images/wallpapers/stars-galaxy-3840x2160-10307.jpg')]"></div>
    <div className="w-1/2 h-full bg-cover bg-center bg-[url('https://4kwallpapers.com/images/wallpapers/stars-galaxy-3840x2160-10307.jpg')]"></div>
  </div>

  {/* Background Overlay (Only affects the background) */}
  <div className="absolute inset-0 bg-black/60"></div>

  {/* Content (Nav & Main) */}
  <div className="relative z-10">
    <nav className="bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <img className='w-[75px] mt-1' src="https://i.ibb.co/Q3ymGmVN/DALL-E-2025-02-20-17-59-47-A-minimalistic-vector-logo-of-Earth-in-space-The-design-should-be-clean-a.png" style={{
                filter: 'brightness(100)'
              }}/>
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-900 hover:bg-gray-50"
                >
                  <BarChart className="h-5 w-5 mr-2" />
                  Dashboard
                </Link>
                <a
                  href="https://github.com/lonewolfFSD/SpaceURL"
                  className="sm:ml-4 flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-900 hover:bg-gray-50"
                >
                  <Github className="h-5 w-5 mr-2" />
                  <span className='hidden sm:block'>GitHub Repo</span><span className='block sm:hidden'>Repo</span>
                </a>
                <button
                  onClick={handleSignOut}
                  className="sm:ml-4 flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-900 hover:bg-gray-50"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span className='hidden md:block'>Sign Out</span>
                </button>
              </>
            ) : (
              <>
              <a
                  href="https://github.com/lonewolfFSD/SpaceURL"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-900 hover:bg-gray-50"
                >
                  <Github className="h-5 w-5 mr-2" />
                  GitHub Repo
                </a>
              <Link
                to="/auth"
                className="ml-3 flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-900 hover:bg-gray-50"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </main>
  </div>
</div>
  );
}