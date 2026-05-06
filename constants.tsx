
import React from 'react';
import type { Rank, Badge, SyllabusNode, SyllabusLink, NexusModule, StudyTopic, UserContext } from './types';
import { BookOpenIcon, TargetIcon, BrainCircuitIcon, ScaleIcon, AtomIcon, UsersIcon, MessageSquareIcon, BotIcon, TrophyIcon, BriefcaseIcon, ShieldIcon, CommandIcon, ArchiveIcon, MicrochipIcon, LayoutDashboardIcon, RadioIcon } from './components/icons';

export const RANKS: Rank[] = [
  { name: 'Cadet', icon: <div className="w-4 h-4 rounded-full bg-gray-500"></div> },
  { name: 'Specialist', icon: <div className="w-4 h-4 rounded-full bg-green-500"></div> },
  { name: 'Strategist', icon: <div className="w-4 h-4 rounded-full bg-blue-500"></div> },
  { name: 'Commander', icon: <div className="w-4 h-4 rounded-full bg-purple-500"></div> },
  { name: 'Grandmaster', icon: <div className="w-4 h-4 rounded-full bg-yellow-400"></div> },
];

export const BADGES: Badge[] = [
  { name: 'Foundations First', description: 'Completed 10 introductory modules.', icon: <BookOpenIcon className="w-8 h-8 text-cyan-400" /> },
  { name: 'Quiz Master', description: 'Scored 90%+ on 5 quizzes.', icon: <TargetIcon className="w-8 h-8 text-green-400" /> },
  { name: 'Critical Thinker', description: 'Solved 5 logic grid challenges.', icon: <BrainCircuitIcon className="w-8 h-8 text-purple-400" /> },
  { name: 'Subject Master', description: 'Mastered all topics in a core subject.', icon: <BriefcaseIcon className="w-8 h-8 text-yellow-400" /> },
  { name: 'Task Titan', description: 'Completed 50 strategic command tasks.', icon: <ShieldIcon className="w-8 h-8 text-red-400" /> },
  { name: 'Simulation Ace', description: 'Successfully completed 10 Simu-Labs.', icon: <AtomIcon className="w-8 h-8 text-indigo-400" /> },
  { name: 'Combat Veteran', description: 'Survived 20 Combat Zone challenges.', icon: <TrophyIcon className="w-8 h-8 text-orange-400" /> },
  { name: 'Essayist', description: 'Authored 5 AI-evaluated essays.', icon: <MessageSquareIcon className="w-8 h-8 text-pink-400" /> },
];

// Master list of all available modules
const ALL_NEXUS_MODULES: NexusModule[] = [
    { id: 'neural_mentor', title: 'Neural Mentor', description: 'Interact with Strategos, your AI tutor, for personalized guidance and doubt resolution.', icon: <MicrochipIcon className="w-12 h-12 mx-auto text-violet-400" />, view: 'NeuralMentor' },
    { id: 'study_vault', title: 'Archives of Ascendance', description: 'Comprehensive study materials, notes, and context for your entire syllabus.', icon: <ArchiveIcon className="w-12 h-12 mx-auto text-pink-400" />, view: 'StudyVault' },
    { id: 'strategic_command', title: 'Strategic Command', description: 'Receive daily AI-generated briefings tailored to your exam.', icon: <CommandIcon className="w-12 h-12 mx-auto text-orange-400" />, view: 'StrategicCommand' },
    { id: 'constellation', title: 'Knowledge Constellation', description: 'Explore the vast syllabus as an interconnected map of topics.', icon: <BrainCircuitIcon className="w-12 h-12 mx-auto text-cyan-400" />, view: 'Constellation' },
    { id: 'combat_zone', title: 'Combat Zone', description: 'Test your skills in simulated exam environments.', icon: <TargetIcon className="w-12 h-12 mx-auto text-red-400" />, view: 'CombatZone' },
    { id: 'simu_lab', title: 'Simu-Labs', description: 'Engage with interactive learning modules and simulations.', icon: <AtomIcon className="w-12 h-12 mx-auto text-yellow-400" />, view: 'SimuLab' },
    { id: 'mains_manifest', title: 'Mains Manifest', description: 'Practice essay writing with AI-powered feedback.', icon: <BookOpenIcon className="w-12 h-12 mx-auto text-green-400" />, view: 'MainsManifest' },
    { id: 'mentorship', title: 'Mentorship Hub', description: 'Connect with expert mentors for guidance and strategy.', icon: <MessageSquareIcon className="w-12 h-12 mx-auto text-blue-400" />, view: 'MentorshipHub' },
];

// --- DYNAMIC MODULE RESOLVERS ---

export const getNexusModules = (context: UserContext): NexusModule[] => {
    // Modules everyone gets
    const baseModules = ['neural_mentor', 'study_vault', 'strategic_command', 'constellation', 'combat_zone', 'simu_lab'];
    
    // Conditional modules
    const extraModules: string[] = [];
    
    // Mains Manifest (Essay) is primarily for UPSC
    if (context.detail === 'UPSC') {
        extraModules.push('mains_manifest');
    }

    // Mentorship for everyone, but we keep it optional or at end
    extraModules.push('mentorship');

    const allowedIds = [...baseModules, ...extraModules];
    return ALL_NEXUS_MODULES.filter(m => allowedIds.includes(m.id));
};

export const getSimuLabModules = (context: UserContext) => {
    const allLabs = [
        { id: 'policy_matrix', title: 'Policy & Governance Matrix', description: 'Scenario-based policy-making simulations.', icon: <ScaleIcon className="w-10 h-10 text-yellow-300" />, view: 'VirtualLab' },
        { id: 'logic_grid', title: 'Logic & Reasoning Grid', description: 'Puzzle-based challenges for aptitude.', icon: <BrainCircuitIcon className="w-10 h-10 text-purple-300" />, view: 'VirtualLab' },
        { id: 'pharma_lab', title: 'Virtual Pharma Lab', description: 'Simulate drug synthesis and chemical reactions.', icon: <AtomIcon className="w-10 h-10 text-indigo-300" />, view: 'VirtualLab' },
        { id: 'drug_discovery_sim', title: 'Drug Discovery Sim', description: 'Explore the process of identifying new drug candidates.', icon: <BrainCircuitIcon className="w-10 h-10 text-cyan-300" />, view: 'VirtualLab' },
        { id: 'kitchen_sim', title: 'Virtual Kitchen Sim', description: 'Master culinary techniques in a virtual environment.', icon: <BriefcaseIcon className="w-10 h-10 text-orange-300" />, view: 'VirtualLab' },
        { id: 'hotel_ops_sim', title: 'Hotel Operations Sim', description: 'Manage front office and guest relations in a virtual hotel.', icon: <UsersIcon className="w-10 h-10 text-teal-300" />, view: 'VirtualLab' },
        { id: 'neet_bio_lab', title: 'NEET Biology Lab', description: 'Simulate biological processes and anatomical structures.', icon: <AtomIcon className="w-10 h-10 text-green-400" />, view: 'VirtualLab' },
        { id: 'neet_chem_lab', title: 'NEET Chemistry Lab', description: 'Interactive chemical reaction simulations for NEET.', icon: <AtomIcon className="w-10 h-10 text-blue-400" />, view: 'VirtualLab' },
        { id: 'jee_physics_lab', title: 'JEE Physics Lab', description: 'Advanced mechanics and electromagnetism simulations.', icon: <AtomIcon className="w-10 h-10 text-red-400" />, view: 'VirtualLab' },
        { id: 'jee_chem_lab', title: 'JEE Chemistry Lab', description: 'Complex chemical bonding and thermodynamics simulations.', icon: <AtomIcon className="w-10 h-10 text-orange-400" />, view: 'VirtualLab' },
        { id: 'ssb_psych_sim', title: 'SSB Psych Sim', description: 'Simulated environment for psychological assessment.', icon: <BrainCircuitIcon className="w-10 h-10 text-purple-400" />, view: 'VirtualLab' },
        { id: 'nda_defence_sim', title: 'NDA Defence Sim', description: 'Strategic defence and tactical simulations.', icon: <ShieldIcon className="w-10 h-10 text-slate-400" />, view: 'VirtualLab' },
        { id: 'cds_strategic_sim', title: 'CDS Strategic Sim', description: 'Advanced military strategy and leadership simulations.', icon: <ShieldIcon className="w-10 h-10 text-blue-500" />, view: 'VirtualLab' },
        { id: 'upsc_ethics_sim', title: 'UPSC Ethics Sim', description: 'Case-study based ethical decision making simulations.', icon: <ScaleIcon className="w-10 h-10 text-yellow-500" />, view: 'VirtualLab' },
        { id: 'upsc_gov_lab', title: 'Governance Lab', description: 'Simulate administrative and governance scenarios.', icon: <UsersIcon className="w-10 h-10 text-cyan-500" />, view: 'VirtualLab' },
    ];

    // Filter Logic
    let allowedIds: string[] = [];
    
    const isPharma = context.detail === 'BPHARMA';
    const isHM = context.detail === 'HM';
    const isNEET = context.detail === 'NEET';
    const isJEE = context.detail === 'JEE';
    const isSSB = context.detail === 'SSB';
    const isNDA = context.detail === 'NDA';
    const isCDS = context.detail === 'CDS';
    const isUPSC = context.detail === 'UPSC';

    if (!isPharma && !isHM && !isNEET && !isJEE && !isSSB && !isNDA && !isCDS && !isUPSC) {
        allowedIds.push('logic_grid'); // Everyone except specific ones gets logic/aptitude
    }

    const hasPolity = isUPSC || (context.category === 'COLLEGE' && context.detail.includes('Law'));

    if (hasPolity) allowedIds.push('policy_matrix');
    if (isPharma) allowedIds.push('pharma_lab', 'drug_discovery_sim');
    if (isHM) allowedIds.push('kitchen_sim', 'hotel_ops_sim');
    if (isNEET) allowedIds.push('neet_bio_lab', 'neet_chem_lab');
    if (isJEE) allowedIds.push('jee_physics_lab', 'jee_chem_lab');
    if (isSSB) allowedIds.push('ssb_psych_sim');
    if (isNDA) allowedIds.push('nda_defence_sim');
    if (isCDS) allowedIds.push('cds_strategic_sim');
    if (isUPSC) allowedIds.push('upsc_ethics_sim', 'upsc_gov_lab');
    
    // Fallback: Show all for competitive if logic is too strict
    if (context.category === 'COMPETITIVE') return allLabs.filter(l => allowedIds.includes(l.id));
    
    return allLabs.filter(l => allowedIds.includes(l.id));
};

export const getCombatZoneModules = (context: UserContext) => {
    const allCombat = [
        { id: 'prelims_blitz', title: 'Knowledge Blitz', description: 'Timed, adaptive quizzes mirroring exam patterns.', icon: <TargetIcon className="w-10 h-10 text-red-400" />, view: undefined },
        { id: 'gd_arena', title: 'Group Discussion Arena', description: 'Virtual rooms for simulated group discussions.', icon: <UsersIcon className="w-10 h-10 text-blue-400" />, view: undefined },
        { id: 'psych_test', title: 'Psychological Test Interface', description: 'Interactive OIR, WAT, and TAT simulations.', icon: <BotIcon className="w-10 h-10 text-teal-400" />, view: undefined },
        { id: 'vocab_vault', title: 'Vocab Warrior', description: 'Master language with high-speed vocabulary challenges.', icon: <BookOpenIcon className="w-10 h-10 text-yellow-400" />, view: undefined },
        { id: 'logic_quest', title: 'Logic Lab', description: 'Sharpen your mind with complex logical puzzles.', icon: <BrainCircuitIcon className="w-10 h-10 text-purple-400" />, view: undefined },
        { id: 'placement_prep', title: 'Placement Pro', description: 'Master aptitude and reasoning for top-tier placements.', icon: <BriefcaseIcon className="w-10 h-10 text-cyan-400" />, view: undefined },
        { id: 'industry_insights', title: 'Industry Intel', description: 'Stay ahead with deep dives into field-specific trends.', icon: <LayoutDashboardIcon className="w-10 h-10 text-orange-400" />, view: undefined },
        { id: 'case_study', title: 'Ethics Case Study', description: 'Analyze complex administrative and ethical scenarios.', icon: <ShieldIcon className="w-10 h-10 text-green-400" />, view: undefined },
        { id: 'current_affairs', title: 'Current Affairs Blitz', description: 'Test your knowledge on recent global and national events.', icon: <RadioIcon className="w-10 h-10 text-pink-400" />, view: undefined },
        { id: 'formula_sprint', title: 'Formula Forge', description: 'High-speed identification and application of core formulas.', icon: <AtomIcon className="w-10 h-10 text-indigo-400" />, view: undefined },
        { id: 'pharma_blitz', title: 'Pharma Knowledge Blitz', description: 'Test your knowledge of drugs and interactions.', icon: <ShieldIcon className="w-10 h-10 text-teal-500" />, view: undefined },
        { id: 'med_chem_challenge', title: 'Med-Chem Challenge', description: 'Identify structures and synthesis pathways.', icon: <AtomIcon className="w-10 h-10 text-indigo-500" />, view: undefined },
        { id: 'hospitality_arena', title: 'Hospitality Excellence', description: 'Case studies and scenarios for hotel management.', icon: <UsersIcon className="w-10 h-10 text-orange-500" />, view: undefined },
        { id: 'culinary_pro', title: 'Culinary Pro', description: 'Test your knowledge of world cuisines and techniques.', icon: <BriefcaseIcon className="w-10 h-10 text-yellow-500" />, view: undefined },
        { id: 'neet_bio_blitz', title: 'NEET Bio Blitz', description: 'High-speed biology questions for NEET aspirants.', icon: <AtomIcon className="w-10 h-10 text-green-500" />, view: undefined },
        { id: 'neet_chem_sprint', title: 'NEET Chem Sprint', description: 'Master chemistry concepts with timed sprints.', icon: <AtomIcon className="w-10 h-10 text-blue-500" />, view: undefined },
        { id: 'jee_physics_arena', title: 'JEE Physics Arena', description: 'Complex physics problem solving for JEE.', icon: <AtomIcon className="w-10 h-10 text-red-500" />, view: undefined },
        { id: 'jee_maths_mastery', title: 'JEE Maths Mastery', description: 'Advanced mathematics challenges for JEE.', icon: <BrainCircuitIcon className="w-10 h-10 text-indigo-500" />, view: undefined },
        { id: 'ssb_gto_simulator', title: 'SSB GTO Simulator', description: 'Simulated group tasks and strategic planning.', icon: <UsersIcon className="w-10 h-10 text-teal-500" />, view: undefined },
        { id: 'ssb_interview_prep', title: 'SSB Interview Coach', description: 'AI-powered mock interviews and feedback.', icon: <MessageSquareIcon className="w-10 h-10 text-blue-500" />, view: undefined },
        { id: 'nda_gat_blitz', title: 'NDA GAT Blitz', description: 'Comprehensive GAT practice for NDA.', icon: <ShieldIcon className="w-10 h-10 text-slate-500" />, view: undefined },
        { id: 'nda_maths_sprint', title: 'NDA Maths Sprint', description: 'Timed mathematics challenges for NDA.', icon: <BrainCircuitIcon className="w-10 h-10 text-cyan-500" />, view: undefined },
    ];

    const isPharma = context.detail === 'BPHARMA';
    const isHM = context.detail === 'HM';
    const isNEET = context.detail === 'NEET';
    const isJEE = context.detail === 'JEE';
    const isSSB = context.detail === 'SSB';
    const isNDA = context.detail === 'NDA';
    const isCDS = context.detail === 'CDS';
    const isUPSC = context.detail === 'UPSC';

    let allowedIds: string[] = [];
    
    if (!isPharma && !isHM && !isNEET && !isJEE && !isSSB && !isNDA) {
        allowedIds.push('prelims_blitz');
    }

    if (isCDS) {
        allowedIds.push('gd_arena', 'psych_test');
    } else if (context.category === 'SCHOOL') {
        allowedIds.push('vocab_vault', 'logic_quest');
    } else if (context.category === 'COLLEGE') {
        if (!isPharma && !isHM) {
            allowedIds.push('placement_prep', 'industry_insights');
        }
        if (isPharma) allowedIds.push('pharma_blitz', 'med_chem_challenge');
        if (isHM) allowedIds.push('hospitality_arena', 'culinary_pro');
    } else if (isUPSC) {
        allowedIds.push('case_study', 'current_affairs');
    } else if (isNEET) {
        allowedIds.push('neet_bio_blitz', 'neet_chem_sprint');
    } else if (isJEE) {
        allowedIds.push('jee_physics_arena', 'jee_maths_mastery');
    } else if (isSSB) {
        allowedIds.push('ssb_gto_simulator', 'ssb_interview_prep');
    } else if (isNDA) {
        allowedIds.push('nda_gat_blitz', 'nda_maths_sprint');
    }

    return allCombat.filter(m => allowedIds.includes(m.id));
};

export const LEADERBOARD_DATA = [
    { rank: 1, name: 'Aspirant-Alpha', xp: 5250, avatar: 'https://i.pravatar.cc/40?u=alpha' },
    { rank: 2, name: 'Aspirant-Beta', xp: 4800, avatar: 'https://i.pravatar.cc/40?u=beta' },
    { rank: 3, name: 'Aspirant-Gamma', xp: 4550, avatar: 'https://i.pravatar.cc/40?u=gamma' },
    { rank: 4, name: 'Aspirant-01', xp: 4350, avatar: `https://picsum.photos/seed/zenith/40` },
    { rank: 5, name: 'Aspirant-Delta', xp: 4100, avatar: 'https://i.pravatar.cc/40?u=delta' },
    { rank: 6, name: 'Aspirant-Epsilon', xp: 3850, avatar: 'https://i.pravatar.cc/40?u=epsilon' },
];

// --- EDUCATIONAL CATEGORY DATA ---

export const EDUCATION_CATEGORIES = [
    { id: 'SCHOOL', label: 'School Education', icon: <BookOpenIcon className="w-12 h-12 text-yellow-300"/>, desc: 'Classes 6th to 12th' },
    { id: 'COLLEGE', label: 'College / University', icon: <BriefcaseIcon className="w-12 h-12 text-cyan-300"/>, desc: 'Undergraduate Degrees' },
    { id: 'COMPETITIVE', label: 'Competitive Exams', icon: <TargetIcon className="w-12 h-12 text-red-300"/>, desc: 'UPSC, JEE, NEET, Defence' }
];

export const SCHOOL_BOARDS = [
    { id: 'CBSE', label: 'CBSE Board' },
    { id: 'ICSE', label: 'ICSE Board' },
    { id: 'UP_BOARD', label: 'UP Board' }
];

export const SCHOOL_GRADES = [
    { id: 'CLASS_6', label: 'Class 6' },
    { id: 'CLASS_7', label: 'Class 7' },
    { id: 'CLASS_8', label: 'Class 8' },
    { id: 'CLASS_9', label: 'Class 9' },
    { id: 'CLASS_10', label: 'Class 10' },
    { id: 'CLASS_11', label: 'Class 11' },
    { id: 'CLASS_12', label: 'Class 12' },
];

export const COLLEGE_DEGREES = [
    { id: 'BTECH', label: 'B.Tech / B.E' },
    { id: 'BCOM', label: 'B.Com' },
    { id: 'BPHARMA', label: 'B.Pharma' },
    { id: 'HM', label: 'Hotel Management' }
];

export const COMPETITIVE_EXAMS = [
    { id: 'UPSC', label: 'UPSC Civil Services' },
    { id: 'CDS', label: 'CDS (Defence)' },
    { id: 'NDA', label: 'NDA (Defence)' },
    { id: 'SSB', label: 'SSB Interview' },
    { id: 'JEE', label: 'JEE (Engineering)' },
    { id: 'NEET', label: 'NEET (Medical)' }
];

// --- EXPANDED SYLLABUS DATABASE ---

const COMMON_SCHOOL_SUBJECTS = [
    { id: 'maths', title: 'Mathematics', subtopics: [{ id: 'algebra', title: 'Algebra' }, { id: 'geometry', title: 'Geometry' }, { id: 'arithmetic', title: 'Arithmetic' }] },
    { id: 'science', title: 'Science', subtopics: [{ id: 'physics', title: 'Physics' }, { id: 'chemistry', title: 'Chemistry' }, { id: 'biology', title: 'Biology' }] },
    { id: 'english', title: 'English', subtopics: [{ id: 'grammar', title: 'Grammar' }, { id: 'literature', title: 'Literature' }] },
    { id: 'sst', title: 'Social Studies', subtopics: [{ id: 'history', title: 'History' }, { id: 'geography', title: 'Geography' }, { id: 'civics', title: 'Civics' }] },
    { id: 'hindi', title: 'Hindi', subtopics: [{ id: 'vyakaran', title: 'Vyakaran' }, { id: 'sahitya', title: 'Sahitya' }] },
];

const SENIOR_SCHOOL_SUBJECTS_SCIENCE = [
    { id: 'physics', title: 'Physics', subtopics: [{ id: 'mechanics', title: 'Mechanics' }, { id: 'thermodynamics', title: 'Thermodynamics' }, { id: 'optics', title: 'Optics' }] },
    { id: 'chemistry', title: 'Chemistry', subtopics: [{ id: 'physical_chem', title: 'Physical Chemistry' }, { id: 'organic_chem', title: 'Organic Chemistry' }] },
    { id: 'maths', title: 'Mathematics', subtopics: [{ id: 'calculus', title: 'Calculus' }, { id: 'vectors', title: 'Vectors & 3D' }] },
    { id: 'biology', title: 'Biology', subtopics: [{ id: 'genetics', title: 'Genetics' }, { id: 'human_physio', title: 'Human Physiology' }] },
    { id: 'computer_science', title: 'Computer Science', subtopics: [{ id: 'programming', title: 'Programming (Python/C++)' }, { id: 'dbms', title: 'DBMS' }] },
];

export const SYLLABUS_DATABASE: Record<string, StudyTopic[]> = {
    // --- COMPETITIVE ---
    UPSC: [
        { id: 'history', title: 'History', subtopics: [{ id: 'ancient', title: 'Ancient India' }, { id: 'modern', title: 'Modern India' }] },
        { id: 'geography', title: 'Geography', subtopics: [{ id: 'physical', title: 'Physical Geography' }, { id: 'indian', title: 'Indian Geography' }] },
        { id: 'polity', title: 'Polity', subtopics: [{ id: 'constitution', title: 'Constitution' }, { id: 'parliament', title: 'Parliament' }] },
        { id: 'economy', title: 'Economy', subtopics: [{ id: 'macro', title: 'Macroeconomics' }, { id: 'budget', title: 'Budget & Survey' }] },
        { id: 'ethics', title: 'Ethics (GS4)', subtopics: [{ id: 'integrity', title: 'Integrity & Aptitude' }] },
    ],
    CDS: [
        { id: 'english', title: 'English', subtopics: [{ id: 'grammar', title: 'Grammar' }, { id: 'vocab', title: 'Vocabulary' }] },
        { id: 'gk', title: 'General Knowledge', subtopics: [{ id: 'defense', title: 'Defense Affairs' }, { id: 'current', title: 'Current Events' }] },
        { id: 'maths', title: 'Elementary Maths', subtopics: [{ id: 'arithmetic', title: 'Arithmetic' }, { id: 'trig', title: 'Trigonometry' }] },
    ],
    NDA: [
        { id: 'maths', title: 'Mathematics', subtopics: [{ id: 'algebra', title: 'Algebra' }, { id: 'calc', title: 'Calculus' }] },
        { id: 'gat', title: 'General Ability Test', subtopics: [{ id: 'english', title: 'English' }, { id: 'physics', title: 'Physics' }, { id: 'history', title: 'History' }] },
    ],
    SSB: [
        { id: 'screening', title: 'Screening (Stage 1)', subtopics: [{ id: 'oir', title: 'OIR Test' }, { id: 'ppdt', title: 'PPDT' }] },
        { id: 'psych', title: 'Psychology Tests', subtopics: [{ id: 'tat', title: 'TAT' }, { id: 'wat', title: 'WAT' }, { id: 'srt', title: 'SRT' }] },
        { id: 'gto', title: 'GTO Tasks', subtopics: [{ id: 'gd', title: 'Group Discussion' }, { id: 'pgt', title: 'PGT' }, { id: 'io', title: 'Individual Obstacles' }] },
        { id: 'interview', title: 'Personal Interview', subtopics: [{ id: 'piq', title: 'PIQ Form' }, { id: 'current_affairs', title: 'Current Affairs' }] },
    ],
    JEE: [
         { id: 'physics', title: 'Physics', subtopics: [{ id: 'mech', title: 'Mechanics' }, { id: 'electrodyn', title: 'Electrodynamics' }] },
         { id: 'chemistry', title: 'Chemistry', subtopics: [{ id: 'physical', title: 'Physical' }, { id: 'organic', title: 'Organic' }, { id: 'inorganic', title: 'Inorganic' }] },
         { id: 'maths', title: 'Mathematics', subtopics: [{ id: 'calculus', title: 'Calculus' }, { id: 'algebra', title: 'Algebra' }, { id: 'coordinate', title: 'Coordinate Geometry' }] },
    ],
    NEET: [
        { id: 'physics', title: 'Physics', subtopics: [{ id: 'mech', title: 'Mechanics' }, { id: 'optics', title: 'Optics' }] },
        { id: 'chemistry', title: 'Chemistry', subtopics: [{ id: 'organic', title: 'Organic' }, { id: 'inorganic', title: 'Inorganic' }] },
        { id: 'biology', title: 'Biology', subtopics: [{ id: 'botany', title: 'Botany' }, { id: 'zoology', title: 'Zoology' }] },
    ],

    // --- COLLEGE ---
    BTECH: [
        { id: 'eng_maths', title: 'Engineering Mathematics', subtopics: [{ id: 'la', title: 'Linear Algebra' }, { id: 'calc', title: 'Calculus' }] },
        { id: 'cs_core', title: 'Computer Science Core', subtopics: [{ id: 'dsa', title: 'Data Structures' }, { id: 'os', title: 'Operating Systems' }, { id: 'networks', title: 'Computer Networks' }] },
        { id: 'electronics', title: 'Basic Electronics', subtopics: [{ id: 'circuits', title: 'Circuit Theory' }] },
    ],
    BSC: [
        { id: 'physics', title: 'Physics', subtopics: [{ id: 'quantum', title: 'Quantum Mechanics' }] },
        { id: 'maths', title: 'Mathematics', subtopics: [{ id: 'analysis', title: 'Real Analysis' }] },
        { id: 'chem', title: 'Chemistry', subtopics: [{ id: 'spectroscopy', title: 'Spectroscopy' }] },
    ],
    BPHARMA: [
        { id: 'pharmaceutics', title: 'Pharmaceutics', subtopics: [{ id: 'dosage', title: 'Dosage Forms' }, { id: 'physical_pharm', title: 'Physical Pharmaceutics' }, { id: 'pharm_eng', title: 'Pharmaceutical Engineering' }] },
        { id: 'pharmacology', title: 'Pharmacology', subtopics: [{ id: 'drugs', title: 'Drug Interactions' }, { id: 'pk_pd', title: 'Pharmacokinetics & Pharmacodynamics' }] },
        { id: 'med_chem', title: 'Medicinal Chemistry', subtopics: [{ id: 'synthesis', title: 'Drug Synthesis' }, { id: 'sar', title: 'Structure-Activity Relationship' }] },
        { id: 'pharmacognosy', title: 'Pharmacognosy', subtopics: [{ id: 'natural_products', title: 'Natural Products' }, { id: 'herbal_drugs', title: 'Herbal Drugs' }] },
        { id: 'pharm_analysis', title: 'Pharmaceutical Analysis', subtopics: [{ id: 'spectroscopy', title: 'Spectroscopy' }, { id: 'chromatography', title: 'Chromatography' }] },
    ],
    BCOM: [
        { id: 'accounting', title: 'Financial Accounting', subtopics: [] },
        { id: 'economics', title: 'Micro & Macro Economics', subtopics: [] },
        { id: 'business_law', title: 'Business Law', subtopics: [] },
        { id: 'taxation', title: 'Taxation', subtopics: [] },
    ],
    BBA: [
        { id: 'management', title: 'Principles of Management', subtopics: [] },
        { id: 'marketing', title: 'Marketing Management', subtopics: [] },
        { id: 'hr', title: 'Human Resource Management', subtopics: [] },
        { id: 'finance', title: 'Financial Management', subtopics: [] },
    ],
    HM: [
        { id: 'food_prod', title: 'Food Production', subtopics: [{ id: 'culinary_arts', title: 'Culinary Arts' }, { id: 'bakery', title: 'Bakery & Confectionery' }, { id: 'food_safety', title: 'Food Safety' }] },
        { id: 'fb_service', title: 'Food & Beverage Service', subtopics: [{ id: 'bar_ops', title: 'Bar Operations' }, { id: 'rest_mgmt', title: 'Restaurant Management' }] },
        { id: 'front_office', title: 'Front Office Operations', subtopics: [{ id: 'res_systems', title: 'Reservation Systems' }, { id: 'guest_rel', title: 'Guest Relations' }] },
        { id: 'housekeeping', title: 'Housekeeping', subtopics: [{ id: 'int_dec', title: 'Interior Decoration' }, { id: 'laundry', title: 'Laundry Management' }] },
        { id: 'hotel_acc', title: 'Hotel Accountancy', subtopics: [{ id: 'fin_mgmt', title: 'Financial Management' }] },
    ],

    // --- SCHOOL (Generic Fallbacks if detailed map missing) ---
    // We map generic keys. The App component will resolve keys like "CBSE_CLASS_10" to these.
    SCHOOL_MIDDLE: COMMON_SCHOOL_SUBJECTS,
    SCHOOL_SENIOR: SENIOR_SCHOOL_SUBJECTS_SCIENCE,
};
