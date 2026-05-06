
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { UserContext, ChatMessage } from '../types';
import { getTutorResponseStream } from '../services/geminiService';
import { ChevronRightIcon } from './icons';
import AIAssistant from './AIAssistant';
import ReactMarkdown from 'react-markdown';

interface NeuralMentorProps {
    context: UserContext;
    playSound: (type: 'click' | 'navigate' | 'success' | 'xp') => void;
}

const NeuralMentor: React.FC<NeuralMentorProps> = ({ context, playSound }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'init-1',
            role: 'model',
            text: `System Online. I am **Strategos**.\n\nNeural Link: **${context.label}** verified.\nAwaiting your queries regarding ${context.subCategory} / ${context.detail}.`,
            timestamp: Date.now()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isTyping) return;

        const userText = input.trim();
        setInput('');
        playSound('click');

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: userText,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        try {
            const history = messages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));

            const botMessageId = (Date.now() + 1).toString();
            let accumulatedText = '';
            
            setMessages(prev => [...prev, {
                id: botMessageId,
                role: 'model',
                text: '',
                timestamp: Date.now()
            }]);

            const stream = getTutorResponseStream(history, userText, context);

            for await (const chunk of stream) {
                accumulatedText += chunk;
                setMessages(prev => prev.map(msg => 
                    msg.id === botMessageId ? { ...msg, text: accumulatedText } : msg
                ));
            }
            playSound('success'); 
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: "ERR_CONNECTION: Neural link severed.",
                timestamp: Date.now()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full gap-6 pt-4">
             <div className="flex-1 hud-card p-0 flex flex-col shadow-2xl relative bg-black/60">
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                <div className="flex items-center justify-between p-6 border-b border-violet-500/30 bg-violet-900/10">
                    <div className="flex items-center gap-6">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <AIAssistant className="w-full h-full" isTyping={isTyping} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white font-display tracking-widest text-glow">STRATEGOS</h1>
                            <div className="text-xs text-violet-300 font-mono tracking-[0.3em] uppercase mt-1">AI MENTOR</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 relative z-10">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div 
                                key={msg.id} 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] md:max-w-[70%] p-6 relative group transition-all duration-300 ${msg.role === 'user' ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-50 clip-notch-right' : 'bg-violet-950/40 border border-violet-500/30 text-violet-50 clip-corner-sm'}`}>
                                    <div className="prose prose-invert max-w-none font-sans text-base markdown-body">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTyping && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-violet-400 font-mono tracking-widest animate-pulse ml-6"
                        >
                            PROCESSING...
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-6 bg-black/20 border-t border-white/5">
                    <div className="flex relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Query the database..."
                            className="w-full bg-slate-900/50 border border-slate-700 focus:border-violet-400 text-gray-200 py-5 pl-4 pr-20 outline-none transition-all clip-corner-sm font-mono tracking-wide"
                            disabled={isTyping}
                            autoFocus
                        />
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit" 
                            disabled={!input.trim() || isTyping} 
                            className="absolute right-2 top-2 bottom-2 bg-violet-600 hover:bg-violet-500 text-white px-6 clip-corner-sm"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </motion.button>
                    </div>
                </form>
             </div>
        </div>
    );
};

export default NeuralMentor;
