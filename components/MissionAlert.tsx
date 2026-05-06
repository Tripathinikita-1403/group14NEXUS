
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RadioIcon, TargetIcon, XIcon, ChevronRightIcon } from './icons';

interface MissionAlertProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    missionData: {
        title: string;
        description: string;
        xpReward: number;
    } | null;
}

const MissionAlert: React.FC<MissionAlertProps> = ({ isOpen, onClose, onAccept, missionData }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ y: 100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="fixed bottom-8 right-8 z-[60] w-96"
                >
                    <div className="bg-slate-900/90 border border-red-500/50 backdrop-blur-xl clip-corner shadow-[0_0_30px_rgba(239,68,68,0.2)] overflow-hidden relative">
                        
                        {/* Header Scanner Effect */}
                        <motion.div 
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute top-0 left-0 w-full h-1 bg-red-500"
                        ></motion.div>
                        
                        <div className="p-4 flex items-start gap-4">
                            <div className="relative">
                                <motion.div 
                                    animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-12 h-12 bg-red-900/30 border border-red-500 rounded-full flex items-center justify-center"
                                >
                                    <RadioIcon className="w-6 h-6 text-red-500" />
                                </motion.div>
                                <motion.div 
                                    animate={{ scale: [1, 2], opacity: [1, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                                ></motion.div>
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-red-400 font-bold font-display tracking-widest text-sm uppercase mb-1">Incoming Transmission</h3>
                                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                <h4 className="text-white font-bold text-lg leading-tight mb-2 font-display">{missionData?.title}</h4>
                                <p className="text-gray-400 text-xs font-mono mb-4 leading-relaxed uppercase tracking-wide">
                                    {missionData?.description}
                                </p>

                                <div className="flex items-center gap-2">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onAccept}
                                        className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 px-3 clip-corner-sm transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <span>ENGAGE</span>
                                        <span className="bg-black/30 px-1.5 py-0.5 rounded text-[10px] text-red-200">+{missionData?.xpReward} XP</span>
                                        <ChevronRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onClose}
                                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 px-3 clip-corner-sm transition-all border border-slate-600"
                                    >
                                        DISMISS
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute bottom-1 right-1 text-[8px] text-red-900 font-mono tracking-widest">PRIORITY_ALPHA</div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-red-500"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-red-500"></div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MissionAlert;
