
import React, { useState, useEffect, useRef } from 'react';
import { UserContext } from '../types';
import { AtomIcon, BriefcaseIcon, ChevronLeftIcon, RadioIcon, MessageSquareIcon, SendIcon, ShieldIcon, BotIcon, UsersIcon } from './icons';
import { getSimulationStream } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface VirtualLabProps {
    context: UserContext;
    addXp: (amount: number) => void;
    onBack: () => void;
    labId: string | null;
    trackProgress: (type: 'topic' | 'task' | 'sim' | 'combat' | 'essay', id?: string) => void;
}

const VirtualLab: React.FC<VirtualLabProps> = ({ context, addXp, onBack, labId, trackProgress }) => {
    const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [systemLogs, setSystemLogs] = useState<string[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const addLog = (log: string) => {
        setSystemLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
    };

    const clearChat = () => {
        setMessages([{ role: 'model', text: "Simulation reset. How can I assist your research today?" }]);
        addLog("Neural link reset. Memory buffers cleared.");
    };

    const clearLogs = () => {
        setSystemLogs([]);
    };

    const downloadLogs = () => {
        const logContent = systemLogs.join('\n');
        const blob = new Blob([logContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `simulation_log_${labId || 'generic'}_${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addLog("Simulation logs exported.");
    };

    const isPharma = context.detail === 'BPHARMA';
    const isHM = context.detail === 'HM';
    const isNEET = context.detail === 'NEET';
    const isJEE = context.detail === 'JEE';
    const isSSB = context.detail === 'SSB';
    const isNDA = context.detail === 'NDA';
    const isCDS = context.detail === 'CDS';
    const isUPSC = context.detail === 'UPSC';

    useEffect(() => {
        let intro = "Welcome to the Virtual Simulation Lab. How can I assist your research today?";
        
        if (isPharma) {
            intro = "Welcome to the Virtual Pharma Lab. I am your Lead Researcher. We are currently analyzing drug synthesis pathways and molecular interactions. What would you like to simulate today? (e.g., 'Simulate the synthesis of Paracetamol' or 'Analyze drug-receptor binding')";
        } else if (isHM) {
            intro = "Welcome to the Virtual Hospitality Lab. I am your Executive Mentor. We are focusing on culinary precision, kitchen management, and elite guest relations. What shall we prepare or manage today? (e.g., 'Simulate a high-pressure dinner service' or 'Manage a front-office crisis')";
        } else if (isNEET) {
            intro = "Welcome to the NEET Virtual Lab. I am your Biology & Chemistry Mentor. We are focusing on anatomical structures, physiological processes, and chemical reactions. What shall we simulate today? (e.g., 'Simulate the human circulatory system' or 'Analyze the mechanism of enzyme action')";
        } else if (isJEE) {
            intro = "Welcome to the JEE Advanced Simulation Lab. I am your Physics & Chemistry Lead. We are focusing on complex mechanics, electrodynamics, and advanced chemical bonding. What shall we simulate today? (e.g., 'Simulate a projectile motion with air resistance' or 'Analyze the thermodynamics of a heat engine')";
        } else if (isSSB) {
            intro = "Welcome to the SSB Psychological Simulation. I am your Assessment Officer. We are focusing on WAT, TAT, and SRT scenarios. What shall we practice today? (e.g., 'Simulate a TAT scenario' or 'Practice Word Association Test')";
        } else if (isNDA || isCDS) {
            intro = `Welcome to the ${context.detail} Strategic Simulation. I am your Commanding Officer. We are focusing on tactical planning, defence strategies, and leadership scenarios. What shall we simulate today? (e.g., 'Simulate a tactical field operation' or 'Analyze a historical battle strategy')`;
        } else if (isUPSC) {
            if (labId === 'upsc_ethics_sim') {
                intro = "Welcome to the UPSC Ethics Simulation. I am your Ethics Mentor. We will explore complex moral dilemmas and the application of ethical principles in public service. What scenario shall we analyze today?";
            } else if (labId === 'upsc_gov_lab') {
                intro = "Welcome to the UPSC Governance Lab. I am your Administrative Mentor. We are focusing on policy implementation, district administration, and governance challenges. What shall we simulate today?";
            } else if (labId === 'policy_matrix') {
                intro = "Welcome to the Policy & Governance Matrix. I am your Policy Advisor. We are simulating scenario-based policy-making and its socio-economic impacts. What policy area shall we explore?";
            } else if (labId === 'logic_grid') {
                intro = "Welcome to the Logic & Reasoning Grid. I am your Aptitude Coach. We are focusing on puzzle-based challenges and logical reasoning for CSAT. What type of puzzle shall we solve?";
            } else {
                intro = "Welcome to the UPSC Virtual Lab. I am your Administrative Mentor. How can I assist your UPSC preparation today?";
            }
        }
        
        setMessages([{ role: 'model', text: intro }]);
        addLog(`Simulation initialized: ${labId || 'Generic Lab'}`);
        addLog("Neural link established.");
    }, [isPharma, isHM, isNEET, isJEE, isSSB, isNDA, isCDS, isUPSC, labId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isThinking) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsThinking(true);
        addLog(`Command received: ${userMsg.slice(0, 20)}${userMsg.length > 20 ? '...' : ''}`);
        addXp(15);

        try {
            const systemInstruction = isPharma 
                ? "You are a Lead Researcher in a Pharmaceutical Lab. You are guiding a B.Pharma student. Provide detailed, scientific simulations of drug synthesis, chemical reactions, pharmacology, and medicinal chemistry. Use technical terms but explain them if needed. Keep responses concise, interactive, and technically accurate."
                : isHM
                ? "You are an Executive Hospitality Mentor in a 5-star hotel. You are guiding a Hotel Management student. Provide detailed simulations of kitchen operations, culinary techniques, front-office management, and guest relations. Be professional, demanding but helpful. Keep responses concise, interactive, and industry-standard."
                : isNEET
                ? "You are a NEET Mentor specializing in Biology and Chemistry. Provide detailed simulations of anatomical structures, physiological processes, and chemical reactions relevant to the NEET syllabus. Use NCERT-aligned terminology. Keep responses concise and interactive."
                : isJEE
                ? "You are a JEE Advanced Mentor specializing in Physics and Chemistry. Provide detailed simulations of complex mechanics, electrodynamics, and advanced chemical bonding relevant to the JEE syllabus. Focus on problem-solving and conceptual depth. Keep responses concise and interactive."
                : isSSB
                ? "You are an SSB Assessment Officer. Provide detailed simulations of psychological tests (TAT, WAT, SRT) and group testing scenarios. Focus on Officer Like Qualities (OLQs). Keep responses professional and evaluative."
                : (isNDA || isCDS)
                ? `You are a Commanding Officer guiding a ${context.detail} aspirant. Provide detailed simulations of tactical planning, defence strategies, and leadership scenarios. Focus on military discipline and strategic thinking.`
                : isUPSC
                ? (labId === 'upsc_ethics_sim' 
                    ? "You are an Ethics Mentor for UPSC aspirants. Provide detailed simulations of ethical dilemmas, case studies, and moral reasoning in public service. Focus on GS Paper IV topics like integrity, impartiality, and empathy."
                    : labId === 'policy_matrix'
                    ? "You are a Policy Advisor for UPSC aspirants. Provide detailed simulations of policy-making, socio-economic impact analysis, and implementation challenges. Focus on governance and social justice."
                    : labId === 'logic_grid'
                    ? "You are an Aptitude Coach for UPSC aspirants focusing on CSAT. Provide detailed simulations of logical reasoning puzzles, data interpretation, and analytical challenges. Focus on clarity and step-by-step reasoning."
                    : "You are an Administrative Mentor for UPSC aspirants. Provide detailed simulations of governance scenarios, policy implementation, and administrative challenges. Focus on administrative ethics and constitutional values.")
                : "You are a virtual simulation assistant. Help the student with their research.";

            let fullResponse = "";
            // Keep history manageable (last 10 messages)
            const history = messages.slice(-10);
            const stream = await getSimulationStream(context, userMsg, history, systemInstruction);
            
            setMessages(prev => [...prev, { role: 'model', text: '' }]);
            
            for await (const chunk of stream) {
                fullResponse += chunk;
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    return [...prev.slice(0, -1), { ...last, text: fullResponse }];
                });
            }
            addLog("Simulation update complete.");
            trackProgress('sim');
        } catch (err) {
            console.error(err);
            addLog(`ERROR: Neural link interference detected: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto w-full pt-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 font-mono text-xs tracking-widest uppercase transition-colors">
                    <ChevronLeftIcon className="w-4 h-4" /> Exit Simulation
                </button>
                <div className="flex items-center gap-6">
                    <button onClick={downloadLogs} className="text-slate-500 hover:text-cyan-400 font-mono text-[10px] tracking-widest uppercase transition-colors border border-slate-800 px-3 py-1 rounded">
                        Export Logs
                    </button>
                    <button onClick={clearChat} className="text-slate-500 hover:text-red-400 font-mono text-[10px] tracking-widest uppercase transition-colors border border-slate-800 px-3 py-1 rounded">
                        Reset Sim
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-lg border border-white/5">
                            {isPharma ? <AtomIcon className="w-5 h-5 text-indigo-400" /> : isHM ? <BriefcaseIcon className="w-5 h-5 text-orange-400" /> : <BotIcon className="w-5 h-5 text-cyan-400" />}
                        </div>
                        <span className="text-cyan-400 font-display text-sm tracking-widest uppercase">
                            {isPharma ? 'PHARMA LAB v2.4' : isHM ? 'KITCHEN SIM v1.8' : isNEET ? 'NEET BIOLOGY SIM' : isJEE ? 'JEE PHYSICS SIM' : isSSB ? 'SSB PSYCH SIM' : isNDA ? 'NDA DEFENCE SIM' : isCDS ? 'CDS STRATEGIC SIM' : labId === 'upsc_ethics_sim' ? 'ETHICS SIM' : labId === 'policy_matrix' ? 'POLICY MATRIX' : labId === 'logic_grid' ? 'LOGIC GRID' : 'GOVERNANCE LAB'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow overflow-hidden mb-6">
                <div className="lg:col-span-3 hud-card flex flex-col bg-slate-950/50 border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] overflow-hidden">
                    <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {messages.map((m, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`flex items-center gap-2 mb-1 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-cyan-500' : 'bg-slate-800 border border-white/10'}`}>
                                            {m.role === 'user' ? <UsersIcon className="w-3 h-3 text-black" /> : <BotIcon className="w-3 h-3 text-cyan-400" />}
                                        </div>
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                                            {m.role === 'user' ? 'Aspirant' : isPharma ? 'Lead Researcher' : isHM ? 'Executive Chef' : isNEET ? 'Biology Mentor' : isJEE ? 'Physics Lead' : isSSB ? 'Assessing Officer' : isNDA || isCDS ? 'Commanding Officer' : isUPSC ? 'Admin Mentor' : 'Strategos Lab'}
                                        </span>
                                    </div>
                                    <div className={`max-w-[85%] p-5 clip-corner-sm text-sm leading-relaxed markdown-body ${
                                        m.role === 'user' ? 'bg-cyan-900/30 border border-cyan-500/30 text-white' : 'bg-slate-900/80 border border-white/5 text-slate-200'
                                    }`}>
                                        <ReactMarkdown>{m.text}</ReactMarkdown>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isThinking && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-3 items-center text-cyan-500/50 font-mono text-[10px]"
                            >
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce"></div>
                                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                                <span className="uppercase tracking-[0.2em]">Processing neural simulation...</span>
                            </motion.div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                </div>

                <div className="hidden lg:flex flex-col gap-4">
                    <div className="hud-card p-4 bg-slate-900/50 border-slate-800 flex-grow flex flex-col">
                        <div className="flex justify-between items-center mb-4 border-b border-cyan-500/20 pb-2">
                            <h3 className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.2em]">System Logs</h3>
                            <button onClick={clearLogs} className="text-[8px] font-mono text-slate-500 hover:text-red-400 uppercase transition-colors">Clear</button>
                        </div>
                        <div className="space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar">
                            {systemLogs.slice().reverse().slice(0, 10).map((log, i) => (
                                <div key={i} className="text-[9px] font-mono text-slate-400 leading-tight border-l border-cyan-500/20 pl-2">
                                    {log}
                                </div>
                            ))}
                            {systemLogs.length === 0 && <div className="text-[9px] font-mono text-slate-600 italic">No logs available.</div>}
                        </div>
                    </div>
                    <div className="hud-card p-4 bg-slate-900/50 border-slate-800">
                        <h3 className="text-[10px] font-mono text-yellow-500 uppercase tracking-[0.2em] mb-2">Sim Status</h3>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <span className="text-[10px] font-mono text-slate-300 uppercase">{isThinking ? 'Processing' : 'Ready'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-8">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Enter simulation command..."
                    className="flex-grow bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white p-4 clip-corner-sm outline-none font-sans text-sm shadow-inner"
                />
                <button 
                    onClick={handleSend}
                    disabled={isThinking || !input.trim()}
                    className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-black font-bold px-8 clip-corner-sm transition-all flex items-center gap-2 shadow-lg"
                >
                    <SendIcon className="w-4 h-4" /> RUN
                </button>
            </div>
        </div>
    );
};

export default VirtualLab;
