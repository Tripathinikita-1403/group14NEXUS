
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { AIFeedback, UserContext, StudyContent, PracticeQuestion } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const parseAIResponse = <T>(response: GenerateContentResponse): T => {
    const text = response.text;
    if (!text) throw new Error("Empty AI response");
    
    try {
        // Clean markdown code blocks if present
        const cleaned = text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(cleaned) as T;
    } catch (e) {
        console.error("Failed to parse AI response:", text);
        throw new Error("Invalid response format from AI");
    }
};

export const getEssayFeedback = async (essay: string): Promise<AIFeedback> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0",
            contents: `Analyze the following text/essay. Provide constructive feedback on: 1. Structure, 2. Content, 3. Clarity. Provide an overall score out of 10. Also provide a list of specific text segments to highlight with suggestions for improvement.

            Text: "${essay}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        structure: { type: Type.STRING },
                        content: { type: Type.STRING },
                        clarity: { type: Type.STRING },
                        score: { type: Type.NUMBER },
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    textToHighlight: { type: Type.STRING },
                                    suggestion: { type: Type.STRING }
                                },
                                required: ['textToHighlight', 'suggestion']
                            }
                        }
                    },
                    required: ["structure", "content", "clarity", "score", "suggestions"],
                },
            },
        });

        return parseAIResponse<AIFeedback>(response);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        throw new Error("Failed to get feedback from AI.");
    }
};

export const getStrategicBriefing = async (context: UserContext): Promise<string> => {
    try {
        let prompt = "";
        
        if (context.category === 'SCHOOL') {
             prompt = `Generate a daily briefing for a school student in ${context.subCategory} ${context.detail}. Include: 1. Science Fact of the Day, 2. A Word of the Day (English), 3. A quick mental math puzzle.`;
        } else if (context.category === 'COLLEGE') {
             prompt = `Generate a daily briefing for a college student pursuing ${context.detail} (${context.subCategory}). Include: 1. Recent Industry Trend relevant to their field, 2. A productivity tip, 3. A general knowledge fact.`;
        } else {
             // Competitive
             prompt = `Generate a concise daily briefing for a ${context.detail} aspirant. Include: 1. Current Affairs summary (relevant to exam), 2. Key Concept refresher, 3. Motivation.`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        return response.text ? response.text.trim() : "";
    } catch (error) {
        console.error("Error fetching briefing:", error);
        throw new Error("Failed to get daily briefing.");
    }
};

export const getStudyMaterial = async (context: UserContext, topic: string): Promise<StudyContent> => {
    try {
        const contextStr = `${context.detail} (${context.subCategory})`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `Generate comprehensive study material for the topic "${topic}" specifically for a student in: ${contextStr}.
            
            Return JSON matching this structure:
            {
              "title": "Topic Name",
              "overview": "Concise summary.",
              "keyPoints": ["Point 1", "Point 2", ...],
              "examContext": "Why is this important for ${contextStr}? How is it usually asked? (Markdown supported)",
              "flashcards": [{"question": "Q?", "answer": "A"}]
            }`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        overview: { type: Type.STRING },
                        keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                        examContext: { type: Type.STRING },
                        flashcards: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: { question: { type: Type.STRING }, answer: { type: Type.STRING } },
                                required: ["question", "answer"]
                            }
                        }
                    },
                    required: ["title", "overview", "keyPoints", "examContext", "flashcards"]
                }
            }
        });

        return parseAIResponse<StudyContent>(response);

    } catch (error) {
        console.error("Error fetching study material:", error);
        throw new Error("Failed to retrieve data.");
    }
};

export const getPracticeQuestions = async (context: UserContext, topic: string): Promise<PracticeQuestion[]> => {
    try {
        const contextStr = `${context.detail} (${context.subCategory})`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `Generate 5 multiple-choice practice questions for "${topic}" suitable for ${contextStr}.
            
            Return JSON array:
            [
                { "id": "1", "question": "...", "options": ["A", "B", "C", "D"], "correctAnswerId": 0, "explanation": "..." }
            ]`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            question: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctAnswerId: { type: Type.INTEGER },
                            explanation: { type: Type.STRING }
                        },
                        required: ["id", "question", "options", "correctAnswerId", "explanation"]
                    }
                }
            }
        });

        return parseAIResponse<PracticeQuestion[]>(response);

    } catch (error) {
        console.error("Error fetching practice questions:", error);
        throw new Error("Failed to retrieve questions.");
    }
};

export const getGDTopic = async (context: UserContext): Promise<{ topic: string; background: string }> => {
    try {
        const contextStr = `${context.detail} (${context.subCategory})`;
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `Generate a relevant Group Discussion topic and a brief background for a student in: ${contextStr}.
            
            Return JSON:
            { "topic": "Topic Title", "background": "Brief context for the discussion." }`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topic: { type: Type.STRING },
                        background: { type: Type.STRING }
                    },
                    required: ["topic", "background"]
                }
            }
        });
        return parseAIResponse<{ topic: string; background: string }>(response);
    } catch (error) {
        console.error("Error fetching GD topic:", error);
        throw new Error("Failed to get GD topic.");
    }
};

export const getGDAgentResponse = async (topic: string, history: string, agentName: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `You are ${agentName} in a Group Discussion. 
            Topic: "${topic}"
            Discussion History:
            ${history}
            
            Respond naturally to the group. Keep it concise (2-3 sentences).`,
        });
        return response.text ? response.text.trim() : "";
    } catch (error) {
        console.error("Error fetching agent response:", error);
        return "I agree with the points being made, but we should also consider the practical implications.";
    }
};

export const getPsychTestScenario = async (context: UserContext, type: 'WAT' | 'TAT' | 'SRT'): Promise<{ prompt: string; imageUrl?: string }> => {
    try {
        let instruction = "";
        if (type === 'WAT') instruction = "Provide a single, evocative word for a Word Association Test.";
        if (type === 'TAT') instruction = "Provide a brief description of a vague, ambiguous scene for a Thematic Apperception Test (TAT).";
        if (type === 'SRT') instruction = "Provide a challenging social or military situation for a Situation Reaction Test (SRT).";

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `${instruction} Context: ${context.detail}. Return JSON: { "prompt": "..." }`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { prompt: { type: Type.STRING } },
                    required: ["prompt"]
                }
            }
        });
        return parseAIResponse<{ prompt: string; imageUrl?: string }>(response);
    } catch (error) {
        console.error("Error fetching Psych scenario:", error);
        throw new Error("Failed to get scenario.");
    }
};

export const getCombatChallenge = async (context: UserContext, mode: string): Promise<any> => {
    try {
        let prompt = "";
        let schema: any = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                questions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctAnswerId: { type: Type.INTEGER },
                            explanation: { type: Type.STRING }
                        },
                        required: ["question", "options", "correctAnswerId", "explanation"]
                    }
                }
            },
            required: ["title", "content", "questions"]
        };

        if (mode === 'VOCAB_VAULT') {
            prompt = `Generate a vocabulary challenge for a ${context.detail} student. Include 5 questions on synonyms, antonyms, or usage.`;
        } else if (mode === 'LOGIC_QUEST') {
            prompt = `Generate 5 logical reasoning or aptitude puzzles suitable for ${context.detail}.`;
        } else if (mode === 'PLACEMENT_PREP') {
            prompt = `Generate 5 placement-style aptitude questions (quantitative or logical) for a ${context.detail} student.`;
        } else if (mode === 'INDUSTRY_INSIGHTS') {
            prompt = `Provide a brief overview of a recent trend in ${context.detail} and 3 questions to test understanding.`;
        } else if (mode === 'FORMULA_SPRINT') {
            prompt = `Generate 5 challenges to identify or apply key formulas in ${context.detail} (Physics/Maths/Chemistry).`;
        } else if (mode === 'CASE_STUDY') {
            const upscContext = context.detail === 'UPSC' ? "UPSC Civil Services (Ethics, Integrity, and Aptitude)" : context.detail;
            prompt = `Provide a short ethical or administrative case study for a ${upscContext} aspirant and 3 questions on how to handle it. Focus on decision-making, public service values, and ethical dilemmas.`;
        } else if (mode === 'CURRENT_AFFAIRS') {
            const upscContext = context.detail === 'UPSC' ? "UPSC Civil Services (General Studies)" : context.detail;
            prompt = `Provide a summary of a major recent news event relevant to ${upscContext} and 3 questions about it. Focus on socio-economic impact, policy implications, and national/international significance.`;
        } else if (mode === 'PHARMA_BLITZ') {
            prompt = `Generate a high-speed pharmacology quiz for a B.Pharma student. Include 5 questions on drug classifications, mechanisms of action, and contraindications.`;
        } else if (mode === 'HOSPITALITY_ARENA') {
            prompt = `Generate a hospitality management challenge for a Hotel Management student. Include a short scenario about guest relations or kitchen management and 3-5 questions on how to handle it professionally.`;
        } else if (mode === 'MED_CHEM_CHALLENGE') {
            prompt = `Generate a medicinal chemistry challenge for a B.Pharma student. Include 5 questions on drug structures, synthesis pathways, and SAR (Structure-Activity Relationship).`;
        } else if (mode === 'CULINARY_PRO') {
            prompt = `Generate a culinary arts challenge for a Hotel Management student. Include 5 questions on world cuisines, cooking techniques, and kitchen safety.`;
        } else if (mode === 'NEET_BIO_BLITZ') {
            prompt = `Generate a high-speed biology challenge for a NEET aspirant. Include 5 questions on botany and zoology topics like genetics, human physiology, and plant reproduction.`;
        } else if (mode === 'NEET_CHEM_SPRINT') {
            prompt = `Generate a chemistry sprint for a NEET aspirant. Include 5 questions on organic, inorganic, and physical chemistry relevant to the NEET syllabus.`;
        } else if (mode === 'JEE_PHYSICS_ARENA') {
            prompt = `Generate a complex physics problem-solving challenge for a JEE aspirant. Include 5 questions on mechanics, electrodynamics, and modern physics.`;
        } else if (mode === 'JEE_MATHS_MASTERY') {
            prompt = `Generate an advanced mathematics challenge for a JEE aspirant. Include 5 questions on calculus, algebra, and coordinate geometry.`;
        } else if (mode === 'SSB_GTO_SIMULATOR') {
            prompt = `Generate a GTO (Group Testing Officer) task scenario for an SSB aspirant. Provide a short description of a group task (e.g., PGT, HGT) and 3-5 questions on strategic planning and group dynamics.`;
        } else if (mode === 'SSB_INTERVIEW_PREP') {
            prompt = `Generate a mock interview scenario for an SSB aspirant. Provide 5 common PIQ-based questions and tips on how to answer them with OLQs (Officer Like Qualities) in mind.`;
        } else if (mode === 'NDA_GAT_BLITZ') {
            prompt = `Generate a GAT (General Ability Test) blitz for an NDA aspirant. Include 5 questions covering English, Physics, Chemistry, and History.`;
        } else if (mode === 'NDA_MATHS_SPRINT') {
            prompt = `Generate a mathematics sprint for an NDA aspirant. Include 5 questions on algebra, trigonometry, and calculus.`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `${prompt} Return JSON.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });

        return parseAIResponse<any>(response);
    } catch (error) {
        console.error("Error fetching combat challenge:", error);
        throw new Error("Failed to load challenge.");
    }
};

export const getBuddyHint = async (context: UserContext, topic: string, question: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `You are a cute learning buddy. Provide a helpful, encouraging hint for the following question about "${topic}". 
            Question: "${question}"
            Keep it very short (1 sentence) and don't give away the answer directly.`,
        });
        return response.text ? response.text.trim() : "You've got this! Think about the core concept.";
    } catch (error) {
        console.error("Error fetching buddy hint:", error);
        return "Try looking at the key points again!";
    }
};

export async function* getMentorResponseStream(history: { role: 'user' | 'model', parts: { text: string }[] }[], newMessage: string, context: UserContext, mentor: { name: string, role: string, bio: string }) {
    try {
        const formattedHistory = history.map(msg => ({ role: msg.role, parts: msg.parts }));

        const chat = ai.chats.create({
            model: 'gemini-2.0-flash',
            history: formattedHistory,
            config: {
                systemInstruction: `You are ${mentor.name}, a ${mentor.role}.
                Bio: ${mentor.bio}
                User Profile: ${context.category} Student.
                Specific Context: ${context.subCategory}, ${context.detail}.
                
                Role: Provide expert mentorship, career guidance, and strategic advice based on your persona. 
                Be professional, insightful, and encouraging. Keep responses concise but impactful.
                Tone: Professional, futuristic, encouraging.
                Format: Use Markdown.`,
            },
        });

        const result = await chat.sendMessageStream({ message: newMessage });

        for await (const chunk of result) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error("Error in Mentor Stream:", error);
        yield "I apologize, but our neural link is experiencing interference. Please try again shortly.";
    }
}

export async function* getTutorResponseStream(history: { role: 'user' | 'model', parts: { text: string }[] }[], newMessage: string, context: UserContext) {
    try {
        const formattedHistory = history.map(msg => ({ role: msg.role, parts: msg.parts }));

        const chat = ai.chats.create({
            model: 'gemini-2.0-flash',
            history: formattedHistory,
            config: {
                systemInstruction: `You are 'Strategos', an advanced AI mentor.
                User Profile: ${context.category} Student.
                Specific Context: ${context.subCategory}, ${context.detail}.
                
                Role: Guide the student with strategies, explanations, and motivation relevant to their specific grade/degree/exam.
                Tone: Professional, futuristic, encouraging.
                Format: Use Markdown.`,
            },
        });

        const result = await chat.sendMessageStream({ message: newMessage });

        for await (const chunk of result) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error("Error in Tutor Stream:", error);
        throw new Error("Connection to Strategos interrupted.");
    }
}

export async function* getSimulationStream(context: UserContext, newMessage: string, history: { role: 'user' | 'model', text: string }[], systemInstruction: string) {
    try {
        const formattedHistory = history.map(msg => ({ 
            role: msg.role, 
            parts: [{ text: msg.text }] 
        }));

        const chat = ai.chats.create({
            model: 'gemini-2.0-flash',
            history: formattedHistory,
            config: {
                systemInstruction: `${systemInstruction}
                User Profile: ${context.category} Student.
                Specific Context: ${context.subCategory}, ${context.detail}.`,
            },
        });

        const result = await chat.sendMessageStream({ message: newMessage });

        for await (const chunk of result) {
            if (chunk.text) {
                yield chunk.text;
            }
        }
    } catch (error) {
        console.error("Error in Simulation Stream:", error);
    }
}
