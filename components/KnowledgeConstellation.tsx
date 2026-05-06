
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { SYLLABUS_DATABASE } from '../constants';
import type { UserContext } from '../types';
import * as d3 from 'd3';

interface KnowledgeConstellationProps {
    context: UserContext;
}

const KnowledgeConstellation: React.FC<KnowledgeConstellationProps> = ({ context }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [selectedNode, setSelectedNode] = useState<any | null>(null);

    const graphData = useMemo(() => {
        let syllabus: any[] = [];

        // Logic to determine which syllabus to load
        if (context.category === 'COMPETITIVE') {
            syllabus = SYLLABUS_DATABASE[context.detail] || [];
        } else if (context.category === 'COLLEGE') {
            syllabus = SYLLABUS_DATABASE[context.detail] || [];
        } else if (context.category === 'SCHOOL') {
             if (context.detail.includes('11') || context.detail.includes('12')) {
                syllabus = SYLLABUS_DATABASE['SCHOOL_SENIOR'] || [];
            } else {
                syllabus = SYLLABUS_DATABASE['SCHOOL_MIDDLE'] || [];
            }
        }

        const nodes: any[] = [];
        const links: any[] = [];

        const rootId = context.detail;
        nodes.push({ 
            id: rootId, 
            label: rootId, 
            group: 'Core', 
            level: 1,
            val: 20 
        });

        syllabus.forEach((subject) => {
            // Calculate deterministic progress for demo
            const subtopics = subject.subtopics || [];
            const completedCount = subtopics.filter((t: any, idx: number) => (subject.id.length + idx) % 3 === 0).length;
            const progress = subtopics.length > 0 ? (completedCount / subtopics.length) * 100 : 0;

            nodes.push({ 
                id: subject.id, 
                label: subject.title, 
                group: 'Subject', 
                level: 2,
                val: 15,
                progress: progress,
                totalTopics: subtopics.length,
                completedTopics: completedCount,
                subtopics: subtopics.map((t: any, idx: number) => ({
                    ...t,
                    completed: (subject.id.length + idx) % 3 === 0
                }))
            });
            links.push({ source: rootId, target: subject.id });

            subtopics.forEach((topic: any, idx: number) => {
                const isCompleted = (subject.id.length + idx) % 3 === 0;
                nodes.push({ 
                    id: topic.id, 
                    label: topic.title, 
                    group: 'Topic', 
                    level: 3,
                    val: 8,
                    completed: isCompleted
                });
                links.push({ source: subject.id, target: topic.id });
            });
        });

        return { nodes, links };
    }, [context]);

    const handleMouseMove = (event: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = event;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (clientX - left - width / 2) / (width / 2);
        const y = (clientY - top - height / 2) / (height / 2);
        const tilt = 10;
        if (svgRef.current) {
            svgRef.current.style.transform = `rotateY(${x * tilt}deg) rotateX(${-y * tilt}deg)`;
        }
    };

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [-width / 2, -height / 2, width, height]);

        svg.selectAll("*").remove();

        const defs = svg.append("defs");
        const glowFilter = defs.append("filter").attr("id", "glow");
        glowFilter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
        const feMerge = glowFilter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        const simulation = d3.forceSimulation(graphData.nodes)
            .force("link", d3.forceLink(graphData.links).id((d: any) => d.id).distance((d: any) => d.target.level * 80))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("collide", d3.forceCollide().radius((d: any) => d.val * 2))
            .force("center", d3.forceCenter(0, 0));

        const link = svg.append("g")
            .attr("stroke", "#0891b2")
            .attr("stroke-opacity", 0.3)
            .selectAll("line")
            .data(graphData.links)
            .join("line")
            .attr("stroke-width", (d: any) => Math.max(1, 3 - d.target.level));

        const drag = (simulation: any) => {
            function dragstarted(event: any) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }
            function dragged(event: any) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }
            function dragended(event: any) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }
            return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
        };

        const node = svg.append("g")
            .selectAll("g")
            .data(graphData.nodes)
            .join("g")
            .attr("class", "cursor-pointer")
            .call(drag(simulation))
            .on('click', (event: any, d: any) => {
                setSelectedNode(d);
                event.stopPropagation();
            });

        node.append("circle")
            .attr("r", (d: any) => d.level === 1 ? 30 : d.level === 2 ? 18 : 8)
            .attr("fill", (d: any) => {
                if (d.level === 1) return "#00f3ff";
                if (d.level === 2) return "#0e7490";
                return d.completed ? "#22c55e" : "#1e293b";
            })
            .attr("stroke", (d: any) => {
                if (d.level === 1) return "#fff";
                if (d.level === 2) return "#22d3ee";
                return d.completed ? "#4ade80" : "#475569";
            })
            .attr("stroke-width", (d: any) => d.level === 1 ? 3 : 2)
            .style("filter", (d: any) => d.level === 1 ? "url(#glow)" : "none")
            .style("transition", "all 0.3s ease");

        node.append("text")
            .text((d: any) => d.label)
            .attr("x", (d: any) => d.level === 1 ? 40 : d.level === 2 ? 25 : 15)
            .attr("y", 5)
            .attr("fill", (d: any) => {
                if (d.level === 1) return "#fff";
                if (d.level === 2) return "#fff";
                return d.completed ? "#4ade80" : "#94a3b8";
            })
            .style("font-size", (d: any) => d.level === 1 ? "16px" : d.level === 2 ? "14px" : "10px")
            .style("font-weight", (d: any) => d.level === 3 ? "400" : "600")
            .style("font-family", "Orbitron, sans-serif")
            .style("pointer-events", "none")
            .style("text-shadow", "0 0 5px #000");

        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);
            node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        });

        return () => { simulation.stop(); };
    }, [graphData]);

    return (
        <div className="w-full h-full relative overflow-hidden" ref={containerRef} onMouseMove={handleMouseMove} style={{ perspective: '1000px' }}>
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <h1 className="text-4xl font-bold text-white font-display text-glow">{context.label} Constellation</h1>
                <p className="text-cyan-400 font-mono tracking-widest text-xs uppercase">Interactive Knowledge Graph</p>
            </div>
            <svg ref={svgRef} className="w-full h-full transition-transform duration-100 ease-out preserve-3d"></svg>
            {selectedNode && (
                <div className="absolute bottom-8 right-8 bg-slate-900/95 backdrop-blur-xl p-6 clip-corner border border-cyan-500/30 w-96 animate-slide-up z-30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <button onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    
                    <div className="mb-4">
                        <span className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">{selectedNode.group}</span>
                        <h3 className="text-2xl font-bold text-white font-display tracking-tight">{selectedNode.label}</h3>
                    </div>

                    {selectedNode.group === 'Subject' && (
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Syllabus Progress</span>
                                    <span className="text-lg font-bold text-cyan-400 font-display">{Math.round(selectedNode.progress)}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 border border-slate-700 clip-corner-sm overflow-hidden">
                                    <div 
                                        className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-1000" 
                                        style={{ width: `${selectedNode.progress}%` }}
                                    ></div>
                                </div>
                                <div className="mt-2 text-[9px] text-slate-500 font-mono text-right uppercase tracking-widest">
                                    {selectedNode.completedTopics} / {selectedNode.totalTopics} TOPICS MASTERED
                                </div>
                            </div>

                            <div className="max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                <p className="text-[10px] text-cyan-500/70 font-bold uppercase tracking-widest mb-3 border-b border-white/5 pb-1">Topic Breakdown</p>
                                <div className="space-y-2">
                                    {selectedNode.subtopics.map((topic: any) => (
                                        <div key={topic.id} className="flex items-center justify-between p-2 bg-slate-800/30 border border-white/5 clip-corner-sm">
                                            <span className={`text-xs font-medium ${topic.completed ? 'text-white' : 'text-slate-500'}`}>{topic.title}</span>
                                            {topic.completed ? (
                                                <div className="flex items-center gap-1 text-[8px] text-green-400 font-mono font-bold uppercase">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>
                                                    Mastered
                                                </div>
                                            ) : (
                                                <div className="text-[8px] text-slate-600 font-mono uppercase">Pending</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedNode.group === 'Topic' && (
                        <div className="space-y-4">
                            <div className={`p-4 clip-corner border ${selectedNode.completed ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700 bg-slate-800/20'}`}>
                                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                                    This topic is part of your core curriculum. {selectedNode.completed ? 'You have successfully mastered the concepts in this module.' : 'This module is scheduled for your next training session.'}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-500 font-mono uppercase">Status</span>
                                    <span className={`text-[10px] font-bold font-mono uppercase ${selectedNode.completed ? 'text-green-400' : 'text-yellow-500'}`}>
                                        {selectedNode.completed ? ':: COMPLETED ::' : ':: IN PROGRESS ::'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedNode.group === 'Core' && (
                        <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 clip-corner">
                            <p className="text-xs text-cyan-100/70 leading-relaxed font-mono uppercase tracking-wider">
                                Central Command Hub. This node represents your primary objective: {selectedNode.label}. All sub-constellations branch from here.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default KnowledgeConstellation;
