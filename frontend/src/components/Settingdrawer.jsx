import { useEffect, useRef } from 'react';
import { X, Lock, Mail, HelpCircle, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsDrawer = ({ isOpen, onClose }) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const menuItems = [
    {
      icon: <Lock className="w-5 h-5 text-emerald-600" />,
      label: 'Change Password',
      description: 'Update your account password',
      to: '/change-password',
      isLink: true,
    },
    {
      icon: <Mail className="w-5 h-5 text-emerald-600" />,
      label: 'Contact Us',
      description: 'Get in touch with our team',
      to: '/contact',
      isLink: true,
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-emerald-600" />,
      label: 'Help & Support',
      description: 'FAQs and documentation',
      to: '/help',
      isLink: true,
    },
    {
      icon: <Star className="w-5 h-5 text-emerald-600" />,
      label: 'Rate Us',
      description: 'Share your feedback with us',
      to: '/rate',
      isLink: true,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backdropFilter: isOpen ? 'blur(6px)' : 'none', background: 'rgba(0,0,0,0.25)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-96 bg-white z-[60] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ borderLeft: '1px solid rgba(167,243,208,0.4)' }}
      >

        <div className="flex items-center justify-between px-8 py-6 border-b border-emerald-100">
          <div>
            <h2 className="text-xl font-bold text-emerald-900">Settings</h2>
            <p className="text-sm text-slate-400 mt-0.5">Manage your account</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>



        <div className="flex-1 px-5 py-5 space-y-2 overflow-y-auto">
          {menuItems.map((item) =>
            item.isLink ? (
              <Link
                key={item.label}
                to={item.to}
                onClick={onClose}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-emerald-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-slate-800">{item.label}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={() => { item.onClick?.(); onClose(); }}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-emerald-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-base font-semibold text-slate-800">{item.label}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
              </button>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-emerald-50">
          <p className="text-sm text-slate-300 text-center">EcoBerg · v1.0</p>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;