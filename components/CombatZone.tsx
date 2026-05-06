
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { UserContext, PracticeQuestion } from '../types';
import { getPracticeQuestions, getGDTopic, getPsychTestScenario, getTutorResponseStream, getGDAgentResponse, getCombatChallenge, getBuddyHint } from '../services/geminiService';
import { TargetIcon, UsersIcon, BotIcon, ChevronLeftIcon, ChevronRightIcon, XIcon, RadioIcon, MessageSquareIcon, BrainCircuitIcon, ShieldIcon, BookOpenIcon, AtomIcon, BriefcaseIcon, LayoutDashboardIcon } from './icons';

interface CombatZoneProps {
    context: UserContext;
    addXp: (amount: number) => void;
    trackProgress: (type: 'topic' | 'task' | 'sim' | 'combat' | 'essay', id?: string) => void;
}

type CombatMode = 'SELECTION' | 'KNOWLEDGE_BLITZ' | 'GD_ARENA' | 'PSYCH_TEST' | 'VOCAB_VAULT' | 'LOGIC_QUEST' | 'PLACEMENT_PREP' | 'INDUSTRY_INSIGHTS' | 'FORMULA_SPRINT' | 'CASE_STUDY' | 'CURRENT_AFFAIRS' | 'PHARMA_BLITZ' | 'HOSPITALITY_ARENA' | 'MED_CHEM_CHALLENGE' | 'CULINARY_PRO' | 'NEET_BIO_BLITZ' | 'NEET_CHEM_SPRINT' | 'JEE_PHYSICS_ARENA' | 'JEE_MATHS_MASTERY' | 'SSB_GTO_SIMULATOR' | 'SSB_INTERVIEW_PREP' | 'NDA_GAT_BLITZ' | 'NDA_MATHS_SPRINT';

const CombatZone: React.FC<CombatZoneProps> = ({ context, addXp, trackProgress }) => {
    const [mode, setMode] = useState<CombatMode>('SELECTION');

    const renderMode = () => {
        switch (mode) {
            case 'SELECTION':
                return <CombatSelection context={context} setMode={setMode} />;
            case 'KNOWLEDGE_BLITZ':
                return <KnowledgeBlitz context={context} addXp={addXp} onBack={() => setMode('SELECTION')} trackProgress={trackProgress} />;
            case 'GD_ARENA':
                return <GDArena context={context} addXp={addXp} onBack={() => setMode('SELECTION')} trackProgress={trackProgress} />;
            case 'PSYCH_TEST':
                return <PsychTest context={context} addXp={addXp} onBack={() => setMode('SELECTION')} trackProgress={trackProgress} />;
            case 'VOCAB_VAULT':
            case 'LOGIC_QUEST':
            case 'PLACEMENT_PREP':
            case 'INDUSTRY_INSIGHTS':
            case 'FORMULA_SPRINT':
            case 'CASE_STUDY':
            case 'CURRENT_AFFAIRS':
            case 'PHARMA_BLITZ':
            case 'HOSPITALITY_ARENA':
            case 'MED_CHEM_CHALLENGE':
            case 'CULINARY_PRO':
            case 'NEET_BIO_BLITZ':
            case 'NEET_CHEM_SPRINT':
            case 'JEE_PHYSICS_ARENA':
            case 'JEE_MATHS_MASTERY':
            case 'SSB_GTO_SIMULATOR':
            case 'SSB_INTERVIEW_PREP':
            case 'NDA_GAT_BLITZ':
            case 'NDA_MATHS_SPRINT':
                return <CombatChallenge mode={mode} context={context} addXp={addXp} onBack={() => setMode('SELECTION')} trackProgress={trackProgress} />;
            default:
                return <CombatSelection context={context} setMode={setMode} />;
        }
    };

    return (
        <div className="h-full w-full flex flex-col">
            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                >
                    {renderMode()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// --- SELECTION SCREEN ---
const CombatSelection: React.FC<{ context: UserContext; setMode: (mode: CombatMode) => void }> = ({ context, setMode }) => {
    const isCDS = context.detail === 'CDS';
    const isSchool = context.category === 'SCHOOL';
    const isCollege = context.category === 'COLLEGE';
    const isUPSC = context.detail === 'UPSC';
    const isNEET = context.detail === 'NEET';
    const isJEE = context.detail === 'JEE';
    const isSSB = context.detail === 'SSB';
    const isNDA = context.detail === 'NDA';

    const getModules = () => {
        const isPharma = context.detail === 'BPHARMA';
        const isHM = context.detail === 'HM';
        const base = { id: 'KNOWLEDGE_BLITZ', title: 'Knowledge Blitz', description: 'Timed, adaptive quizzes mirroring exam patterns.', icon: <TargetIcon className="w-12 h-12 text-red-400" />, active: true };
        
        if (isCDS) {
            return [
                { id: 'GD_ARENA', title: 'Group Discussion Arena', description: 'Virtual rooms for simulated group discussions.', icon: <UsersIcon className="w-12 h-12 text-blue-400" />, active: true },
                { id: 'PSYCH_TEST', title: 'Psychological Test Interface', description: 'Interactive OIR, WAT, and TAT simulations.', icon: <BotIcon className="w-12 h-12 text-teal-400" />, active: true },
            ];
        }

        if (isSSB) {
            return [
                { id: 'SSB_GTO_SIMULATOR', title: 'SSB GTO Simulator', description: 'Simulated group tasks and strategic planning.', icon: <UsersIcon className="w-12 h-12 text-teal-500" />, active: true },
                { id: 'SSB_INTERVIEW_PREP', title: 'SSB Interview Coach', description: 'AI-powered mock interviews and feedback.', icon: <MessageSquareIcon className="w-12 h-12 text-blue-500" />, active: true },
            ];
        }

        if (isNDA) {
            return [
                { id: 'NDA_GAT_BLITZ', title: 'NDA GAT Blitz', description: 'Comprehensive GAT practice for NDA.', icon: <ShieldIcon className="w-12 h-12 text-slate-500" />, active: true },
                { id: 'NDA_MATHS_SPRINT', title: 'NDA Maths Sprint', description: 'Timed mathematics challenges for NDA.', icon: <BrainCircuitIcon className="w-12 h-12 text-cyan-500" />, active: true },
            ];
        }

        if (isNEET) {
            return [
                { id: 'NEET_BIO_BLITZ', title: 'NEET Bio Blitz', description: 'High-speed biology questions for NEET aspirants.', icon: <AtomIcon className="w-12 h-12 text-green-500" />, active: true },
                { id: 'NEET_CHEM_SPRINT', title: 'NEET Chem Sprint', description: 'Master chemistry concepts with timed sprints.', icon: <AtomIcon className="w-12 h-12 text-blue-500" />, active: true },
            ];
        }

        if (isJEE) {
            return [
                { id: 'JEE_PHYSICS_ARENA', title: 'JEE Physics Arena', description: 'Complex physics problem solving for JEE.', icon: <AtomIcon className="w-12 h-12 text-red-500" />, active: true },
                { id: 'JEE_MATHS_MASTERY', title: 'JEE Maths Mastery', description: 'Advanced mathematics challenges for JEE.', icon: <BrainCircuitIcon className="w-12 h-12 text-indigo-500" />, active: true },
            ];
        }
        
        if (isSchool) {
            return [
                base,
                { id: 'VOCAB_VAULT', title: 'Vocab Warrior', description: 'Master language with high-speed vocabulary challenges.', icon: <BookOpenIcon className="w-12 h-12 text-yellow-400" />, active: true },
                { id: 'LOGIC_QUEST', title: 'Logic Lab', description: 'Sharpen your mind with complex logical puzzles.', icon: <BrainCircuitIcon className="w-12 h-12 text-purple-400" />, active: true },
            ];
        }

        if (isCollege) {
            const mods: any[] = [];
            if (!isPharma && !isHM) {
                mods.push(base);
                mods.push({ id: 'PLACEMENT_PREP', title: 'Placement Pro', description: 'Master aptitude and reasoning for top-tier placements.', icon: <BriefcaseIcon className="w-12 h-12 text-cyan-400" />, active: true });
                mods.push({ id: 'INDUSTRY_INSIGHTS', title: 'Industry Intel', description: 'Stay ahead with deep dives into field-specific trends.', icon: <LayoutDashboardIcon className="w-12 h-12 text-orange-400" />, active: true });
            }
            if (isPharma) {
                mods.push({ id: 'PHARMA_BLITZ', title: 'Pharma Knowledge Blitz', description: 'Test your knowledge of drugs and interactions.', icon: <ShieldIcon className="w-12 h-12 text-teal-500" />, active: true });
                mods.push({ id: 'MED_CHEM_CHALLENGE', title: 'Med-Chem Challenge', description: 'Identify structures and synthesis pathways.', icon: <AtomIcon className="w-12 h-12 text-indigo-500" />, active: true });
            }
            if (isHM) {
                mods.push({ id: 'HOSPITALITY_ARENA', title: 'Hospitality Excellence', description: 'Case studies and scenarios for hotel management.', icon: <UsersIcon className="w-12 h-12 text-orange-500" />, active: true });
                mods.push({ id: 'CULINARY_PRO', title: 'Culinary Pro', description: 'Test your knowledge of world cuisines and techniques.', icon: <BriefcaseIcon className="w-12 h-12 text-yellow-500" />, active: true });
            }
            return mods;
        }

        if (isUPSC) {
            return [
                base,
                { id: 'CASE_STUDY', title: 'Ethics Case Study', description: 'Analyze complex administrative and ethical scenarios.', icon: <ShieldIcon className="w-12 h-12 text-green-400" />, active: true },
                { id: 'CURRENT_AFFAIRS', title: 'Current Affairs Blitz', description: 'Test your knowledge on recent global and national events.', icon: <RadioIcon className="w-12 h-12 text-pink-400" />, active: true },
            ];
        }

        return [base];
    };

    const modules = getModules();
    const isPharma = context.detail === 'BPHARMA';
    const isHM = context.detail === 'HM';
    const isHorizontal = isPharma || isHM || isNEET || isJEE || isSSB || isNDA || isCDS || isUPSC;

    return (
        <div className="pt-8 h-full flex flex-col items-center">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-black text-white mb-12 font-display tracking-widest text-glow uppercase"
            >
                Combat Zone
            </motion.h1>
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
                className={`flex flex-col ${isHorizontal ? 'md:flex-row justify-center' : 'md:grid md:grid-cols-' + modules.length} gap-8 max-w-6xl w-full px-4`}
            >
                {modules.map((mod) => (
                    <motion.button
                        key={mod.id}
                        variants={{
                            hidden: { opacity: 0, scale: 0.9, y: 20 },
                            visible: { opacity: 1, scale: 1, y: 0 }
                        }}
                        whileHover={mod.active ? { scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" } : {}}
                        whileTap={mod.active ? { scale: 0.95 } : {}}
                        onClick={() => mod.active && setMode(mod.id as CombatMode)}
                        className={`hud-card p-8 flex flex-col items-center text-center transition-all group ${isHorizontal ? 'flex-1 max-w-sm' : ''} ${!mod.active ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-white/5 cursor-pointer'}`}
                    >
                        <div className={`mb-6 p-6 rounded-full border transition-all ${mod.active ? 'bg-slate-900 border-slate-600 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_#0ff]' : 'bg-slate-950 border-slate-800'}`}>
                            {mod.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 font-display uppercase tracking-wide">{mod.title}</h3>
                        <p className="text-xs text-slate-400 font-mono leading-relaxed uppercase tracking-wider">{mod.description}</p>
                        {!mod.active && <div className="mt-4 text-[10px] text-red-500 font-bold border border-red-500/50 px-3 py-1 clip-corner bg-red-900/20 tracking-widest">LOCKED</div>}
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
};

// --- GENERIC COMBAT CHALLENGE (Vocab, Logic, Placement, etc.) ---
const CombatChallenge: React.FC<{ mode: CombatMode; context: UserContext; addXp: (amount: number) => void; onBack: () => void; trackProgress: (type: 'topic' | 'task' | 'sim' | 'combat' | 'essay', id?: string) => void }> = ({ mode, context, addXp, onBack, trackProgress }) => {
    const [challenge, setChallenge] = useState<any>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const [isHintLoading, setIsHintLoading] = useState(false);
    const [hint, setHint] = useState<string | null>(null);

    const fetchChallenge = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getCombatChallenge(context, mode);
            setChallenge(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [context, mode]);

    useEffect(() => {
        fetchChallenge();
    }, [fetchChallenge]);

    const handleAnswer = () => {
        if (selectedOption === null) return;
        if (selectedOption === challenge.questions[currentIndex].correctAnswerId) {
            setScore(s => s + 1);
            addXp(25);
        }
        setShowExplanation(true);
    };

    const nextQuestion = () => {
        if (currentIndex < challenge.questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setShowExplanation(false);
            setHint(null);
        } else {
            setIsFinished(true);
            addXp(score * 40);
            trackProgress('combat');
        }
    };

    const handleHint = async () => {
        if (isHintLoading || hint) return;
        setIsHintLoading(true);
        try {
            const h = await getBuddyHint(context, mode, challenge.questions[currentIndex].question);
            setHint(h);
        } catch (err) {
        } finally {
            setIsHintLoading(false);
        }
    };

    if (isLoading) return <LoadingState message="Synchronizing Tactical Data..." />;

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-6xl font-black text-white mb-4 font-display text-glow uppercase">Mission Complete</h2>
                <div className="hud-card p-12 max-w-md w-full mb-8">
                    <p className="text-cyan-400 font-mono text-xl mb-2 tracking-widest uppercase">{mode.replace(/_/g, ' ')}</p>
                    <p className="text-white font-bold text-3xl mb-4 tracking-widest">SCORE: {score} / {challenge.questions.length}</p>
                    <p className="text-yellow-400 font-mono text-sm tracking-widest">XP EARNED: {score * 40 + score * 25}</p>
                </div>
                <button onClick={onBack} className="hud-btn bg-cyan-900/30 border border-cyan-500/50 px-10 py-4 text-white font-bold uppercase tracking-widest hover:bg-cyan-500/20">Return to Command</button>
            </div>
        );
    }

    const q = challenge.questions[currentIndex];

    return (
        <div className="max-w-4xl mx-auto w-full pt-12 px-4">
            <div className="flex justify-between items-center mb-8">
                <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
                    <ChevronLeftIcon className="w-4 h-4" /> Abort
                </button>
                <div className="text-cyan-400 font-mono text-xs tracking-widest uppercase">{challenge.title} | {currentIndex + 1} / {challenge.questions.length}</div>
                <button 
                    onClick={handleHint}
                    disabled={isHintLoading || showExplanation}
                    className="ml-4 px-3 py-1 border border-yellow-500/50 text-yellow-500 text-[10px] font-bold uppercase tracking-widest clip-corner-sm hover:bg-yellow-500/10 disabled:opacity-50"
                >
                    {isHintLoading ? '...' : 'Get Hint'}
                </button>
            </div>

            {currentIndex === 0 && !showExplanation && challenge.content && (
                <div className="hud-card p-6 mb-8 bg-cyan-900/10 border-cyan-500/30">
                    <h4 className="text-cyan-400 font-bold uppercase text-xs tracking-widest mb-2">Briefing</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{challenge.content}</p>
                </div>
            )}

            {hint && !showExplanation && (
                <div className="hud-card p-4 mb-8 bg-yellow-900/10 border-yellow-500/30 animate-[slide-up_0.3s]">
                    <h4 className="text-yellow-500 font-bold uppercase text-[10px] tracking-widest mb-1">Buddy Hint</h4>
                    <div className="text-slate-300 text-xs italic markdown-body">
                        <ReactMarkdown>{hint}</ReactMarkdown>
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hud-card p-8 mb-8"
                >
                    <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">{q.question}</h3>
                    <div className="space-y-4">
                        {q.options.map((opt: string, idx: number) => (
                            <motion.button
                                key={idx}
                                whileHover={!showExplanation ? { scale: 1.02 } : {}}
                                whileTap={!showExplanation ? { scale: 0.98 } : {}}
                                disabled={showExplanation}
                                onClick={() => setSelectedOption(idx)}
                                className={`w-full p-5 text-left border transition-all clip-corner-sm flex items-center gap-4 ${
                                    showExplanation 
                                        ? idx === q.correctAnswerId 
                                            ? 'bg-green-900/20 border-green-500 text-green-300' 
                                            : idx === selectedOption 
                                                ? 'bg-red-900/20 border-red-500 text-red-300' 
                                                : 'bg-slate-900/50 border-slate-800 text-slate-500'
                                        : selectedOption === idx 
                                            ? 'bg-cyan-900/30 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                                            : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${selectedOption === idx ? 'border-cyan-400 bg-cyan-400 text-black' : 'border-slate-600'}`}>
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                {opt}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {showExplanation && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hud-card p-6 border-cyan-500/30 bg-cyan-900/10 mb-8"
                    >
                        <h4 className="text-cyan-400 font-bold uppercase text-xs tracking-widest mb-2">Tactical Analysis</h4>
                        <div className="text-slate-300 text-sm leading-relaxed markdown-body">
                            <ReactMarkdown>{q.explanation}</ReactMarkdown>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={nextQuestion} 
                            className="mt-6 w-full py-3 bg-cyan-500 text-black font-bold uppercase tracking-widest clip-corner hover:bg-cyan-400 transition-colors"
                        >
                            {currentIndex < challenge.questions.length - 1 ? 'Next Engagement' : 'Finalize Mission'}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {!showExplanation && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={selectedOption === null}
                    onClick={handleAnswer}
                    className="w-full py-4 bg-orange-600 disabled:bg-slate-800 text-white font-bold uppercase tracking-widest clip-corner hover:bg-orange-500 transition-colors shadow-lg"
                >
                    Confirm Selection
                </motion.button>
            )}
        </div>
    );
};

// --- KNOWLEDGE BLITZ (QUIZ) ---
const KnowledgeBlitz: React.FC<{ context: UserContext; addXp: (amount: number) => void; onBack: () => void; trackProgress: (type: 'topic' | 'task' | 'sim' | 'combat' | 'essay', id?: string) => void }> = ({ context, addXp, onBack, trackProgress }) => {
    const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const [isHintLoading, setIsHintLoading] = useState(false);
    const [hint, setHint] = useState<string | null>(null);

    const fetchQuestions = useCallback(async () => {
        setIsLoading(true);
        try {
            let topic = "General Knowledge";
            if (context.category === 'SCHOOL') {
                topic = `Subjects for ${context.detail} (${context.subCategory} Board)`;
            } else if (context.category === 'COLLEGE') {
                topic = `Core subjects for ${context.detail} degree`;
            } else {
                topic = `${context.detail} Exam Syllabus and General Studies`;
            }
            const q = await getPracticeQuestions(context, topic);
            setQuestions(q);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [context]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleAnswer = () => {
        if (selectedOption === null) return;
        if (selectedOption === questions[currentIndex].correctAnswerId) {
            setScore(s => s + 1);
            addXp(20);
        }
        setShowExplanation(true);
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setShowExplanation(false);
            setHint(null);
        } else {
            setIsFinished(true);
            addXp(score * 50);
            trackProgress('combat');
        }
    };

    const handleHint = async () => {
        if (isHintLoading || hint) return;
        setIsHintLoading(true);
        try {
            const h = await getBuddyHint(context, "General Knowledge", questions[currentIndex].question);
            setHint(h);
        } catch (err) {
        } finally {
            setIsHintLoading(false);
        }
    };

    if (isLoading) return <LoadingState message="Loading Combat Scenarios..." />;

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-6xl font-black text-white mb-4 font-display text-glow">MISSION COMPLETE</h2>
                <div className="hud-card p-12 max-w-md w-full mb-8">
                    <p className="text-cyan-400 font-mono text-xl mb-2 tracking-widest">SCORE: {score} / {questions.length}</p>
                    <p className="text-yellow-400 font-mono text-sm tracking-widest">XP EARNED: {score * 50 + score * 20}</p>
                </div>
                <button onClick={onBack} className="hud-btn bg-cyan-900/30 border border-cyan-500/50 px-10 py-4 text-white font-bold uppercase tracking-widest hover:bg-cyan-500/20">Return to Command</button>
            </div>
        );
    }

    const q = questions[currentIndex];

    return (
        <div className="max-w-4xl mx-auto w-full pt-12 px-4">
            <div className="flex justify-between items-center mb-8">
                <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
                    <ChevronLeftIcon className="w-4 h-4" /> Abort
                </button>
                <div className="text-cyan-400 font-mono text-xs tracking-widest uppercase">Question {currentIndex + 1} / {questions.length}</div>
                <button 
                    onClick={handleHint}
                    disabled={isHintLoading || showExplanation || hint !== null}
                    className="ml-4 px-3 py-1 border border-yellow-500/50 text-yellow-500 text-[10px] font-bold uppercase tracking-widest clip-corner-sm hover:bg-yellow-500/10 disabled:opacity-50"
                >
                    {isHintLoading ? '...' : hint ? 'Hint Active' : 'Get Hint'}
                </button>
            </div>

            {hint && !showExplanation && (
                <div className="hud-card p-4 mb-8 bg-yellow-900/10 border-yellow-500/30 animate-[slide-up_0.3s]">
                    <h4 className="text-yellow-500 font-bold uppercase text-[10px] tracking-widest mb-1">Buddy Hint</h4>
                    <div className="text-slate-300 text-xs italic markdown-body">
                        <ReactMarkdown>{hint}</ReactMarkdown>
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hud-card p-8 mb-8"
                >
                    <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">{q.question}</h3>
                    <div className="space-y-4">
                        {q.options.map((opt, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={!showExplanation ? { scale: 1.02 } : {}}
                                whileTap={!showExplanation ? { scale: 0.98 } : {}}
                                disabled={showExplanation}
                                onClick={() => setSelectedOption(idx)}
                                className={`w-full p-5 text-left border transition-all clip-corner-sm flex items-center gap-4 ${
                                    showExplanation 
                                        ? idx === q.correctAnswerId 
                                            ? 'bg-green-900/20 border-green-500 text-green-300' 
                                            : idx === selectedOption 
                                                ? 'bg-red-900/20 border-red-500 text-red-300' 
                                                : 'bg-slate-900/50 border-slate-800 text-slate-500'
                                        : selectedOption === idx 
                                            ? 'bg-cyan-900/30 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                                            : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${selectedOption === idx ? 'border-cyan-400 bg-cyan-400 text-black' : 'border-slate-600'}`}>
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                {opt}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {showExplanation && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hud-card p-6 border-cyan-500/30 bg-cyan-900/10 mb-8"
                    >
                        <h4 className="text-cyan-400 font-bold uppercase text-xs tracking-widest mb-2">Tactical Analysis</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{q.explanation}</p>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={nextQuestion} 
                            className="mt-6 w-full py-3 bg-cyan-500 text-black font-bold uppercase tracking-widest clip-corner hover:bg-cyan-400 transition-colors"
                        >
                            {currentIndex < questions.length - 1 ? 'Next Engagement' : 'Finalize Mission'}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {!showExplanation && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={selectedOption === null}
                    onClick={handleAnswer}
                    className="w-full py-4 bg-orange-600 disabled:bg-slate-800 text-white font-bold uppercase tracking-widest clip-corner hover:bg-orange-500 transition-colors shadow-lg"
                >
                    Confirm Selection
                </motion.button>
            )}
        </div>
    );
};

// --- GD ARENA (SIMULATED DISCUSSION) ---
const GDArena: React.FC<{ context: UserContext; addXp: (amount: number) => void; onBack: () => void; trackProgress: (type: 'topic' | 'task' | 'sim' | 'combat' | 'essay', id?: string) => void }> = ({ context, addXp, onBack, trackProgress }) => {
    const [topic, setTopic] = useState<{ topic: string; background: string } | null>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'agent1' | 'agent2' | 'moderator'; text: string }[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initGD = async () => {
            setIsLoading(true);
            try {
                const t = await getGDTopic(context);
                setTopic(t);
                setMessages([{ 
                    role: 'moderator', 
                    text: `Welcome to the Group Discussion Arena. Today's topic is: "${t.topic}".\n\nBackground: ${t.background}\n\nYou are joined by two other candidates. Please start the discussion.` 
                }]);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        initGD();
    }, [context]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!userInput.trim() || isThinking) return;
        const userMsg = userInput;
        setUserInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsThinking(true);
        addXp(10);

        try {
            // Simulate agent responses
            const historyStr = messages.map(m => `${m.role}: ${m.text}`).join('\n');
            
            // Get Agent 1 response
            const agent1Text = await getGDAgentResponse(topic?.topic || '', historyStr, 'Candidate 1');
            setMessages(prev => [...prev, { role: 'agent1', text: agent1Text }]);

            // Small delay for realism
            await new Promise(r => setTimeout(r, 1500));

            // Update history for Agent 2
            const updatedHistoryStr = historyStr + `\nagent1: ${agent1Text}`;
            const agent2Text = await getGDAgentResponse(topic?.topic || '', updatedHistoryStr, 'Candidate 2');

            setMessages(prev => [...prev, { role: 'agent2', text: agent2Text }]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsThinking(false);
        }
    };

    if (isLoading) return <LoadingState message="Initializing Arena..." />;

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto w-full pt-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
                    <ChevronLeftIcon className="w-4 h-4" /> Exit Arena
                </button>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">C1</div>
                        <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">C2</div>
                    </div>
                    <span className="text-cyan-400 font-mono text-[10px] tracking-widest uppercase">3 Participants Active</span>
                </div>
            </div>

            <div className="hud-card flex-grow overflow-hidden flex flex-col mb-6">
                <div className="bg-slate-900/80 p-4 border-b border-white/5">
                    <h3 className="text-cyan-400 font-display text-sm tracking-widest uppercase mb-1">Current Topic</h3>
                    <p className="text-white font-bold text-lg">{topic?.topic}</p>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`flex items-center gap-2 mb-1 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <span className={`text-[10px] font-mono uppercase tracking-widest ${
                                    m.role === 'moderator' ? 'text-yellow-500' : 
                                    m.role === 'agent1' ? 'text-blue-400' : 
                                    m.role === 'agent2' ? 'text-purple-400' : 'text-cyan-400'
                                }`}>
                                    {m.role === 'moderator' ? 'System Moderator' : m.role === 'agent1' ? 'Candidate 1' : m.role === 'agent2' ? 'Candidate 2' : 'You (Candidate 3)'}
                                </span>
                            </div>
                            <div className={`max-w-[80%] p-4 clip-corner-sm text-sm leading-relaxed ${
                                m.role === 'moderator' ? 'bg-yellow-900/10 border border-yellow-500/20 text-yellow-100 italic' :
                                m.role === 'user' ? 'bg-cyan-900/30 border border-cyan-500/30 text-white' :
                                'bg-slate-800/50 border border-white/5 text-slate-200'
                            }`}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex gap-2 items-center text-slate-500 font-mono text-[10px] animate-pulse">
                            <RadioIcon className="w-3 h-3" /> Candidate 1 is typing...
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            </div>

            <div className="flex gap-4 mb-8">
                <input
                    type="text"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Contribute to the discussion..."
                    className="flex-grow bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white p-4 clip-corner-sm outline-none font-sans text-sm"
                />
                <button 
                    onClick={handleSend}
                    disabled={isThinking || !userInput.trim()}
                    className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-black font-bold px-8 clip-corner-sm transition-all flex items-center gap-2"
                >
                    <MessageSquareIcon className="w-4 h-4" /> SEND
                </button>
            </div>
        </div>
    );
};

// --- PSYCH TEST (WAT/TAT/SRT) ---
const PsychTest: React.FC<{ context: UserContext; addXp: (amount: number) => void; onBack: () => void; trackProgress: (type: 'topic' | 'task' | 'sim' | 'combat' | 'essay', id?: string) => void }> = ({ context, addXp, onBack, trackProgress }) => {
    const [testType, setTestType] = useState<'WAT' | 'TAT' | 'SRT' | null>(null);
    const [scenario, setScenario] = useState<{ prompt: string } | null>(null);
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const startTest = async (type: 'WAT' | 'TAT' | 'SRT') => {
        setTestType(type);
        setIsLoading(true);
        setIsFinished(false);
        try {
            const s = await getPsychTestScenario(context, type);
            setScenario(s);
            setTimer(type === 'WAT' ? 15 : type === 'TAT' ? 240 : 60);
            setIsActive(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let interval: any;
        if (isActive && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer === 0 && isActive) {
            handleSubmit();
        }
        return () => clearInterval(interval);
    }, [isActive, timer]);

    const handleSubmit = () => {
        setIsActive(false);
        addXp(30);
        setIsFinished(true);
        trackProgress('combat');
    };

    if (isLoading) return <LoadingState message="Calibrating Neural Interface..." />;

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <ShieldIcon className="w-20 h-20 text-teal-500 mb-6 animate-pulse" />
                <h2 className="text-4xl font-black text-white mb-4 font-display text-glow uppercase">Assessment Recorded</h2>
                <div className="hud-card p-8 max-w-lg w-full mb-8 bg-teal-900/10 border-teal-500/30">
                    <p className="text-slate-300 font-mono text-sm leading-relaxed uppercase tracking-widest">
                        Your response has been logged into the Strategic Analysis Engine. 
                        Strategos will evaluate your psychological profile in the next briefing.
                    </p>
                    <div className="mt-6 text-teal-400 font-bold tracking-[0.3em] text-xs">+30 XP AWARDED</div>
                </div>
                <button onClick={() => { setIsFinished(false); setTestType(null); }} className="hud-btn bg-teal-900/30 border border-teal-500/50 px-10 py-4 text-white font-bold uppercase tracking-widest hover:bg-teal-500/20">Return to Battery</button>
            </div>
        );
    }

    if (!testType) {
        return (
            <div className="pt-12 h-full flex flex-col items-center">
                <button onClick={onBack} className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
                    <ChevronLeftIcon className="w-4 h-4" /> Back
                </button>
                <h2 className="text-4xl font-black text-white mb-12 font-display tracking-widest text-glow uppercase">Psychological Battery</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-4">
                    {[
                        { id: 'WAT', title: 'Word Association', desc: '15 seconds per word. React instinctively.' },
                        { id: 'TAT', title: 'Thematic Apperception', desc: 'Write a story based on a vague scene.' },
                        { id: 'SRT', title: 'Situation Reaction', desc: 'How would you respond to this scenario?' },
                    ].map(t => (
                        <button key={t.id} onClick={() => startTest(t.id as any)} className="hud-card p-8 hover:bg-white/5 transition-all group text-center">
                            <BrainCircuitIcon className="w-12 h-12 text-teal-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white mb-2 font-display uppercase">{t.title}</h3>
                            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest leading-relaxed">{t.desc}</p>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto w-full pt-12 px-4">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-teal-400 font-display tracking-widest uppercase">{testType} TEST IN PROGRESS</h3>
                <div className={`font-mono text-2xl ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </div>
            </div>

            <div className="hud-card p-12 mb-8 text-center min-h-[300px] flex flex-col justify-center">
                {testType === 'WAT' ? (
                    <h1 className="text-7xl font-black text-white font-display tracking-tighter uppercase">{scenario?.prompt}</h1>
                ) : (
                    <p className="text-xl text-slate-200 leading-relaxed italic">"{scenario?.prompt}"</p>
                )}
            </div>

            <textarea
                value={response}
                onChange={e => setResponse(e.target.value)}
                placeholder="Type your response here..."
                className="w-full h-48 bg-slate-900 border border-slate-700 focus:border-teal-400 text-white p-6 clip-corner outline-none font-sans text-lg mb-8 resize-none"
                autoFocus
            />

            <button onClick={handleSubmit} className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-black font-bold uppercase tracking-widest clip-corner transition-all">
                Submit Response
            </button>
        </div>
    );
};

const LoadingState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <RadioIcon className="w-16 h-16 text-cyan-500 animate-pulse mb-6"/>
        <p className="font-mono text-xs tracking-[0.3em] uppercase">{message}</p>
    </div>
);

export default CombatZone;
