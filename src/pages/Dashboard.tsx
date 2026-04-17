import StatCard from '../components/StatCard'
import RevenueTrendChart from '../components/RevenueTrendChart'
import { seedClients } from '../data/clients'
import usePageReveal from '../hooks/usePageReveal'

// Mock activity feed.
const recentActivity = [
    { company: seedClients[0]?.company ?? 'Client', action: 'requested a redesign proposal', time: '2 hours ago' },
    { company: seedClients[1]?.company ?? 'Client', action: 'received an invoice', time: '5 hours ago' },
    { company: seedClients[2]?.company ?? 'Client', action: 'scheduled a follow-up call', time: 'Yesterday' },
]

/**
 * Main dashboard page.
 */
function Dashboard() {
    const pageRef = usePageReveal()

    return (
        <div ref={pageRef} className="space-y-6">
            <section data-page-section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {/* Mock stat cards. */}
                <StatCard title="Total Clients" value="128" change="+12% this month" />
                <StatCard title="Active Projects" value="34" change="+5 new this week" />
                <StatCard title="Monthly Revenue" value="EUR 24,300" change="+8.4% growth" />
                <StatCard title="Pending Invoices" value="9" change="2 due today" />
            </section>

            <section data-page-section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-lg font-semibold">Performance Overview</h3>
                    <p className="mt-2 text-sm text-zinc-400">
                        Monthly revenue movement across active client work.
                    </p>

                    <RevenueTrendChart />
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>

                    <div className="mt-4 space-y-4">
                        {recentActivity.map((item) => (
                            <div key={`${item.company}-${item.action}`} className="rounded-2xl bg-zinc-900/60 p-4">
                                <p className="font-medium">
                                    {item.company} {item.action}
                                </p>
                                <p className="mt-1 text-sm text-zinc-400">{item.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Dashboard
