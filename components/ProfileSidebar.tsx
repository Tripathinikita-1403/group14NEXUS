
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Aspirant } from '../types';
import { View } from '../types';
import { ChevronRightIcon, ChevronLeftIcon, TrophyIcon, TargetIcon, ShieldIcon } from './icons';

interface ProfileSidebarProps {
    aspirant: Aspirant;
    xpGain: number | null;
    currentView: View;
    onNavigateToDashboard: () => void;
    onResetProfile: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ aspirant, xpGain, currentView, onNavigateToDashboard, onResetProfile }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const xpPercentage = (aspirant.xp / aspirant.xpToNextLevel) * 100;

    return (
        <motion.aside 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed top-0 left-0 h-full z-50 transition-all duration-500 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'} hidden md:flex flex-col justify-center p-4`}
        >
            {/* HUD Container */}
            <div className={`hud-card h-full relative flex flex-col transition-all duration-300 bg-slate-900/90 ${isCollapsed ? 'w-full px-2' : 'w-full'}`}>
                
                {/* Toggle Button */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-slate-900 border border-cyan-500 text-cyan-500 p-1 clip-corner z-20 hover:bg-cyan-500 hover:text-black transition-colors shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                >
                    {isCollapsed ? <ChevronRightIcon className="w-4 h-4"/> : <ChevronLeftIcon className="w-4 h-4"/>}
                </button>

                <AnimatePresence mode="wait">
                    {!isCollapsed ? (
                        <motion.div 
                            key="expanded"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col h-full p-5 relative overflow-hidden"
                        >
                            
                            {/* Profile Header */}
                            <div className="flex flex-col items-center text-center mb-6 relative">
                                 <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-500"></div>
                                 <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500"></div>

                                <div className="w-20 h-20 mb-3 relative">
                                    <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 p-1">
                                        <img src={aspirant.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full bg-slate-800"/>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-yellow-500 rounded-full p-1 shadow-lg">
                                        <TrophyIcon className="w-3 h-3 text-yellow-500" />
                                    </div>
                                </div>
                                
                                <h2 className="font-display font-bold text-white text-lg tracking-wide uppercase truncate w-full">{aspirant.name}</h2>
                                <div className="text-cyan-400 text-[9px] font-mono tracking-[0.3em] uppercase mt-1">Status: Active</div>
                            </div>

                            {/* Rank & Level */}
                            <div className="mb-6 relative">
                                 <AnimatePresence>
                                    {xpGain && (
                                        <motion.div 
                                            initial={{ y: 0, opacity: 0, scale: 0.5 }}
                                            animate={{ y: -40, opacity: 1, scale: 1 }}
                                            exit={{ y: -60, opacity: 0 }}
                                            className="absolute left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-black px-3 py-1 rounded-sm text-xs shadow-[0_0_20px_rgba(250,204,21,0.8)] whitespace-nowrap z-30 font-mono tracking-widest clip-corner"
                                        >
                                            +{xpGain} XP
                                        </motion.div>
                                    )}
                                 </AnimatePresence>

                                <div className="flex justify-between items-end mb-1 px-1">
                                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Clearance Level</span>
                                    <span className="text-xl font-bold text-cyan-400 font-display leading-none">{aspirant.level}</span>
                                </div>
                                
                                {/* Animated Progress Bar */}
                                <div className="w-full h-2 bg-slate-800 border border-slate-600 skew-x-[-10deg] overflow-hidden relative">
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,243,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${xpPercentage}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" 
                                    ></motion.div>
                                </div>
                                <div className="mt-1 text-[8px] text-right text-cyan-500/60 font-mono tracking-widest">{aspirant.xp} / {aspirant.xpToNextLevel} XP REQUIRED</div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-2 mb-6">
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-slate-800/50 p-2 clip-corner border border-white/5 text-center group hover:border-cyan-500/50 transition-colors"
                                >
                                    <TargetIcon className="w-4 h-4 text-slate-500 mx-auto mb-1 group-hover:text-cyan-400 transition-colors"/>
                                    <div className="text-base font-bold text-white font-mono">87%</div>
                                    <div className="text-[7px] text-slate-400 uppercase tracking-widest">Accuracy</div>
                                </motion.div>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-slate-800/50 p-2 clip-corner border border-white/5 text-center group hover:border-cyan-500/50 transition-colors"
                                >
                                    <ShieldIcon className="w-4 h-4 text-slate-500 mx-auto mb-1 group-hover:text-cyan-400 transition-colors"/>
                                    <div className="text-base font-bold text-white font-mono">14</div>
                                    <div className="text-[7px] text-slate-400 uppercase tracking-widest">Missions</div>
                                </motion.div>
                            </div>

                            {/* Badges / Medals */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <p className="text-[9px] text-cyan-500 font-bold uppercase tracking-[0.2em] mb-3 border-b border-white/10 pb-2">Recent Honors</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {aspirant.badges.map((badge, i) => (
                                        <motion.div 
                                            key={i} 
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            className="aspect-square bg-slate-800/50 clip-corner border border-white/5 flex items-center justify-center text-cyan-400 hover:bg-cyan-900/30 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all group cursor-help relative" title={badge.name}
                                        >
                                            {React.cloneElement(badge.icon as React.ReactElement<any>, { className: 'w-5 h-5 group-hover:scale-110 transition-transform' })}
                                        </motion.div>
                                    ))}
                                    {[...Array(Math.max(0, 6 - aspirant.badges.length))].map((_, i) => (
                                        <div key={`empty-${i}`} className="aspect-square bg-slate-900/20 clip-corner border border-white/5 flex items-center justify-center opacity-20">
                                            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dashboard Link */}
                            <div className="mt-auto pt-4 space-y-2">
                                <motion.button 
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(6, 182, 212, 0.1)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onNavigateToDashboard} 
                                    className="w-full py-2 border border-slate-600 text-slate-400 font-mono text-[10px] uppercase tracking-widest hover:border-cyan-400 hover:text-cyan-300 transition-all clip-corner"
                                >
                                    :: Return to Nexus
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onResetProfile} 
                                    className="w-full py-2 border border-red-900/30 text-red-500/50 font-mono text-[8px] uppercase tracking-widest hover:border-red-500 hover:text-red-400 transition-all clip-corner"
                                >
                                    :: Reset Profile
                                </motion.button>
                            </div>

                        </motion.div>
                    ) : (
                        <motion.div 
                            key="collapsed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center py-6 h-full gap-6"
                        >
                             <motion.div 
                                whileHover={{ scale: 1.2 }}
                                className="w-10 h-10 rounded-full border border-cyan-500/50 overflow-hidden p-0.5" title={aspirant.name}
                             >
                                <img src={aspirant.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full"/>
                             </motion.div>
                             <div className="h-32 w-1 bg-slate-800 rounded-full relative overflow-hidden">
                                 <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${xpPercentage}%` }}
                                    transition={{ duration: 1.5 }}
                                    className="absolute bottom-0 left-0 w-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                                 ></motion.div>
                             </div>
                             <div className="text-[10px] font-bold text-cyan-500 font-display rotate-180 tracking-widest whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
                                LVL {aspirant.level}
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.aside>
    );
};

export default ProfileSidebar;
