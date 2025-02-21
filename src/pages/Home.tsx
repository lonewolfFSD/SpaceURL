import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Link2, QrCode, Copy, Check, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

export function Home() {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateShortCode = async (): Promise<string> => {
    // Generate a random code locally as fallback if RPC fails
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    try {
      const { data, error } = await supabase
        .rpc('generate_short_code');
      
      if (error) throw error;
      return data || result;
    } catch (err) {
      console.warn('Failed to generate short code via RPC, using local fallback');
      return result;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const shortCode = customAlias || await generateShortCode();
      
      const { data, error: dbError } = await supabase
        .from('shortened_urls')
        .insert([
          {
            original_url: url,
            short_code: shortCode,
            custom_alias: customAlias || null,
            user_id: user?.id || null
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;
      
      const baseUrl = window.location.origin;
      setShortUrl(`${baseUrl}/${shortCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    
    <div className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
  {/* Spline Background - Ensuring it Stays Visible */}
  <div className="absolute sm:top-[-10px] left-0 w-full h-full -z-10">
  <Spline 
    scene="https://prod.spline.design/mEHGhe4yLGZNdLSg/scene.splinecode" 
    className=" scale-[1.2] ml-16 drop-shadow-[0_10px_80px_rgba(129,130,246,0.5)]"
  />
</div>



{/* Content Container */}
<div className="max-w-3xl w-full text-center relative mt-[-100px]">
  <h1
    className="text-4xl sm:text-5xl font-bold text-white mb-4 sm:w-[90%] mx-auto"
    style={{ fontFamily: 'Atkinson Hyperlegible Next' }}
  >
    Launch Your Links into Orbit with SpaceURL
  </h1>
  <p
    className="sm:text-xl text-gray-200"
    style={{ fontFamily: 'Atkinson Hyperlegible Next' }}
  >
    Create cosmic short links that are fast, trackable, and out of this world!
  </p>
</div>

{/* Form Container */}
{/* Form Container */}
<div className="rounded-xl shadow-lg mt-10 px-9 max-w-3xl w-[100%] lg:w-[50%] relative flex flex-col items-center">
  <form onSubmit={handleSubmit} className="space-y-6 w-full flex flex-col items-center">
    <div className="w-full text-center">
      <label htmlFor="url" className="block text-sm font-medium text-gray-200 mb-2.5 text-center" style={{
        fontFamily: 'Atkinson Hyperlegible Next'
      }}>
        Enter your long URL
      </label>
      
      {/* Input Wrapper */}
      {/* URL Input */}
      <div className="mt-1 relative w-full flex justify-center">
        <div className="relative w-full sm:max-w-md">
          {/* Icon aligned left */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Link2 className="h-5 w-5 text-gray-400" />
          </div>

          {/* URL Input field */}
          <input
            type="url"
            id="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border-gray-300 bg-black/60 text-white backdrop-blur-sm rounded-md focus:outline-none ring-4 ring-indigo-500 border-indigo-500"
            placeholder="https://example.com/verylong/url"
          />
        </div>
      </div>

      {/* Alias Input */}
      <div className="mt-4 relative w-full flex justify-center">
        <div className="relative w-full sm:max-w-md">
          {/* Icon aligned left */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Tag className="h-5 w-5 text-gray-400" /> {/* Tag icon for alias */}
          </div>

          {/* Alias Input field */}
          <input
            type="text"
            id="alias"
            name='alias'
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border-gray-300 bg-black/60 text-white backdrop-blur-sm rounded-md focus:outline-none ring-4 ring-indigo-500 border-indigo-500"
            placeholder="Custom alias (optional)"
          />
        </div>
      </div>


    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-[80%] sm:w-[60%] lg:w-[60%] max-w-md flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      {loading ? 'Shortening... Please Wait' : 'Shorten URL'}
    </button>
  </form>

  {/* Short URL Section (kept unchanged) */}
  {shortUrl && (
    <div className="mt-8 space-y-6 z-10 flex flex-col items-center">
      <div className="bg-gray-50 p-6 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <h3 className="text-sm font-medium text-gray-900">Your shortened URL</h3>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-indigo-600 hover:text-indigo-500"
            >
              {shortUrl}
            </a>
          </div>
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-md hover:bg-gray-200 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
          <QrCode className="h-5 w-5 mr-2" />
          QR Code
        </h3>
        <div className="flex justify-center bg-white p-4 rounded-lg">
          <QRCodeSVG value={shortUrl} size={200} />
        </div>
      </div>

      {!user && (
        <div className="text-center text-sm text-gray-100">
          <Link to="/auth" className="text-indigo-500 underline hover:text-indigo-400" style={{
            fontWeight: '500'
          }}>
            Sign in
          </Link>
          {' '}to track analytics and manage your shortened URLs
        </div>
      )}
    
    </div>
  )}
  <br /><br />
  <p className="text-center text-sm text-white p-4">
  By navigating the SpaceURL galaxy, you agree to our 
  <a href="" className="text-indigo-500 underline"> Terms of Orbit </a> and  
  <a href="" className="text-indigo-500 underline"> Data Constellation Policy </a>.
</p>
</div>

</div>

  );
}