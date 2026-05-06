import React, { useState, useMemo } from 'react';
import { getEssayFeedback } from '../services/geminiService';
import type { AIFeedback, Suggestion } from '../types';
import { BotIcon, BookOpenIcon } from './icons';

interface MainsManifestProps {
    addXp: (amount: number) => void;
    trackProgress: (type: 'topic' | 'task' | 'sim' | 'combat' | 'essay', id?: string) => void;
}

const MainsManifest: React.FC<MainsManifestProps> = ({ addXp, trackProgress }) => {
    const [isBookOpen, setIsBookOpen] = useState(false);
    const [essay, setEssay] = useState('');
    const [feedback, setFeedback] = useState<AIFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetFeedback = async () => {
        if (!essay.trim()) {
            setError('Please write an essay before requesting feedback.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setFeedback(null);
        try {
            const result = await getEssayFeedback(essay);
            setFeedback(result);
            if (result.score) {
                addXp(Math.round(result.score * 10)); // Award 10 XP per score point
                trackProgress('essay');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isBookOpen) {
        return (
            <div className="w-full h-full flex items-center justify-center p-2">
                <div 
                    className="w-full md:w-2/3 max-w-4xl h-auto md:h-2/3 aspect-video md:aspect-auto bg-slate-800 border-2 border-cyan-500/30 rounded-lg flex flex-col items-center justify-center text-center p-4 md:p-8 cursor-pointer group hover:border-cyan-400 transition-all duration-300 transform hover:scale-105"
                    onClick={() => setIsBookOpen(true)}
                >
                    <BookOpenIcon className="w-16 h-16 md:w-24 md:h-24 text-cyan-400 mb-6 transition-transform duration-300 group-hover:scale-110" />
                    <h1 className="text-2xl md:text-4xl font-bold text-cyan-400 text-glow mb-2">Mains Manifest</h1>
                    <p className="text-md md:text-lg text-gray-400 mb-8">Open the tome and forge your arguments. AI awaits to guide your hand.</p>
                    <button className="bg-cyan-600 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg text-base md:text-lg">
                        Begin Writing
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-1 md:p-4 h-full flex flex-col pt-8">
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 text-glow mb-2 text-center">Mains Manifest</h1>
            <p className="text-md md:text-lg text-gray-400 mb-4 md:mb-8 text-center">Hone your writing skills with AI-powered analysis.</p>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="flex flex-col">
                     <div className="w-full flex-grow p-4 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-200 overflow-y-auto min-h-[300px] lg:min-h-0">
                        {feedback ? (
                            <AnalyzedEssay essay={essay} suggestions={feedback.suggestions} />
                        ) : (
                            <textarea
                                className="w-full h-full bg-transparent border-none focus:outline-none resize-none"
                                placeholder="Write your essay here..."
                                value={essay}
                                onChange={(e) => setEssay(e.target.value)}
                                disabled={isLoading}
                            />
                        )}
                    </div>
                    <button
                        onClick={handleGetFeedback}
                        disabled={isLoading}
                        className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white font-bold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <BotIcon className="w-5 h-5"/>
                                Get AI Feedback
                            </>
                        )}
                    </button>
                </div>

                <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 md:p-6 overflow-y-auto min-h-[300px] lg:min-h-0">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-4">Feedback Analysis</h2>
                    {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded">{error}</div>}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                           <BotIcon className="w-12 h-12 md:w-16 md:h-16 text-cyan-500 animate-pulse mb-4"/>
                            <p>Our AI is examining your work...</p>
                            <p className="text-sm">This may take a moment.</p>
                        </div>
                    )}
                    {feedback && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg md:text-xl font-semibold text-cyan-400">Overall Score</h3>
                                <p className={`text-2xl md:text-3xl font-bold ${feedback.score > 7 ? 'text-green-400' : feedback.score > 4 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {feedback.score.toFixed(1)} / 10
                                </p>
                            </div>
                            <FeedbackSection title="Structure & Coherence" content={feedback.structure} />
                            <FeedbackSection title="Content & Argumentation" content={feedback.content} />
                            <FeedbackSection title="Clarity & Language" content={feedback.clarity} />
                        </div>
                    )}
                     {!isLoading && !feedback && !error && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                             <p>Your feedback will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AnalyzedEssay: React.FC<{essay: string; suggestions: Suggestion[]}> = ({ essay, suggestions }) => {
    const [tooltip, setTooltip] = useState<{content: string; x: number; y: number} | null>(null);

    const highlightedEssay = useMemo(() => {
        let text = essay;
        suggestions.forEach(s => {
            // A more robust regex to avoid replacing parts of words
            const regex = new RegExp(`\\b${s.textToHighlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'g');
            text = text.replace(regex, `<span class="highlight-ar" data-suggestion="${s.suggestion}">${s.textToHighlight}</span>`);
        });
        return { __html: text };
    }, [essay, suggestions]);

    const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('highlight-ar')) {
            const suggestion = target.getAttribute('data-suggestion');
            if (suggestion) {
                setTooltip({ content: suggestion, x: e.clientX, y: e.clientY });
            }
        }
    };

    const handleMouseOut = () => {
        setTooltip(null);
    };

    return (
        <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} className="whitespace-pre-wrap leading-relaxed">
            <div dangerouslySetInnerHTML={highlightedEssay} />
            {tooltip && (
                <div 
                    className="fixed bg-slate-900 border border-cyan-400 text-white text-sm rounded-lg py-2 px-3 z-50 max-w-xs shadow-lg"
                    style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
};


interface FeedbackSectionProps {
    title: string;
    content: string;
}
const FeedbackSection: React.FC<FeedbackSectionProps> = ({ title, content }) => (
    <div>
        <h4 className="text-lg font-semibold text-gray-200 border-b-2 border-cyan-500/30 pb-1 mb-2">{title}</h4>
        <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
    </div>
);

export default MainsManifest;