
import React, { useState, useRef, useEffect } from 'react';
import { UserContext } from '../types';
import { UsersIcon, MessageSquareIcon, BotIcon, TrophyIcon, BriefcaseIcon, ShieldIcon, ChevronLeftIcon, RadioIcon, SendIcon } from './icons';
import { Calendar as CalendarIcon, Clock as ClockIcon, CheckCircle2 as CheckCircleIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getMentorResponseStream } from '../services/geminiService';

interface Mentor {
    id: string;
    name: string;
    role: string;
    expertise: string[];
    avatar: string;
    status: 'online' | 'offline' | 'busy';
    bio: string;
    categories: ('SCHOOL' | 'COLLEGE' | 'COMPETITIVE')[];
}

const MENTORS: Mentor[] = [
    {
        id: 'm1',
        name: 'Col. Vikram Rathore',
        role: 'Defence Strategist',
        expertise: ['SSB Preparation', 'Leadership', 'Tactical Planning'],
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Vikram&backgroundColor=b6e3f4',
        status: 'online',
        bio: 'Retired Colonel with 20 years of experience in SSB selection boards. Expert in psychological assessment and GTO tasks.',
        categories: ['COMPETITIVE']
    },
    {
        id: 'm2',
        name: 'Dr. Ananya Sharma',
        role: 'UPSC Ethics Specialist',
        expertise: ['Ethics (GS IV)', 'Essay Writing', 'Interview Prep'],
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ananya&backgroundColor=ffdfbf',
        status: 'online',
        bio: 'Former IAS officer and renowned faculty for Ethics and Integrity. Guided over 500 successful UPSC aspirants.',
        categories: ['COMPETITIVE']
    },
    {
        id: 'm3',
        name: 'Maj. Gen. S.K. Singh',
        role: 'Military Leadership Mentor',
        expertise: ['CDS Strategy', 'NDA Foundations', 'Personality Development'],
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=SK&backgroundColor=c0aede',
        status: 'busy',
        bio: 'Expert in military history and strategic studies. Focuses on building the "Officer Like Qualities" in young aspirants.',
        categories: ['COMPETITIVE']
    },
    {
        id: 'm5',
        name: 'Prof. Rajesh Khanna',
        role: 'Academic Counselor',
        expertise: ['Career Guidance', 'Stream Selection', 'Study Techniques'],
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Rajesh&backgroundColor=d1d4f9',
        status: 'online',
        bio: 'Senior academician with 25 years in student counseling. Helps school students choose the right path after 10th and 12th.',
        categories: ['SCHOOL']
    },
    {
        id: 'm6',
        name: 'Ms. Priya Iyer',
        role: 'Foundation Mentor',
        expertise: ['CBSE/ICSE Boards', 'NTSE Prep', 'Olympiads'],
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya&backgroundColor=f1f4f9',
        status: 'online',
        bio: 'Specializes in building strong foundations for competitive exams right from school level. Expert in board exam strategies.',
        categories: ['SCHOOL']
    },
    {
        id: 'm7',
        name: 'Dr. Sameer Verma',
        role: 'Higher Education Guide',
        expertise: ['B.Tech Strategy', 'GATE/CAT Prep', 'Placement Training'],
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sameer&backgroundColor=ffd5dc',
        status: 'online',
        bio: 'Professor at a leading technical institute. Guides college students through their degree while preparing for higher studies or placements.',
        categories: ['COLLEGE']
    },
    {
        id: 'm8',
        name: 'Adv. Meera Deshmukh',
        role: 'Legal Career Mentor',
        expertise: ['CLAT Prep', 'Judiciary Exams', 'Legal Research'],
        avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Meera&backgroundColor=c0aede',
        status: 'busy',
        bio: 'Practicing advocate and legal educator. Mentors law students and aspirants for judicial services and top law firms.',
        categories: ['COLLEGE']
    },
    {
        id: 'm4',
        name: 'Strategos AI',
        role: 'Neural Learning System',
        expertise: ['All Subjects', 'Data Analysis', '24/7 Support'],
        avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=Strategos&backgroundColor=b6e3f4',
        status: 'online',
        bio: 'Your primary neural interface. Strategos uses advanced algorithms to provide instant doubt resolution and personalized study plans.',
        categories: ['SCHOOL', 'COLLEGE', 'COMPETITIVE']
    }
];

interface MentorshipHubProps {
    context: UserContext;
    onBack: () => void;
}

const MentorshipHub: React.FC<MentorshipHubProps> = ({ context, onBack }) => {
    const filteredMentors = MENTORS.filter(m => m.categories.includes(context.category));
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [chatMode, setChatMode] = useState(false);
    const [schedulingMode, setSchedulingMode] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [isScheduled, setIsScheduled] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{role: 'user' | 'mentor', text: string}[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory]);

    const handleConnect = (mentor: Mentor) => {
        setSelectedMentor(mentor);
        setChatMode(false);
        setSchedulingMode(false);
        setIsScheduled(false);
    };

    const startChat = () => {
        setChatMode(true);
        setSchedulingMode(false);
        if (chatHistory.length === 0 && selectedMentor) {
            setChatHistory([{ role: 'mentor', text: `Greetings, Aspirant. I am ${selectedMentor.name}. How can I assist your quest for excellence today?` }]);
        }
    };

    const startScheduling = () => {
        setSchedulingMode(true);
        setChatMode(false);
        setIsScheduled(false);
    };

    const handleSchedule = () => {
        if (!selectedDate || !selectedTime) return;
        setIsScheduled(true);
        // In a real app, we would save this to a database
    };

    const sendMessage = async () => {
        if (!message.trim() || !selectedMentor) return;
        
        const userMsg = message;
        setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setMessage('');
        setIsTyping(true);
        
        try {
            const history = chatHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' as const : 'model' as const,
                parts: [{ text: msg.text }]
            }));

            const mentorMsgId = Date.now().toString();
            setChatHistory(prev => [...prev, { role: 'mentor', text: '', id: mentorMsgId } as any]);

            let fullResponse = '';
            const stream = getMentorResponseStream(history, userMsg, context, {
                name: selectedMentor.name,
                role: selectedMentor.role,
                bio: selectedMentor.bio
            });

            for await (const chunk of stream) {
                fullResponse += chunk;
                setChatHistory(prev => prev.map((msg, idx) => 
                    (idx === prev.length - 1 && msg.role === 'mentor') ? { ...msg, text: fullResponse } : msg
                ));
            }
        } catch (error) {
            console.error("Mentor chat error:", error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="h-full flex flex-col pt-8 px-4 max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center mb-10">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors font-mono text-xs uppercase tracking-widest group">
                    <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Nexus
                </button>
                <div className="flex items-center gap-4">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.3em]">Mentorship Uplink: Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow overflow-hidden pb-10">
                {/* Mentor List */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar"
                >
                    <h2 className="text-xl font-bold text-white font-display uppercase tracking-widest mb-2 flex items-center gap-3">
                        <UsersIcon className="w-5 h-5 text-cyan-400" /> Elite Mentors
                    </h2>
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1
                                }
                            }
                        }}
                        className="flex flex-col gap-4"
                    >
                        {filteredMentors.map(mentor => (
                            <motion.button 
                                key={mentor.id}
                                variants={{
                                    hidden: { opacity: 0, x: -20 },
                                    visible: { opacity: 1, x: 0 }
                                }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleConnect(mentor)}
                                className={`p-4 text-left border clip-corner transition-all group ${
                                    selectedMentor?.id === mentor.id 
                                    ? 'bg-cyan-900/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                                    : 'bg-slate-900/40 border-slate-700 hover:border-slate-500'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 rounded-full bg-slate-800 border border-white/10" />
                                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                                            mentor.status === 'online' ? 'bg-green-500' : mentor.status === 'busy' ? 'bg-yellow-500' : 'bg-slate-500'
                                        }`}></div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors uppercase tracking-wider">{mentor.name}</h3>
                                        <p className="text-[10px] text-cyan-500/70 font-mono uppercase tracking-widest">{mentor.role}</p>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Mentor Detail / Chat Area */}
                <div className="lg:col-span-2 flex flex-col h-full">
                    <AnimatePresence mode="wait">
                        {!selectedMentor ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex-grow flex flex-col items-center justify-center text-center p-10 hud-card border-slate-800 bg-slate-900/20"
                            >
                                <MessageSquareIcon className="w-16 h-16 text-slate-700 mb-6 animate-pulse" />
                                <h3 className="text-2xl font-bold text-slate-500 font-display uppercase tracking-widest mb-4">Select a Mentor</h3>
                                <p className="text-slate-600 font-mono text-xs max-w-xs uppercase tracking-wider leading-relaxed">
                                    Establish a secure neural link with an elite mentor to receive strategic guidance and tactical insights.
                                </p>
                            </motion.div>
                        ) : chatMode ? (
                            <motion.div 
                                key="chat"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="flex-grow flex flex-col hud-card border-cyan-500/30 bg-slate-950/50 overflow-hidden"
                            >
                                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-cyan-900/10">
                                    <div className="flex items-center gap-3">
                                        <img src={selectedMentor.avatar} alt="" className="w-8 h-8 rounded-full border border-cyan-500/30" />
                                        <div>
                                            <h3 className="text-xs font-bold text-white uppercase tracking-widest">{selectedMentor.name}</h3>
                                            <p className="text-[8px] text-cyan-400 font-mono uppercase tracking-[0.2em]">Encrypted Session Active</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setChatMode(false)} className="text-[10px] font-mono text-slate-500 hover:text-white uppercase tracking-widest">Close Link</button>
                                </div>
                                
                                <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                    {chatHistory.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-4 clip-corner-sm text-sm ${
                                                msg.role === 'user' 
                                                ? 'bg-cyan-900/30 border border-cyan-500/30 text-white' 
                                                : 'bg-slate-900/80 border border-white/5 text-slate-300'
                                            }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-slate-900/80 border border-white/5 p-4 clip-corner-sm">
                                                <div className="flex gap-1">
                                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                <div className="p-4 border-t border-white/10 bg-black/40">
                                    <div className="flex gap-3">
                                        <input 
                                            type="text" 
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                            placeholder="Transmit message..."
                                            className="flex-grow bg-slate-900 border border-slate-700 focus:border-cyan-500 text-white px-4 py-2 text-sm outline-none clip-corner-sm font-mono"
                                        />
                                        <button onClick={sendMessage} className="p-2 bg-cyan-600 hover:bg-cyan-500 text-black clip-corner-sm transition-colors">
                                            <SendIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : schedulingMode ? (
                            <motion.div 
                                key="scheduling"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="flex-grow flex flex-col hud-card border-cyan-500/30 bg-slate-950/50 overflow-hidden p-8"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                                            <CalendarIcon className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Mission Briefing Scheduler</h3>
                                            <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-[0.2em]">Mentor: {selectedMentor.name}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSchedulingMode(false)} className="text-[10px] font-mono text-slate-500 hover:text-white uppercase tracking-widest">Cancel</button>
                                </div>

                                {isScheduled ? (
                                    <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-20 h-20 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center"
                                        >
                                            <CheckCircleIcon className="w-10 h-10 text-green-400" />
                                        </motion.div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Briefing Confirmed</h4>
                                            <p className="text-slate-400 font-mono text-xs uppercase tracking-wider">
                                                Your session with {selectedMentor.name} is locked for:
                                            </p>
                                            <div className="mt-4 p-4 bg-slate-900/50 border border-white/5 rounded-lg inline-block">
                                                <p className="text-cyan-400 font-bold font-mono uppercase tracking-widest">
                                                    {selectedDate} @ {selectedTime}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setSchedulingMode(false)}
                                            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-widest text-[10px] clip-corner border border-white/10 transition-all"
                                        >
                                            Return to Profile
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">Select Date</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {['2026-03-27', '2026-03-28', '2026-03-29', '2026-03-30', '2026-03-31', '2026-04-01'].map(date => (
                                                        <button
                                                            key={date}
                                                            onClick={() => setSelectedDate(date)}
                                                            className={`p-3 text-[10px] font-mono clip-corner-sm border transition-all ${
                                                                selectedDate === date 
                                                                ? 'bg-cyan-500/20 border-cyan-500 text-white' 
                                                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                                                            }`}
                                                        >
                                                            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">Select Time (IST)</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM', '08:30 PM'].map(time => (
                                                        <button
                                                            key={time}
                                                            onClick={() => setSelectedTime(time)}
                                                            className={`p-3 text-[10px] font-mono clip-corner-sm border transition-all flex items-center justify-center gap-2 ${
                                                                selectedTime === time 
                                                                ? 'bg-cyan-500/20 border-cyan-500 text-white' 
                                                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                                                            }`}
                                                        >
                                                            <ClockIcon className="w-3 h-3" /> {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-lg">
                                            <p className="text-[10px] text-slate-400 font-mono leading-relaxed uppercase tracking-wider">
                                                <span className="text-cyan-400 font-bold">Note:</span> Briefings are conducted via secure neural uplink. Ensure your interface is calibrated 5 minutes prior to the scheduled time.
                                            </p>
                                        </div>

                                        <button 
                                            disabled={!selectedDate || !selectedTime}
                                            onClick={handleSchedule}
                                            className={`w-full py-4 font-bold uppercase tracking-[0.3em] text-xs clip-corner transition-all ${
                                                selectedDate && selectedTime
                                                ? 'bg-cyan-600 hover:bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            }`}
                                        >
                                            Confirm Strategic Briefing
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="detail"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="flex-grow flex flex-col hud-card border-slate-700 bg-slate-900/30 p-8 overflow-y-auto custom-scrollbar"
                            >
                                <div className="flex flex-col md:flex-row gap-8 mb-10">
                                    <div className="flex-shrink-0">
                                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 p-2">
                                            <img src={selectedMentor.avatar} alt="" className="w-full h-full rounded-xl object-cover" />
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h2 className="text-3xl font-bold text-white font-display uppercase tracking-widest mb-1">{selectedMentor.name}</h2>
                                                <p className="text-cyan-400 font-mono text-xs uppercase tracking-[0.3em]">{selectedMentor.role}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {selectedMentor.status === 'online' && (
                                                    <span className="px-3 py-1 bg-green-900/20 border border-green-500/50 text-green-400 text-[10px] font-mono uppercase tracking-widest rounded-full">Available</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-6 font-mono uppercase tracking-wide">
                                            {selectedMentor.bio}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedMentor.expertise.map(exp => (
                                                <span key={exp} className="px-3 py-1 bg-slate-800 border border-white/5 text-slate-300 text-[9px] font-mono uppercase tracking-widest rounded-md">
                                                    {exp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
                                    <button 
                                        onClick={startChat}
                                        className="flex items-center justify-center gap-3 py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-[0.2em] text-xs clip-corner transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                    >
                                        <MessageSquareIcon className="w-4 h-4" /> Initialize Uplink
                                    </button>
                                    <button 
                                        onClick={startScheduling}
                                        className="flex items-center justify-center gap-3 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-[0.2em] text-xs clip-corner border border-white/10 transition-all"
                                    >
                                        <RadioIcon className="w-4 h-4" /> Schedule Briefing
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MentorshipHub;
