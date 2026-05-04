import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: '关于天穆', path: '/about' },
    { name: '展览前言', path: '/foreword' },
    { name: '漫步展厅', path: '/hall' },
    { name: '浏览展品', path: '/collection' },
    { name: '策展团队', path: '/team' },
  ];

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { name: '首页', path: '/' },
    ...pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const name = segment === 'hall' ? '漫步展厅' : 
                   segment === 'collection' ? '浏览展品' : 
                   segment === 'foreword' ? '展览前言' : 
                   segment === 'about' ? '关于天穆' : 
                   segment === 'team' ? '策展团队' : segment;
      return { name, path };
    }),
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-bg text-brand-primary font-serif selection:bg-brand-accent/20">
      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex w-72 h-screen sticky top-0 border-r border-brand-primary/[0.03] p-12 flex-col justify-between shrink-0 bg-[#f9f8f3] relative overflow-hidden">
        {/* Sidebar Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.05] grayscale pointer-events-none"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1541812169650-66336ba74b12?q=80&w=1200")',
            backgroundSize: 'cover',
            backgroundPosition: 'left center'
          }}
        />
        
        <div className="relative z-10 pt-0 ml-[-9px] pl-[-26px] mt-0 mr-0">
          <Link to="/" className="block mb-24 group relative text-center">
            <div className="text-[28px] font-bold tracking-[0.1em] text-brand-primary group-hover:text-brand-accent transition-colors duration-500">天穆六百年</div>
            <div className="text-[14px] text-brand-muted font-sans tracking-[0.3em] mt-3 font-bold uppercase">Digital Museum</div>
          </Link>

          <div className="flex flex-col space-y-7 text-[17px]">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-bold tracking-[0.25em] uppercase text-center transition-all duration-500 hover:text-brand-accent ${location.pathname.startsWith(item.path) ? 'text-brand-accent' : 'text-brand-muted'}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative z-10 space-y-6 flex flex-col items-center text-center">
          <div className="h-px w-8 bg-brand-accent"></div>
          <div className="text-[10px] text-brand-muted/60 font-sans tracking-[0.25em] leading-relaxed uppercase font-bold">
            © 2026 TIANMU MUSEUM<br />
            ARCHIVE PROJECT
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Header */}
      <header className="md:hidden sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-md border-b border-brand-primary/[0.02] h-16 flex items-center justify-between px-6">
        <Link to="/" className="text-lg font-bold tracking-widest text-brand-primary">天穆六百年</Link>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-primary/5 transition-colors"
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-brand-bg p-12 flex flex-col justify-center items-center text-center space-y-12"
          >
            {navItems.map((item, idx) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-2xl font-serif tracking-[0.2em] ${location.pathname.startsWith(item.path) ? 'text-brand-accent' : 'text-brand-primary'}`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => setIsMenuOpen(false)}
              className="mt-12 w-12 h-12 rounded-full border border-brand-primary/10 flex items-center justify-center text-brand-primary"
            >
              <X size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen flex flex-col relative overflow-hidden paper-texture">
        {/* Breadcrumb System */}
        <div className="px-6 md:px-12 lg:px-20 flex h-12 md:h-[60px] items-center border-b border-brand-primary/[0.02] overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-max">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center group">
                {index > 0 && <span className="mx-2 md:mx-4 text-brand-accent/20 text-[8px] md:text-[9px] font-sans">/</span>}
                <Link 
                  to={crumb.path} 
                  className={`transition-all duration-500 text-[11px] md:text-[13px] uppercase tracking-[0.2em] md:tracking-[0.25em] font-sans font-bold ${index === breadcrumbs.length - 1 ? 'opacity-100 text-brand-accent' : 'text-brand-muted hover:opacity-100 hover:text-brand-accent'}`}
                >
                  {crumb.name}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <div key={location.pathname} className="px-5 md:px-12 lg:px-20 pb-12 md:pb-16 pt-8 md:pt-16 flex-1 flex flex-col">
            {children}
          </div>
        </AnimatePresence>
      </main>
    </div>
  );
}
