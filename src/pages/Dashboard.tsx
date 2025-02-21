import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { Trash2, ExternalLink, QrCode, BarChart3, Globe, Monitor, Smartphone, ArrowBigLeft, ArrowBigRight } from 'lucide-react';

interface ShortenedUrl {
  id: string;
  original_url: string;
  short_code: string;
  custom_alias: string | null;
  created_at: string;
  click_count: number;
}

interface Analytics {
  browser_counts: Record<string, number>;
  device_counts: Record<string, number>;
  country_counts: Record<string, number>;
}

export function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, Analytics>>({});
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchUrls();
  }, [user, authLoading]);

  const fetchUrls = async () => {
    try {
      const { data, error } = await supabase
        .from('shortened_urls')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUrls(data || []);

      // Fetch analytics for each URL
      for (const url of data || []) {
        fetchAnalytics(url.id);
      }
    } catch (err) {
      console.error('Error fetching URLs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (urlId: string) => {
    try {
      const { data, error } = await supabase
        .from('url_analytics')
        .select('browser, device_type, country')
        .eq('url_id', urlId);

      if (error) throw error;

      const analytics: Analytics = {
        browser_counts: {},
        device_counts: {},
        country_counts: {},
      };

      data.forEach((click) => {
        analytics.browser_counts[click.browser] = (analytics.browser_counts[click.browser] || 0) + 1;
        analytics.device_counts[click.device_type] = (analytics.device_counts[click.device_type] || 0) + 1;
        analytics.country_counts[click.country] = (analytics.country_counts[click.country] || 0) + 1;
      });

      setAnalytics(prev => ({ ...prev, [urlId]: analytics }));
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const deleteUrl = async (id: string) => {
    try {
      const { error } = await supabase
        .from('shortened_urls')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setUrls(urls.filter(url => url.id !== id));
    } catch (err) {
      console.error('Error deleting URL:', err);
    }
  };

  

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    );
  }

  const getRandomColor = (name: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="space-y-6">


<h1 className="text-3xl font-bold text-gray-100 flex items-center space-x-3">
  {user?.user_metadata?.avatar_url ? (
    <img
      src={user?.user_metadata?.avatar_url}
      alt="User Avatar"
      className="w-10 h-10 rounded-full border border-gray-500"
    />
  ) : (
<div className={`w-10 h-10 rounded-full flex items-center justify-center text-[23px] text-white font-semibold ${getRandomColor(user?.user_metadata?.full_name || user?.email || 'U')}`}>
  {(user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase()}
</div>

  )}
  <span>{user?.user_metadata?.full_name || user?.email}'s URLs</span>
</h1>



      
      {urls.length === 0 ? (
        <div className="text-center py-12 bg-[#0e0e0e]/50 rounded-lg shadow">
          <p className="text-gray-100">You haven't created any shortened URLs yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {urls.map((url) => (
            <div key={url.id} className="bg-[#0e0e0e]/60 backdrop-blur-sm border-2 rounded-3xl shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl flex font-semibold text-white truncate">
                    URL Endpoint <ArrowBigRight className='mx-2 mt-0.5' /> {url.custom_alias || url.short_code}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedUrl(selectedUrl === url.id ? null : url.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    >
                      <QrCode className="h-5 w-5" />
                    </button>
                    <a
                      href={url.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                    <button
                      onClick={() => deleteUrl(url.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="text-sm flex text-gray-500 mb-4">
                  Original URL <ArrowBigRight size={16} className='mx-2 mt-0.5' /> {url.original_url}
                </div>

                {selectedUrl === url.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg flex justify-center">
                    <QRCodeSVG value={`${window.location.origin}/${url.short_code}`} size={200} />
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-200 font-medium">{url.click_count}</span>
                      <span className="ml-1 text-gray-500">clicks</span>
                    </div>

                    {analytics[url.id] && (
                      <>
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-200 font-medium">
                            {Object.keys(analytics[url.id].country_counts).length}
                          </span>
                          <span className="ml-1 text-gray-500">countries</span>

                          {/* List of Countries */}
                                {Object.entries(analytics[url.id].country_counts).length > 0 && (
                                  <div className="text-gray-400 text-sm mt-[2px] ml-3">
                                    <span className="font-medium text-gray-300">Top Countries: </span>
                                    {Object.entries(analytics[url.id].country_counts)
                                      .sort(([, a], [, b]) => b - a) // Sort by most visits
                                      .slice(0, 3) // Show top 3
                                      .map(([country, count], index) => (
                                        <span key={country}>
                                          {index > 0 && ', '}
                                          <span className="text-gray-200 font-medium">{country}</span> ({count})
                                        </span>
                                      ))}
                                  </div>
                                )}
                        </div>

                        

                        <div className="flex items-center">
                          {Object.entries(analytics[url.id].device_counts)
                            .sort(([, a], [, b]) => b - a)[0]?.[0] === 'desktop' ? (
                            <Monitor className="h-5 w-5 text-gray-400 mr-2" />
                          ) : (
                            <Smartphone className="h-5 w-5 text-gray-400 mr-2" />
                          )}
                          <span className="text-gray-200 underline font-medium">
                            {Object.entries(analytics[url.id].device_counts)
                              .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Unknown'}
                          </span>
                          <span className="ml-1 text-gray-500">most used</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}