
import React from 'react';
import { motion } from 'motion/react';

interface AIAssistantProps {
    className?: string;
    isTyping?: boolean;
    message?: string | null;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ className = '', isTyping = false, message = null }) => {
    return (
        <div className={`relative ${className}`}>
            {/* Speech Bubble */}
            {message && (
                <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 bg-cyan-900/80 border border-cyan-400/50 p-2 rounded-lg text-[10px] text-cyan-100 font-mono-tech leading-tight shadow-[0_0_15px_rgba(6,182,212,0.3)] z-50"
                >
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-900 border-r border-b border-cyan-400/50 rotate-45"></div>
                    {message}
                </motion.div>
            )}
            
            {/* Holographic Base */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-cyan-500/20 blur-xl rounded-full"
            ></motion.div>
            
            {/* The Character (SVG Stylized AI Girl) */}
            <motion.svg 
                viewBox="0 0 200 200" 
                animate={isTyping ? {
                    y: [0, -10, 0],
                    scale: [1, 1.05, 1]
                } : {
                    y: [0, -15, 0]
                }}
                transition={{
                    duration: isTyping ? 0.5 : 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            >
                <defs>
                    <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e0f2fe" />
                        <stop offset="100%" stopColor="#7dd3fc" />
                    </linearGradient>
                    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e1b4b" />
                        <stop offset="100%" stopColor="#4338ca" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                
                {/* Body/Suit */}
                <path d="M60,180 Q100,160 140,180 L150,200 L50,200 Z" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                <path d="M70,175 Q100,165 130,175 L135,190 L65,190 Z" fill="#1e293b" />
                
                {/* Neck */}
                <rect x="92" y="145" width="16" height="15" fill="url(#skinGrad)" />
                
                {/* Face Shape */}
                <path d="M70,80 Q70,150 100,150 Q130,150 130,80 Q130,40 100,40 Q70,40 70,80" fill="url(#skinGrad)" filter="url(#glow)" />
                
                {/* Eyes */}
                <motion.g 
                    animate={isTyping ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                >
                    <circle cx="85" cy="95" r="4" fill="#0f172a" />
                    <circle cx="115" cy="95" r="4" fill="#0f172a" />
                    <path d="M82,92 Q85,88 88,92" fill="none" stroke="#06b6d4" strokeWidth="1" />
                    <path d="M112,92 Q115,88 118,92" fill="none" stroke="#06b6d4" strokeWidth="1" />
                </motion.g>
                
                {/* Mouth */}
                <motion.path 
                    d="M90,125 Q100,135 110,125" 
                    fill="none" 
                    stroke="#0f172a" 
                    strokeWidth="2" 
                    animate={isTyping ? { scaleY: [1, 1.5, 1], y: [0, 2, 0] } : {}}
                    transition={{ duration: 0.4, repeat: Infinity }}
                />
                
                {/* Hair */}
                <path d="M65,80 Q65,30 100,30 Q135,30 135,80 L145,130 Q145,150 130,140 L120,100 Q100,90 80,100 L70,140 Q55,150 55,130 Z" fill="url(#hairGrad)" />
                
                {/* Neural Headset */}
                <motion.path 
                    d="M70,80 Q100,70 130,80" 
                    fill="none" 
                    stroke="#06b6d4" 
                    strokeWidth="3" 
                    strokeDasharray="4 2" 
                    animate={{ strokeDashoffset: [0, 12] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle 
                    cx="70" cy="80" r="5" fill="#06b6d4" 
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle 
                    cx="130" cy="80" r="5" fill="#06b6d4" 
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                
                {/* Floating Data Bits */}
                <motion.rect 
                    x="40" y="60" width="4" height="4" fill="#06b6d4" 
                    animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.rect 
                    x="160" y="100" width="4" height="4" fill="#06b6d4" 
                    animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
                />
                <motion.rect 
                    x="150" y="40" width="4" height="4" fill="#06b6d4" 
                    animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                />
            </motion.svg>
        </div>
    );
};

export default AIAssistant;
