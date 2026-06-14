'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';

// ─── Types ──────────────────────────────────────────────────────────────────
interface AgentNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  color: string;
  size: number;
  status: 'active' | 'locked';
}

interface AgentLink extends d3.SimulationLinkDatum<AgentNode> {
  sourceColor: string;
  activeLink: boolean;
}

// ─── Agent data ─────────────────────────────────────────────────────────────
const AGENT_DATA: { id: string; name: string; color: string; size: number; status: 'active' | 'locked'; connects: string[] }[] = [
  { id: 'nexus', name: 'NEXUS', color: '#00f0ff', size: 20, status: 'active', connects: ['volt','aurora','kaos','cipher','ethos'] },
  { id: 'volt', name: 'VOLT', color: '#f97316', size: 14, status: 'active', connects: ['nexus','aurora','stratos'] },
  { id: 'aurora', name: 'AURORA', color: '#a855f7', size: 14, status: 'active', connects: ['nexus','volt','lyra','prism'] },
  { id: 'kaos', name: 'KAOS', color: '#ef4444', size: 13, status: 'locked', connects: ['nexus','cipher','janus'] },
  { id: 'cipher', name: 'CIPHER', color: '#10b981', size: 13, status: 'locked', connects: ['nexus','kaos','axiom'] },
  { id: 'ethos', name: 'ETHOS', color: '#3b82f6', size: 13, status: 'locked', connects: ['nexus','janus','terra'] },
  { id: 'janus', name: 'JANUS', color: '#8b5cf6', size: 12, status: 'locked', connects: ['kaos','ethos','prism'] },
  { id: 'lyra', name: 'LYRA', color: '#ec4899', size: 12, status: 'locked', connects: ['aurora','prism','terra'] },
  { id: 'prism', name: 'PRISM', color: '#fbbf24', size: 12, status: 'locked', connects: ['aurora','janus','lyra'] },
  { id: 'stratos', name: 'STRATOS', color: '#06b6d4', size: 12, status: 'locked', connects: ['volt','terra','axiom'] },
  { id: 'terra', name: 'TERRA', color: '#84cc16', size: 12, status: 'locked', connects: ['ethos','lyra','stratos'] },
  { id: 'axiom', name: 'AXIOM', color: '#e2e8f0', size: 12, status: 'locked', connects: ['cipher','stratos'] },
];

// ─── Star particles ─────────────────────────────────────────────────────────
function generateStars(count: number) {
  const stars: { id: number; x: number; y: number; r: number; opacity: number; delay: number }[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({ id: i, x: Math.random() * 100, y: Math.random() * 100, r: Math.random() * 1.2 + 0.4, opacity: Math.random() * 0.5 + 0.15, delay: Math.random() * 4 });
  }
  return stars;
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function MemoryGalaxy() {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const stars = useMemo(() => generateStars(150), []);
  const activeCount = AGENT_DATA.filter((a) => a.status === 'active').length;

  // Build nodes and links
  const nodes: AgentNode[] = useMemo(() =>
    AGENT_DATA.map((a) => ({ ...a, x: undefined, y: undefined })),
  []);

  const links: AgentLink[] = useMemo(() => {
    const seen = new Set<string>();
    const result: AgentLink[] = [];
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    for (const source of AGENT_DATA) {
      for (const targetId of source.connects) {
        const key = [source.id, targetId].sort().join('-');
        if (seen.has(key)) continue;
        seen.add(key);
        const target = AGENT_DATA.find((a) => a.id === targetId);
        const activeLink = source.status === 'active' && (target?.status === 'active');
        result.push({ source: nodeMap.get(source.id)!, target: nodeMap.get(targetId)!, sourceColor: source.color, activeLink });
      }
    }
    return result;
  }, [nodes]);

  // ─── D3 lifecycle ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        mainGroup.attr('transform', event.transform.toString());
      });
    svg.call(zoom);

    // Main group (transformed by zoom)
    const mainGroup = svg.append('g');

    // Defs for glow filters
    const defs = svg.append('defs');
    AGENT_DATA.forEach((agent) => {
      defs.append('filter').attr('id', `glow-${agent.id}`)
        .html(`<feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>`);
    });

    // ── Links ────────────────────────────────────────────────────────────
    const linkElements = mainGroup.selectAll<SVGLineElement, AgentLink>('line')
      .data(links)
      .join('line')
      .attr('stroke', (d) => d.activeLink ? d.sourceColor : 'rgba(255,255,255,0.06)')
      .attr('stroke-opacity', (d) => d.activeLink ? 0.25 : 0.06)
      .attr('stroke-width', 1);

    // ── Nodes ────────────────────────────────────────────────────────────
    const nodeGroup = mainGroup.selectAll<SVGGElement, AgentNode>('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<SVGGElement, AgentNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      ) as d3.Selection<SVGGElement, AgentNode, SVGGElement, unknown>;

    // Node circles
    nodeGroup.append('circle')
      .attr('r', (d) => d.size)
      .attr('fill', (d) => d.status === 'active' ? d.color : '#4a4a6a')
      .attr('opacity', (d) => d.status === 'active' ? 1 : 0.45)
      .attr('filter', (d) => `url(#glow-${d.id})`)
      .style('cursor', (d) => d.status === 'active' ? 'pointer' : 'not-allowed')
      .on('mouseenter', function() { d3.select(this).transition().duration(150).attr('r', function(this: SVGCircleElement) { const n = d3.select(this.parentNode!).datum() as AgentNode; return n.size * 1.3; }); })
      .on('mouseleave', function() { d3.select(this).transition().duration(150).attr('r', function(this: SVGCircleElement) { const n = d3.select(this.parentNode!).datum() as AgentNode; return n.size; }); });

    // Active core (white center)
    nodeGroup.filter((d) => d.status === 'active')
      .append('circle')
      .attr('r', (d) => d.size * 0.3)
      .attr('fill', '#ffffff')
      .attr('opacity', 0.8);

    // Lock icon
    nodeGroup.filter((d) => d.status === 'locked')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#ffffff')
      .attr('font-size', '8px')
      .text('🔒');

    // Labels
    nodeGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.size + 12)
      .attr('fill', '#ffffff')
      .attr('opacity', 0.7)
      .attr('font-family', 'monospace')
      .attr('font-size', '10px')
      .text((d) => d.name);

    // Click handling
    nodeGroup.on('click', (_, d) => {
      if (d.status === 'active') {
        router.push(`/universo/${d.id}`);
      } else {
        setToast(`🔒 ${d.name} — Agente bloqueado`);
        setTimeout(() => setToast(null), 2000);
      }
    });

    // ── Simulation ───────────────────────────────────────────────────────
    const simulation = d3.forceSimulation<AgentNode>(nodes)
      .force('link', d3.forceLink<AgentNode, AgentLink>(links).id((d) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d) => d.size + 10))
      .alphaDecay(0.02)
      .on('tick', () => {
        linkElements
          .attr('x1', (d) => (d.source as AgentNode).x!)
          .attr('y1', (d) => (d.source as AgentNode).y!)
          .attr('x2', (d) => (d.target as AgentNode).x!)
          .attr('y2', (d) => (d.target as AgentNode).y!);
        nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
      });

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      svg.attr('viewBox', `0 0 ${w} ${h}`);
      simulation.force('center', d3.forceCenter(w / 2, h / 2));
      simulation.alpha(0.3).restart();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      simulation.stop();
      window.removeEventListener('resize', handleResize);
    };
  }, [nodes, links, router]);

  // ─── CSS keyframes ─────────────────────────────────────────────────────
  const keyframeStyles = `
    @keyframes pulse-active {
      0%, 100% { r: 20; opacity: 1; }
      50% { r: 23; opacity: 0.85; }
    }
    @keyframes twinkle-star {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 0.8; }
    }
    @keyframes toast-fade {
      0%, 80% { opacity: 1; }
      100% { opacity: 0; }
    }
  `;

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at center, #0d0d2b 0%, #0a0a1a 70%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{keyframeStyles}</style>

      {/* ── Star particles ────────────────────────────────────────────────── */}
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            top: `${s.y}%`,
            left: `${s.x}%`,
            width: `${s.r * 2}px`,
            height: `${s.r * 2}px`,
            background: '#ffffff',
            borderRadius: '50%',
            opacity: s.opacity,
            animation: `twinkle-star ${2 + s.delay}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* ── SVG graph ─────────────────────────────────────────────────────── */}
      <svg
        ref={svgRef}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        viewBox={`0 0 ${typeof window !== 'undefined' ? window.innerWidth : 1024} ${typeof window !== 'undefined' ? window.innerHeight : 768}`}
      />

      {/* ── HUD ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.75)',
          color: '#ffffff',
          padding: '8px 24px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '11px',
          border: '1px solid rgba(255,255,255,0.12)',
          letterSpacing: '0.05em',
          zIndex: 50,
        }}
      >
        TERRITÓRIOS: {activeCount}/12 | SINAIS ATIVOS: {links.filter((l) => l.activeLink).length} | CAMADA: SUPERFÍCIE
      </div>

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(239, 68, 68, 0.9)',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '13px',
            zIndex: 200,
            animation: 'toast-fade 2s ease-in forwards',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
