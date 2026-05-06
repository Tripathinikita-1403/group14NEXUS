
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SYLLABUS_DATABASE } from '../constants';
import { getStudyMaterial, getPracticeQuestions, getBuddyHint } from '../services/geminiService';
import type { UserContext, StudyTopic, StudyContent, PracticeQuestion } from '../types';
import { TargetIcon, ArchiveIcon } from './icons';

interface StudyVaultProps {
    context: UserContext;
    addXp: (amount: number) => void;
    trackProgress: (type: 'topic' | 'task' | 'sim' | 'combat' | 'essay', id?: string) => void;
}

const StudyVault: React.FC<StudyVaultProps> = ({ context, addXp, trackProgress }) => {
    const [selectedTopic, setSelectedTopic] = useState<StudyTopic | null>(null);
    const [content, setContent] = useState<StudyContent | null>(null);
    const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPracticeLoading, setIsPracticeLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'notes' | 'context' | 'flashcards' | 'practice'>('notes');
    const [syllabus, setSyllabus] = useState<StudyTopic[]>([]);

    useEffect(() => {
        // Resolve Syllabus based on Context
        let data: StudyTopic[] = [];
        
        if (context.category === 'COMPETITIVE') {
            data = SYLLABUS_DATABASE[context.detail] || [];
        } else if (context.category === 'COLLEGE') {
            // E.g., BTECH
            data = SYLLABUS_DATABASE[context.detail] || [];
        } else if (context.category === 'SCHOOL') {
            // Check detail for Class 11/12
            if (context.detail.includes('11') || context.detail.includes('12')) {
                data = SYLLABUS_DATABASE['SCHOOL_SENIOR'] || [];
            } else {
                data = SYLLABUS_DATABASE['SCHOOL_MIDDLE'] || [];
            }
        }
        
        setSyllabus(data);
    }, [context]);

    const handleTopicClick = async (topic: StudyTopic) => {
        if (topic.subtopics && topic.subtopics.length > 0) return; // Expandable parent
        
        setSelectedTopic(topic);
        setContent(null);
        setPracticeQuestions([]);
        setIsLoading(true);
        setError(null);
        setActiveTab('notes');

        try {
            const data = await getStudyMaterial(context, topic.title);
            setContent(data);
            addXp(15);
            trackProgress('topic', topic.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load study material.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDailyDrill = async () => {
        const dailyTopic: StudyTopic = { id: 'daily-drill', title: `Daily ${context.detail} Drill` };
        setSelectedTopic(dailyTopic);
        setContent({
            title: `Daily ${context.detail} Drill`,
            overview: "A mixed set of high-yield questions covering various aspects of your syllabus to keep preparation sharp.",
            keyPoints: ["Test cross-disciplinary knowledge.", "Identify weak areas.", "Improve random recall."],
            examContext: "Regular mixed practice helps in handling the unpredictability of exams.",
            flashcards: []
        });
        setIsLoading(false);
        setActiveTab('practice');
        loadPracticeQuestions(dailyTopic);
    };

    const loadPracticeQuestions = async (topic: StudyTopic) => {
        setIsPracticeLoading(true);
        try {
            const questions = await getPracticeQuestions(context, topic.title);
            setPracticeQuestions(questions);
        } catch (err) {
            console.error(err);
        } finally {
            setIsPracticeLoading(false);
        }
    };

    const handleTabChange = (tab: 'notes' | 'context' | 'flashcards' | 'practice') => {
        setActiveTab(tab);
        if (tab === 'practice' && practiceQuestions.length === 0 && selectedTopic) {
            loadPracticeQuestions(selectedTopic);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-full gap-6 pt-4 md:pt-0">
             {/* Sidebar */}
            <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full md:w-1/3 bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 clip-corner-sm p-0 overflow-hidden flex flex-col shadow-2xl relative"
            >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0"></div>
                
                <div className="p-5 bg-cyan-950/40 border-b border-cyan-500/30 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <ArchiveIcon className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-xl font-bold text-white tracking-widest font-display">ARCHIVES</h2>
                    </div>
                    <div className="text-[10px] text-cyan-500/60 font-mono tracking-widest">{context.detail.replace(/\s/g, '_')}</div>
                </div>
                
                <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDailyDrill}
                        className="w-full mb-8 bg-gradient-to-r from-red-900/40 to-slate-900 border border-red-500/40 hover:border-red-400 text-red-300 font-bold py-5 px-4 clip-notch-right flex items-center justify-center gap-3 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-red-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                        <TargetIcon className="w-5 h-5 group-hover:scale-125 transition-transform relative z-10" />
                        <span className="font-display tracking-[0.2em] relative z-10">INITIATE DRILL</span>
                    </motion.button>

                    <div className="space-y-8">
                        {syllabus.map((category) => (
                            <div key={category.id}>
                                <h3 className="text-cyan-400 font-mono font-bold mb-4 uppercase text-xs tracking-[0.3em] px-2 flex items-center gap-3 opacity-80">
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_5px_#0ff]"></span>
                                    {category.title}
                                </h3>
                                <div className="space-y-1 pl-2 border-l border-white/5 ml-1">
                                    {category.subtopics?.map((topic) => (
                                        <motion.button
                                            key={topic.id}
                                            whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                                            onClick={() => handleTopicClick(topic)}
                                            className={`w-full text-left py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-between group clip-corner-sm ml-2 ${
                                                selectedTopic?.id === topic.id 
                                                ? 'bg-cyan-500/20 text-white border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                                                : 'text-gray-400 hover:text-white border border-transparent'
                                            }`}
                                        >
                                            <span className="truncate pr-2 relative z-10">{topic.title}</span>
                                            {selectedTopic?.id === topic.id && <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_5px_#0ff]"></div>}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 clip-corner p-8 relative overflow-hidden flex flex-col h-full shadow-2xl"
            >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none"></div>

                <AnimatePresence mode="wait">
                    {!selectedTopic ? (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full text-center p-8"
                        >
                            <div className="p-10 border border-cyan-500/30 rounded-full mb-8 relative">
                                <div className="absolute inset-0 border border-cyan-500/20 rounded-full scale-125 animate-ping"></div>
                                <ArchiveIcon className="w-16 h-16 text-cyan-400" />
                            </div>
                            <h2 className="text-4xl font-bold text-gray-200 mb-4 font-display tracking-widest">AWAITING INPUT</h2>
                            <p className="font-mono text-cyan-400/80 tracking-wider mb-12">Select a subject from the archives to begin neural synchronization.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                                <div className="p-6 bg-slate-800/40 border border-slate-700 clip-corner-sm text-left">
                                    <h4 className="text-cyan-400 font-bold text-xs tracking-widest mb-2 uppercase">Quick Tip</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed uppercase tracking-wider">Use the "Initiate Drill" button for a randomized challenge across all topics.</p>
                                </div>
                                <div className="p-6 bg-slate-800/40 border border-slate-700 clip-corner-sm text-left">
                                    <h4 className="text-cyan-400 font-bold text-xs tracking-widest mb-2 uppercase">Neural Link</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed uppercase tracking-wider">Strategos can provide deeper insights once a topic is selected.</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key={selectedTopic.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col h-full"
                        >
                            <div className="mb-8 relative z-10 border-b border-cyan-500/20 pb-6 flex justify-between items-end">
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 font-display tracking-wide uppercase italic filter drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">{selectedTopic.title}</h1>
                                    {isLoading && <div className="text-cyan-400 text-xs font-mono animate-pulse mt-2 tracking-[0.5em]">DECRYPTING...</div>}
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                                    <div className="relative w-24 h-24">
                                        <div className="absolute inset-0 border-4 border-cyan-900/50 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
                                    </div>
                                </div>
                            ) : content ? (
                                <div className="flex flex-col h-full relative z-10">
                                    <div className="flex gap-2 mb-8 bg-black/40 p-1.5 self-start border border-cyan-500/20 clip-corner-sm backdrop-blur-sm">
                                        <TabButton active={activeTab === 'notes'} onClick={() => handleTabChange('notes')} label="INTEL" />
                                        <TabButton active={activeTab === 'context'} onClick={() => handleTabChange('context')} label="BRIEFING" />
                                        <TabButton active={activeTab === 'flashcards'} onClick={() => handleTabChange('flashcards')} label="RECALL" />
                                        <TabButton active={activeTab === 'practice'} onClick={() => handleTabChange('practice')} label="SIMULATION" />
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar pb-6">
                                        <AnimatePresence mode="wait">
                                            {activeTab === 'notes' && (
                                                <motion.div 
                                                    key="notes"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="space-y-8"
                                                >
                                                    <div className="bg-gradient-to-r from-cyan-900/30 to-transparent p-8 border-l-4 border-cyan-500 backdrop-blur-sm shadow-lg">
                                                        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.3em] mb-4 font-display">Summary</h3>
                                                        <p className="text-gray-100 leading-8 font-sans text-lg">{content.overview}</p>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <h3 className="text-xl font-bold text-white font-display mb-6 tracking-wider">Key Points</h3>
                                                        {content.keyPoints.map((point, idx) => (
                                                            <motion.div 
                                                                key={idx} 
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.1 }}
                                                                className="flex gap-6 p-6 bg-slate-800/40 border border-white/5 hover:border-cyan-500/40 transition-all clip-corner-sm"
                                                            >
                                                                <span className="text-cyan-500 font-bold font-mono text-xl opacity-60">0{idx + 1}</span>
                                                                <span className="text-gray-200 leading-relaxed text-lg">{point}</span>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeTab === 'context' && (
                                                <motion.div 
                                                    key="context"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="h-full"
                                                >
                                                    <div className="bg-slate-800/40 p-10 border border-yellow-500/20 h-full clip-corner-sm relative">
                                                        <h3 className="text-3xl font-bold text-white mb-8 font-display italic tracking-wide">RELEVANCE</h3>
                                                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-loose font-sans">
                                                           <p className="whitespace-pre-wrap">{content.examContext}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeTab === 'flashcards' && (
                                                <motion.div 
                                                    key="flashcards"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4"
                                                >
                                                    {content.flashcards.map((card, idx) => (
                                                        <Flashcard key={idx} question={card.question} answer={card.answer} />
                                                    ))}
                                                </motion.div>
                                            )}

                                            {activeTab === 'practice' && (
                                                <motion.div 
                                                    key="practice"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="pb-4 space-y-8"
                                                >
                                                    {isPracticeLoading ? (
                                                        <div className="flex flex-col items-center justify-center py-20">
                                                            <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-6"></div>
                                                            <p className="text-red-400 font-mono tracking-[0.3em] animate-pulse">GENERATING...</p>
                                                        </div>
                                                    ) : (
                                                        practiceQuestions.map((q, idx) => (
                                                            <QuizItem key={q.id} index={idx} question={q} addXp={addXp} topicTitle={selectedTopic.title} context={context} />
                                                        ))
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            ) : null}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

// ... QuizItem, TabButton, Flashcard components (Same as previous, just ensure they are present or imported)
const QuizItem: React.FC<{ index: number; question: PracticeQuestion; addXp: (n: number) => void; topicTitle: string; context: UserContext }> = ({ index, question, addXp, topicTitle, context }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isHintLoading, setIsHintLoading] = useState(false);

    const [hint, setHint] = useState<string | null>(null);

    const handleSelect = (optionIdx: number) => {
        if (isRevealed) return;
        setSelectedOption(optionIdx);
        setIsRevealed(true);
        if (optionIdx === question.correctAnswerId) {
            addXp(10);
        }
    };

    const handleHint = async () => {
        if (isHintLoading || hint) return;
        setIsHintLoading(true);
        try {
            const h = await getBuddyHint(context, topicTitle, question.question);
            setHint(h);
        } catch (err) {
            setHint("Think about the core principles mentioned in the notes.");
        } finally {
            setIsHintLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/60 border border-slate-700 p-8 hover:border-cyan-500/40 transition-all clip-corner-sm hover:shadow-lg relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-2 opacity-20">
                <TargetIcon className="w-12 h-12 text-cyan-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-100 mb-8 flex gap-4 items-start leading-snug relative z-10">
                <span className="text-cyan-500 font-mono text-xl font-bold opacity-60">Q{index + 1} //</span>
                <div className="flex-1">
                    {question.question}
                    {!isRevealed && !hint && (
                        <button 
                            onClick={handleHint}
                            disabled={isHintLoading}
                            className="ml-4 px-3 py-1 border border-yellow-500/50 text-yellow-500 text-[10px] font-bold uppercase tracking-widest clip-corner-sm hover:bg-yellow-500/10 transition-all"
                        >
                            {isHintLoading ? 'ANALYZING...' : 'GET HINT'}
                        </button>
                    )}
                </div>
            </h3>

            <AnimatePresence>
                {hint && !isRevealed && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 bg-yellow-900/10 border border-yellow-500/30 text-yellow-200 text-sm italic font-sans clip-corner-sm"
                    >
                        <span className="font-bold uppercase text-[10px] tracking-widest block mb-1">Buddy Hint:</span>
                        "{hint}"
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4 mb-8 relative z-10">
                {question.options.map((opt, idx) => {
                    let btnClass = "w-full text-left p-5 border transition-all duration-200 relative overflow-hidden font-medium clip-corner-sm group ";
                    if (isRevealed) {
                        if (idx === question.correctAnswerId) {
                            btnClass += "bg-green-500/20 border-green-500 text-green-300";
                        } else if (idx === selectedOption) {
                            btnClass += "bg-red-500/20 border-red-500 text-red-300";
                        } else {
                            btnClass += "bg-black/40 border-transparent opacity-30";
                        }
                    } else {
                        btnClass += "bg-slate-800/40 border-slate-700 hover:bg-slate-700 hover:border-cyan-400 hover:pl-8";
                    }

                    return (
                        <button 
                            key={idx} 
                            onClick={() => handleSelect(idx)}
                            disabled={isRevealed}
                            className={btnClass}
                        >
                             <span className="font-mono mr-6 text-gray-500 text-xs tracking-widest group-hover:text-cyan-400 transition-colors">OPT_{String.fromCharCode(65 + idx)}</span> 
                             {opt}
                        </button>
                    );
                })}
            </div>
            {isRevealed && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-cyan-950/20 p-6 border-l-2 border-cyan-400 backdrop-blur-sm"
                >
                    <h4 className="font-bold text-cyan-400 mb-3 uppercase text-xs tracking-[0.2em] font-mono">Tactical Analysis</h4>
                    <p className="text-gray-300 text-base leading-relaxed">{question.explanation}</p>
                </motion.div>
            )}
        </motion.div>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 clip-corner-sm ${
            active 
            ? 'bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105' 
            : 'text-gray-500 hover:text-white hover:bg-white/5'
        }`}
    >
        {label}
    </motion.button>
);

const Flashcard: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-800/60 border border-slate-600 clip-corner-sm p-8 flex flex-col items-center justify-center text-center hover:border-cyan-400 transition-all shadow-xl backdrop-blur-sm cursor-pointer group min-h-[18rem]"
            onClick={() => setShowAnswer(!showAnswer)}
        >
            <div className="w-14 h-14 rounded-full border-2 border-cyan-500/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <span className="text-cyan-500 font-bold font-mono text-2xl">?</span>
            </div>
            <p className="text-gray-100 font-bold text-xl leading-relaxed mb-6">{question}</p>
            
            <AnimatePresence mode="wait">
                {showAnswer ? (
                    <motion.div 
                        key="answer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full pt-6 border-t border-cyan-500/30"
                    >
                        <p className="text-cyan-300 text-lg font-medium leading-loose">{answer}</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="prompt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full text-center"
                    >
                        <span className="text-[10px] text-cyan-500/60 uppercase tracking-[0.3em] animate-pulse">Click Question to Reveal Answer</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StudyVault;
