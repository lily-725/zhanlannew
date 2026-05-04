import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { about } from '../content';
import { FADE_IN_VARIANTS } from '../constants';

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const bgY = useTransform(scrollYProgress, [0, 1], [-150, 150]);

  return (
    <div ref={containerRef} className="max-w-[999px] mx-auto relative">
      <motion.div 
        style={{ y: bgY }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 text-[30rem] font-bold text-brand-accent/[0.03] select-none -z-10 font-serif leading-none"
      >
        穆
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0}
        variants={FADE_IN_VARIANTS}
        className="relative z-10"
      >
        <div className="text-meta mb-6">Introduction</div>
        <h1 className="text-5xl font-serif mb-16 leading-tight">关于天穆</h1>
        <div className="aspect-[21/9] bg-brand-soft-grey mb-20 overflow-hidden shadow-sm group">
           <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1200" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Tianmu View" />
        </div>
        <div className="markdown-body text-secondary">
          {about.paragraphs.map((p, idx) => (
            <p key={idx} className="text-xl leading-relaxed font-light text-justify-zh indent-[2em]">
              {p}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default About;
