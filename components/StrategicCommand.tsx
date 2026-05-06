
import React, { useState, useEffect } from 'react';
import { getStrategicBriefing } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import type { UserContext } from '../types';
import { CommandIcon, BotIcon } from './icons';

interface StrategicCommandProps {
    addXp: (amount: number) => void;
    context: UserContext;
    trackProgress: (type: 'topic' | 'task' | 'sim' | 'combat' | 'essay', id?: string) => void;
}

const StrategicCommand: React.FC<StrategicCommandProps> = ({ addXp, context, trackProgress }) => {
    const [briefing, setBriefing] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isBriefingReceived, setIsBriefingReceived] = useState(false);

    const handleGetBriefing = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getStrategicBriefing(context);
            setBriefing(result);
            addXp(25);
            setIsBriefingReceived(true);
            trackProgress('task');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-8 h-full flex flex-col items-center">
            <h1 className="text-2xl md:text-4xl font-bold text-cyan-400 text-glow mb-2 text-center">Strategic Command Center</h1>
            <p className="text-md md:text-lg text-gray-400 mb-8 text-center">Daily briefing for <span className="text-orange-400 font-semibold">{context.label}</span>.</p>

            <div className="w-full max-w-4xl flex-grow bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 md:p-6 overflow-y-auto flex flex-col">
                {isLoading && (
                     <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <BotIcon className="w-12 h-16 text-cyan-500 animate-pulse mb-4"/>
                        <p>Generating briefing...</p>
                    </div>
                )}
                {error && <div className="m-auto bg-red-900/50 border border-red-500 text-red-300 p-3 rounded">{error}</div>}
                
                {briefing && (
                     <div className="markdown-body text-slate-200 leading-relaxed">
                        <ReactMarkdown>{briefing}</ReactMarkdown>
                     </div>
                )}

                {!isLoading && !briefing && !error && (
                    <div className="m-auto text-center">
                         <CommandIcon className="w-24 h-24 text-slate-700 mx-auto mb-4"/>
                        <h2 className="text-2xl font-bold text-gray-400 mb-4">Awaiting Command</h2>
                         <button
                            onClick={handleGetBriefing}
                            disabled={isBriefingReceived}
                            className="bg-orange-600 hover:bg-orange-500 disabled:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg glow-border border-orange-400"
                        >
                            {isBriefingReceived ? 'Briefing Received' : 'Generate Daily Briefing'}
                        </button>
                    </div>
                )}
            </div>
            {isBriefingReceived && !isLoading && <p className="text-sm text-yellow-400 mt-4 animate-pulse">+25 XP Awarded</p>}
        </div>
    );
};

export default StrategicCommand;
