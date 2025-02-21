import React, { useState } from 'react';
import { supabase } from "../supabaseClient"; // Adjust the import based on your project structure
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { Mail, Lock, UserPlus, LogIn, Github } from 'lucide-react';

export function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });
  
    if (error) {
      console.error("OAuth login error:", error.message);
    }
  };
  

  return (
    <div className="h-screen flex items-center justify-center mt-[-90px] ">
  <div className="max-w-md w-full bg-[#0a0a0a]/80 backdrop-blur-[1.5px] py-12 px-10 shadow-xl shadow-indigo-500/30 rounded-lg border-2 border-indigo-500">
  <div className="text-center mb-8">
  <img
    className="w-40 mx-auto mt-[-26px]"
    style={{
      filter: 'brightness(100)'
    }}
    src="https://i.ibb.co/Q3ymGmVN/DALL-E-2025-02-20-17-59-47-A-minimalistic-vector-logo-of-Earth-in-space-The-design-should-be-clean-a.png"
  />
  <h2 className="text-3xl font-bold text-gray-100">
    {isSignUp ? 'Create an account' : 'Welcome back'}
  </h2>
  <p className="mt-2 text-gray-300">
    {isSignUp ? 'Sign up to manage your shortened URLs' : 'Sign in to access your dashboard'}
  </p>
</div>


    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl">
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
      Email address
    </label>
    <div className="mt-1 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Mail className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id="email"
        type="email"
        required
        value={email}
        placeholder="example@xyz.com"
        onChange={(e) => setEmail(e.target.value)}
        className="block w-full text-white pl-10 pr-3 py-3 mb-[-10px] border bg-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  </div>

  <div>
    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
      Password
    </label>
    <div className="mt-1 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Lock className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id="password"
        type="password"
        required
        value={password}
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
        className="block w-full text-white pl-10 pr-3 py-3 border bg-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  </div>

  {error && <div className="text-red-600 text-sm">{error}</div>}

  <button
    type="submit"
    disabled={loading}
    className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
  >
    {isSignUp ? <UserPlus className="h-5 w-5 mr-2" /> : <LogIn className="h-5 w-5 mr-2" />}
    {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
  </button>
          <hr className='py-2' /> 
  <div className="flex items-center justify-center space-x-3">
    <button
      onClick={() => handleOAuthLogin("github")}
      className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
    >
      <Github className="h-5 w-5 mr-2" />
      Continue with GitHub
    </button>
  </div>
  <div className="flex items-center justify-center space-x-3" style={{
    marginTop: '13px'
  }}>
    <button
    disabled
      // onClick={() => handleOAuthLogin("spotify")}
      className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md text-gray-400 cursor-not-allowed bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
    >
      <FontAwesomeIcon icon={faSpotify} className="h-5 w-5 mr-2" />
      Temporarily Unavailable
    </button>
  </div>
</form>


    <div className="mt-6 text-center">
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
        style={{ fontFamily: 'Atkinson Hyperlegible Next' }}
      >
        {isSignUp
          ? 'Already have an account? Sign in'
          : "Don't have an account? Sign up"}
      </button>
    </div>
  </div>
</div>

  );
}