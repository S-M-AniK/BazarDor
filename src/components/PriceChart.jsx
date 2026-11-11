"use client";
import { useRef, useState } from "react";
import { toBnNumber, bnShortDate } from "@/lib/format";

const fmt = bnShortDate;

export default function PriceChart({ data }) {
  const [hover, setHover] = useState(null);
  const box = useRef(null);

  if (data.length < 2) {
    return <p className="mt-4 text-sm text-gray-500">এখনো যথেষ্ট তথ্য নেই</p>;
  }

  const n = data.length;
  const prices = data.map((d) => d.price);
  const rawMin = Math.min(...prices);
  const rawMax = Math.max(...prices);
  const pad = Math.max((rawMax - rawMin) * 0.15, 1);
  const min = Math.floor(rawMin - pad);
  const max = Math.ceil(rawMax + pad);
  const range = max - min;

  const x = (i) => (i / (n - 1)) * 100;
  const y = (p) => 100 - ((p - min) / range) * 100;

  const line = data.map((d, i) => `${x(i)},${y(d.price)}`).join(" ");
  const area = `0,100 ${line} 100,100`;
  const ticks = [0, 1, 2, 3, 4].map((i) => ({
    pos: i * 25,
    value: Math.round(max - (range * i) / 4),
  }));
  const labelIdx = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * (n - 1)));

  const onMove = (e) => {
    const rect = box.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const i = Math.min(n - 1, Math.max(0, Math.round(ratio * (n - 1))));
    setHover(i);
  };

  const point = hover !== null ? data[hover] : null;
  const tipLeft = hover !== null ? Math.min(88, Math.max(12, x(hover))) : 0;

  return (
    <div className="mt-6">
      <div className="flex gap-3">
        <div className="relative h-64 w-14 shrink-0">
          {ticks.map((t) => (
            <span
              key={t.pos}
              className="absolute right-0 -translate-y-1/2 text-sm font-semibold text-gray-700"
              style={{ top: `${t.pos}%` }}
            >
              {toBnNumber(t.value)}
            </span>
          ))}
        </div>

        <div className="flex-1">
          <div
            ref={box}
            className="relative h-64 cursor-crosshair"
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
          >
            {ticks.map((t) => (
              <div
                key={t.pos}
                className="absolute left-0 right-0 border-t border-gray-200"
                style={{ top: `${t.pos}%` }}
              />
            ))}

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              <polygon points={area} className="fill-brand-soft" />
              <polyline
                points={line}
                fill="none"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="stroke-brand"
              />
            </svg>

            {data.map((d, i) => (
              <span
                key={i}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand ring-2 ring-white ${
                  hover === i ? "h-4 w-4" : "h-2 w-2"
                }`}
                style={{ left: `${x(i)}%`, top: `${y(d.price)}%` }}
              />
            ))}

            {point && (
              <>
                <div
                  className="absolute top-0 bottom-0 border-l border-dashed border-gray-400"
                  style={{ left: `${x(hover)}%` }}
                />
                <div
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white"
                  style={{ left: `${tipLeft}%`, top: `calc(${y(point.price)}% - 14px)` }}
                >
                  <p className="text-xs text-gray-300">{fmt(point.date)}</p>
                  <p className="font-bold">{toBnNumber(point.price)} টাকা</p>
                </div>
              </>
            )}
          </div>

          <div className="mt-3 flex justify-between text-sm font-medium text-gray-600">
            {labelIdx.map((i) => (
              <span key={i}>{fmt(data[i].date)}</span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        সর্বনিম্ন <span className="font-bold text-green-700">{toBnNumber(rawMin)}</span> টাকা ·
        সর্বাধিক <span className="font-bold text-red-600">{toBnNumber(rawMax)}</span> টাকা
      </p>
    </div>
  );
}