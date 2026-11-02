import type { Lang } from "@/lib/content";

// Every figure below is drawn from the recorded example_output.json of the matching
// project in github.com/Rafik0107/HackEPS-12-Python-Projects — no invented data.

const GOLD = "#ffd700", PURPLE = "#a978ff", MIST = "#a7a5b4";

function Grid({ n, cell, children }: { n: number; cell: number; children: React.ReactNode }) {
  const s = n * cell;
  return (
    <svg viewBox={`-4 -4 ${s + 8} ${s + 8}`} className="mx-auto w-full max-w-sm" role="img">
      {Array.from({ length: n + 1 }, (_, i) => (
        <g key={i} stroke="rgba(245,245,247,0.08)">
          <line x1={i * cell} y1={0} x2={i * cell} y2={s} />
          <line x1={0} y1={i * cell} x2={s} y2={i * cell} />
        </g>
      ))}
      {children}
    </svg>
  );
}

function Path({ cells, cell, color }: { cells: number[][]; cell: number; color: string }) {
  const d = cells.map(([r, c], i) => `${i ? "L" : "M"}${c * cell + cell / 2},${r * cell + cell / 2}`).join(" ");
  return (
    <>
      <path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${color})` }} strokeDasharray="1000" strokeDashoffset="0">
        <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="3s" fill="freeze" />
      </path>
      {[cells[0], cells[cells.length - 1]].map(([r, c], i) => <circle key={i} cx={c * cell + cell / 2} cy={r * cell + cell / 2} r={7} fill={i ? GOLD : PURPLE} />)}
    </>
  );
}

function Bars({ items, unit }: { items: { label: string; value: number; color: string }[]; unit?: string }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <div className="space-y-4">
      {items.map((it) => (
        <div key={it.label}>
          <div className="flex justify-between text-xs text-mist"><span>{it.label}</span><span className="font-mono text-pearl">{it.value}{unit}</span></div>
          <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-pearl/5">
            <div className="h-full rounded-full" style={{ width: `${(it.value / max) * 100}%`, background: it.color, boxShadow: `0 0 14px ${it.color}` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProjectViz({ kind, lang }: { kind?: string; lang: Lang }) {
  const fr = lang === "fr";
  switch (kind) {
    case "astar": {
      const path = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]];
      return <Grid n={8} cell={40}><Path cells={path} cell={40} color={GOLD} /></Grid>;
    }
    case "warehouse": {
      const path = [[0,0],[1,0],[2,0],[2,1],[2,2],[3,2],[4,2],[5,2],[6,2],[6,3],[6,4],[6,5],[6,6],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[0,0]];
      const picks = [[2,2],[6,6],[0,7]];
      return (
        <Grid n={8} cell={40}>
          <Path cells={path} cell={40} color={PURPLE} />
          {picks.map(([r, c]) => <rect key={`${r}${c}`} x={c * 40 + 10} y={r * 40 + 10} width={20} height={20} rx={4} fill={GOLD} />)}
        </Grid>
      );
    }
    case "gantt": {
      const plan = [{ job: "cut", m: 0, s: 0, e: 8 }, { job: "polish", m: 1, s: 0, e: 6 }, { job: "drill", m: 2, s: 0, e: 5 }, { job: "inspect", m: 2, s: 5, e: 8 }, { job: "pack", m: 1, s: 6, e: 8 }];
      return (
        <svg viewBox="0 0 420 170" className="w-full" role="img">
          {[0, 1, 2].map((m) => <text key={m} x={0} y={38 + m * 46} fill={MIST} fontSize={12}>M{m + 1}</text>)}
          {plan.map((p, i) => (
            <g key={p.job}>
              <rect x={40 + p.s * 45} y={20 + p.m * 46} width={(p.e - p.s) * 45 - 4} height={30} rx={6} fill={i % 2 ? PURPLE : GOLD} opacity={0.85} />
              <text x={48 + p.s * 45} y={40 + p.m * 46} fontSize={12} fill="#050508" fontWeight={600}>{p.job}</text>
            </g>
          ))}
          <line x1={40 + 8 * 45} y1={10} x2={40 + 8 * 45} y2={160} stroke={GOLD} strokeDasharray="4 4" />
          <text x={40 + 8 * 45 - 70} y={166} fill={GOLD} fontSize={11}>makespan = 8</text>
        </svg>
      );
    }
    case "arm": {
      // Link lengths l1 = l2 = 1 reproduce the recorded target (1.2, 0.6) exactly.
      const sols = [[-0.37183426497742217, 1.6709637479564565], [1.2991294829790343, -1.6709637479564565]];
      const S = 120, ox = 60, oy = 210;
      return (
        <svg viewBox="0 0 360 260" className="mx-auto w-full max-w-md" role="img">
          <line x1={0} y1={oy} x2={360} y2={oy} stroke="rgba(245,245,247,0.1)" />
          {sols.map(([a, b], i) => {
            const ex = Math.cos(a), ey = Math.sin(a), tx = ex + Math.cos(a + b), ty = ey + Math.sin(a + b);
            const c = i ? PURPLE : GOLD;
            return (
              <g key={i} stroke={c} strokeWidth={6} strokeLinecap="round" opacity={0.9}>
                <polyline points={`${ox},${oy} ${ox + ex * S},${oy - ey * S} ${ox + tx * S},${oy - ty * S}`} fill="none" />
                <circle cx={ox + ex * S} cy={oy - ey * S} r={6} fill="#050508" />
              </g>
            );
          })}
          <circle cx={ox} cy={oy} r={9} fill={GOLD} />
          <circle cx={ox + 1.2 * S} cy={oy - 0.6 * S} r={10} fill="none" stroke="#fff" strokeDasharray="3 3" />
          <text x={ox + 1.2 * S + 14} y={oy - 0.6 * S - 10} fill={MIST} fontSize={12}>(1.2, 0.6)</text>
        </svg>
      );
    }
    case "kmeans": {
      const centers = [[-3.011, -3.019], [0.003, 2.991], [2.992, -2.029]];
      const map = (x: number, y: number) => [180 + x * 40, 150 - y * 35];
      return (
        <svg viewBox="0 0 360 300" className="mx-auto w-full max-w-md" role="img">
          {centers.map(([x, y], i) => {
            const [cx, cy] = map(x, y);
            const col = [GOLD, PURPLE, "#f5f5f7"][i];
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={46} fill={col} opacity={0.08} />
                <circle cx={cx} cy={cy} r={8} fill={col} style={{ filter: `drop-shadow(0 0 8px ${col})` }} />
                <text x={cx + 12} y={cy - 12} fill={MIST} fontSize={11}>n = 50</text>
              </g>
            );
          })}
          <text x={10} y={290} fill={MIST} fontSize={11}>{fr ? "3 centres · 2 itérations · inertie 23,26" : "3 centres · 2 iterations · inertia 23.26"}</text>
        </svg>
      );
    }
    case "kalman":
      return <Bars items={[{ label: fr ? "RMSE mesures" : "Measurement RMSE", value: 0.774, color: PURPLE }, { label: fr ? "RMSE filtré (Kalman)" : "Filtered RMSE (Kalman)", value: 0.462, color: GOLD }]} />;
    case "imu":
      return <Bars unit=" rad" items={[{ label: fr ? "Gyroscope seul" : "Gyro only", value: 0.1728, color: PURPLE }, { label: fr ? "Fusion complémentaire" : "Complementary fusion", value: 0.0138, color: GOLD }]} />;
    case "vibration":
      return <Bars unit=" Hz" items={[{ label: fr ? "Fréquence propre théorique" : "Theoretical natural frequency", value: 1.592, color: PURPLE }, { label: fr ? "Pic FFT mesuré" : "Measured FFT peak", value: 1.599, color: GOLD }]} />;
    case "pid":
      return <Bars items={[{ label: fr ? "Consigne" : "Setpoint", value: 1, color: PURPLE }, { label: fr ? "Sortie finale" : "Final output", value: 0.9975, color: GOLD }]} />;
    case "anomaly":
      return <Bars items={[{ label: fr ? "Anomalies injectées" : "Injected anomalies", value: 10, color: PURPLE }, { label: fr ? "Vrais positifs" : "True positives", value: 10, color: GOLD }]} />;
    case "ecg":
      return <Bars items={[{ label: fr ? "Battements de référence" : "Reference beats", value: 14, color: PURPLE }, { label: fr ? "Battements détectés" : "Detected beats", value: 14, color: GOLD }]} />;
    default:
      return null;
  }
}
