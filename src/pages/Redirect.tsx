import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import UAParser from 'ua-parser-js';

export function Redirect() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      try {
        // Get the original URL
        const { data: urlData, error: urlError } = await supabase
          .from('shortened_urls')
          .select('id, original_url')
          .eq('short_code', shortCode)
          .single();

        if (urlError || !urlData) {
          navigate('/');
          return;
        }

        // Parse user agent
        const parser = new UAParser();
        const result = parser.getResult();

        // Record analytics
        await supabase.from('url_analytics').insert({
          url_id: urlData.id,
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          browser: result.browser.name || 'Unknown',
          os: result.os.name || 'Unknown',
          device_type: result.device.type || 'desktop',
        });

        // Redirect to the original URL
        window.location.href = urlData.original_url;
      } catch (err) {
        console.error('Error during redirect:', err);
        navigate('/');
      }
    };

    redirect();
  }, [shortCode]);

  return (
    <div className="min-h-screen flex items-center justify-center mt-[-120px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-200">Redirecting...</p>
      </div>
    </div>
  );
}