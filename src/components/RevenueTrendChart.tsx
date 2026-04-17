import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { motionTokens, prefersReducedMotion } from '../lib/motion'

type RevenuePoint = {
    month: string
    revenue: number
}

const revenueTrend: RevenuePoint[] = [
    { month: 'Jan', revenue: 14200 },
    { month: 'Feb', revenue: 15800 },
    { month: 'Mar', revenue: 15100 },
    { month: 'Apr', revenue: 18400 },
    { month: 'May', revenue: 17600 },
    { month: 'Jun', revenue: 21300 },
    { month: 'Jul', revenue: 22800 },
    { month: 'Aug', revenue: 21900 },
    { month: 'Sep', revenue: 24300 },
]

const chartWidth = 720
const chartHeight = 260
const padding = {
    top: 24,
    right: 28,
    bottom: 42,
    left: 48,
}

const formatCurrency = (value: number) => `EUR ${(value / 1000).toFixed(1)}k`

const minRevenue = Math.min(...revenueTrend.map((point) => point.revenue))
const maxRevenue = Math.max(...revenueTrend.map((point) => point.revenue))
const revenueRange = maxRevenue - minRevenue

const plotWidth = chartWidth - padding.left - padding.right
const plotHeight = chartHeight - padding.top - padding.bottom

const getX = (index: number) => padding.left + (index / (revenueTrend.length - 1)) * plotWidth
const getY = (value: number) =>
    padding.top + (1 - (value - minRevenue) / revenueRange) * plotHeight

const linePoints = revenueTrend.map((point, index) => ({
    ...point,
    x: getX(index),
    y: getY(point.revenue),
}))

const linePath = linePoints
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

const areaPath = `${linePath} L ${linePoints[linePoints.length - 1].x} ${chartHeight - padding.bottom} L ${linePoints[0].x} ${chartHeight - padding.bottom} Z`

/**
 * Small GSAP line chart.
 */
function RevenueTrendChart() {
    const chartRef = useRef<HTMLDivElement | null>(null)
    const lineRef = useRef<SVGPathElement | null>(null)

    useLayoutEffect(() => {
        if (!chartRef.current || !lineRef.current || prefersReducedMotion()) {
            return
        }

        const lineLength = lineRef.current.getTotalLength()
        const context = gsap.context(() => {
            gsap.set(lineRef.current, {
                strokeDasharray: lineLength,
                strokeDashoffset: lineLength,
            })

            gsap.timeline()
                .fromTo(
                    '[data-chart-area]',
                    { autoAlpha: 0 },
                    {
                        autoAlpha: 1,
                        duration: 0.35,
                        ease: motionTokens.feedback.ease,
                    },
                )
                .to(
                    lineRef.current,
                    {
                        strokeDashoffset: 0,
                        duration: 0.9,
                        ease: 'power2.out',
                    },
                    0.08,
                )
                .fromTo(
                    '[data-chart-point]',
                    { scale: 0, autoAlpha: 0, transformOrigin: 'center' },
                    {
                        scale: 1,
                        autoAlpha: 1,
                        duration: 0.28,
                        stagger: 0.045,
                        ease: 'back.out(1.7)',
                    },
                    0.45,
                )
        }, chartRef)

        return () => context.revert()
    }, [])

    return (
        <div ref={chartRef} className="mt-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">Revenue Trend</p>
                    <h4 className="mt-2 text-3xl font-semibold tracking-tight">EUR 24.3k</h4>
                    <p className="mt-1 text-sm text-emerald-300">+8.4% vs last month</p>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                    Sep peak: {formatCurrency(maxRevenue)}
                </div>
            </div>

            <div className="mt-4 overflow-x-auto">
                <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    role="img"
                    aria-label="Revenue trend line chart from January to September"
                    className="min-w-[42rem]"
                >
                    <defs>
                        <linearGradient id="revenue-area" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgb(110 231 183)" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="rgb(110 231 183)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {[0, 1, 2, 3].map((line) => {
                        const y = padding.top + (line / 3) * plotHeight
                        const value = maxRevenue - (line / 3) * revenueRange

                        return (
                            <g key={line}>
                                <line
                                    x1={padding.left}
                                    x2={chartWidth - padding.right}
                                    y1={y}
                                    y2={y}
                                    stroke="rgba(255,255,255,0.08)"
                                />
                                <text x={8} y={y + 4} fill="rgb(113 113 122)" fontSize="12">
                                    {formatCurrency(value)}
                                </text>
                            </g>
                        )
                    })}

                    <path data-chart-area d={areaPath} fill="url(#revenue-area)" />
                    <path
                        ref={lineRef}
                        d={linePath}
                        fill="none"
                        stroke="rgb(110 231 183)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                    />

                    {linePoints.map((point) => (
                        <g key={point.month}>
                            <circle
                                data-chart-point
                                cx={point.x}
                                cy={point.y}
                                r="5"
                                fill="rgb(15 23 42)"
                                stroke="rgb(110 231 183)"
                                strokeWidth="3"
                            />
                            <text x={point.x} y={chartHeight - 14} textAnchor="middle" fill="rgb(161 161 170)" fontSize="12">
                                {point.month}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    )
}

export default RevenueTrendChart
