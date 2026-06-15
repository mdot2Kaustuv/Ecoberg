import { useState, useEffect } from 'react';
import axios from 'axios';

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/news/');
        setNewsList(response.data.news || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-medium"></div>
      </div>
    );
  }

  if (newsList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 font-sans">No recent updates found. Check back later!</p>
      </div>
    );
  }

  const featured = newsList[0];
  const regularArticles = newsList.slice(1);

  // Helper function to format the 'published_at' timestamp nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      
      <div className="mb-12 text-center md:text-left">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide border border-brand-medium/30 bg-brand-medium/10 text-brand-dark uppercase font-display">
          🌱 Platform Insights
        </span>
        <h1 className="mt-3 text-4xl md:text-5xl font-black font-display text-slate-900 tracking-tight">
          EcoBerg <span className="text-brand-medium">Newsroom</span>
        </h1>
      </div>

      {/* 1. Featured Article (Dynamic Image Background with EcoBerg Gradient Overlay) */}
      {featured && (
        <div className="relative overflow-hidden rounded-3xl bg-brand-dark text-white shadow-xl mb-12 min-h-[460px] flex flex-col justify-end group">
          {/* Article Cover Image */}
          {featured.image ? (
            <img 
              src={featured.image} 
              alt={featured.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            /* Fallback clean background matching the original gradient design if no image exists */
            <div className="absolute inset-0 bg-gradient-to-br from-[#023326] via-[#054e3b] to-[#0b6e54]" />
          )}
          
          {/* High-contrast dark gradient overlay mimicking screen aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent" />
          
          {/* Content area */}
          <div className="p-6 md:p-12 relative z-10 max-w-3xl">
            <span className="text-xs font-bold tracking-widest text-brand-bright uppercase font-display bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
              {featured.source || 'Featured'}
            </span>
            <h2 className="mt-4 text-2xl md:text-4xl font-extrabold font-display leading-tight tracking-tight">
              {featured.title}
            </h2>
            <p className="mt-3 text-slate-200 font-sans text-sm md:text-base line-clamp-3">
              {featured.description}
            </p>
            
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-3 text-xs text-slate-300 font-sans">
                <span>By {featured.author || 'EcoBerg Staff'}</span>
                <span>•</span>
                <span className="font-mono">{formatDate(featured.date)}</span>
              </div>
              
              <a 
                href={featured.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-bright text-brand-dark font-bold font-sans px-5 py-2.5 rounded-full text-xs md:text-sm hover:opacity-90 transition-all shadow-md"
              >
                Read full article
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Secondary Regular Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {regularArticles.map((article, index) => (
          <article 
            key={index} 
            className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail Area */}
              <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                {article.image ? (
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-dark to-brand-medium flex items-center justify-center text-white/20 font-bold">
                    EcoBerg
                  </div>
                )}
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-brand-dark px-2.5 py-1 rounded-md shadow-sm">
                  {article.source || 'News'}
                </span>
              </div>

              {/* Text Area */}
              <div className="p-5 md:p-6">
                <span className="text-[11px] text-slate-400 font-mono">{formatDate(article.date)}</span>
                <h3 className="mt-2 text-lg font-bold font-display text-slate-900 group-hover:text-brand-medium transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-2 text-slate-600 text-xs leading-relaxed line-clamp-3">
                  {article.description}
                </p>
              </div>
            </div>

            {/* Footer / Action Area */}
            <div className="px-5 md:px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-50">
              <span className="text-xs text-slate-400 font-sans truncate max-w-[120px]">
                By {article.author || 'Staff'}
              </span>
              <a 
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold font-sans text-xs tracking-wider uppercase text-brand-dark group-hover:text-brand-medium transition-colors"
              >
                View Post
                <svg className="w-3 h-3 transform transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default News;