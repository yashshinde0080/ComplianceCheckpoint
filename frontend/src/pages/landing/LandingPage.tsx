import { Link } from 'react-router-dom';
import {
    ShieldCheck,
    BarChart3,
    Files,
    CheckCircle2,
    ArrowRight,
    Zap,
    Lock,
    Search
} from 'lucide-react';
import { MagicBentoCard } from '@/components/ui/MagicBento';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary p-1.5 rounded-lg shadow-glow-sm">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-foreground tracking-tight">ComplianceCP</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium shadow-glow hover:bg-primary/90 transition-all hover-lift"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 animate-fade-in border border-primary/20">
                        <Zap className="w-3 h-3" />
                        Empowering SMB SaaS Compliance
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 animate-fade-in">
                        Compliance Readiness <br />
                        <span className="text-gradient-primary">Simplified.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 animate-fade-in delay-100">
                        Automate your SOC 2 and ISO 27001 readiness. Manage controls, collect
                        evidence, and generate audit-ready reports in minutes—not months.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-glow hover:bg-primary/90 transition-all hover-lift flex items-center justify-center gap-2"
                        >
                            Start for Free <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="#how-it-works"
                            className="px-8 py-4 bg-secondary text-foreground rounded-xl font-semibold border border-white/5 hover:bg-secondary/80 transition-all flex items-center justify-center"
                        >
                            How it works
                        </a>
                    </div>

                    <div className="mt-20 relative px-4 max-w-5xl mx-auto">
                        <div className="absolute -z-10 -top-20 inset-x-0 mx-auto w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
                        <MagicBentoCard className="rounded-3xl overflow-hidden animate-fade-in delay-300 shadow-2xl p-0 magic-bento-card--border-glow" spotlightColor="132, 0, 255">
                            <div className="bg-secondary p-4 flex justify-between items-center border-b border-white/5">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400/60"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400/60"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400/60"></div>
                                </div>
                                <div className="w-64 h-5 bg-muted rounded-full"></div>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-muted"></div>
                                </div>
                            </div>
                            <div className="bg-card p-8 grid grid-cols-12 gap-6 min-h-[460px]">
                                {/* Mock Sidebar */}
                                <div className="col-span-3 space-y-4">
                                    <div className="w-full h-8 bg-primary/20 rounded-lg"></div>
                                    <div className="w-4/5 h-8 bg-transparent border border-white/5 rounded-lg"></div>
                                    <div className="w-full h-8 bg-transparent border border-white/5 rounded-lg"></div>
                                    <div className="w-3/4 h-8 bg-transparent border border-white/5 rounded-lg"></div>
                                </div>
                                {/* Mock Content */}
                                <div className="col-span-9 space-y-8">
                                    <div className="flex justify-between">
                                        <div className="space-y-2">
                                            <div className="w-48 h-8 bg-foreground/10 rounded-lg"></div>
                                            <div className="w-64 h-4 bg-foreground/20 rounded-lg"></div>
                                        </div>
                                        <div className="w-32 h-10 bg-primary/80 rounded-lg"></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-32 bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                                            <div className="w-8 h-8 bg-primary/20 rounded-lg"></div>
                                            <div className="w-16 h-6 bg-foreground opacity-50 rounded-lg"></div>
                                            <div className="w-full h-2 bg-white/10 rounded-full"></div>
                                        </div>
                                        <div className="h-32 bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                                            <div className="w-8 h-8 bg-success/20 rounded-lg"></div>
                                            <div className="w-16 h-6 bg-foreground opacity-50 rounded-lg"></div>
                                            <div className="w-full h-2 bg-white/10 rounded-full"></div>
                                        </div>
                                        <div className="h-32 bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                                            <div className="w-8 h-8 bg-warning/20 rounded-lg"></div>
                                            <div className="w-16 h-6 bg-foreground opacity-50 rounded-lg"></div>
                                            <div className="w-full h-2 bg-white/10 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2].map(i => (
                                            <div key={i} className="flex items-center justify-between p-4 border border-white/5 rounded-xl">
                                                <div className="flex gap-3 items-center">
                                                    <div className="w-10 h-10 bg-white/5 rounded-lg"></div>
                                                    <div className="w-40 h-5 bg-foreground opacity-40 rounded-lg"></div>
                                                </div>
                                                <div className="w-20 h-6 bg-success/20 text-success rounded-full opacity-60"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </MagicBentoCard>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-secondary/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-3xl font-bold text-foreground leading-none">100+</div>
                        <div className="text-sm text-muted-foreground mt-2">Compliance Controls</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-foreground leading-none">2 min</div>
                        <div className="text-sm text-muted-foreground mt-2">To Seed Framework</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-foreground leading-none">90%</div>
                        <div className="text-sm text-muted-foreground mt-2">Time Reduction</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-foreground leading-none">24/7</div>
                        <div className="text-sm text-muted-foreground mt-2">Evidence Readiness</div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How it works</h2>
                        <p className="text-muted-foreground">Three simple steps to build your compliance posture.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <MagicBentoCard className="p-8 rounded-2xl bg-white/[0.01] magic-bento-card--border-glow" spotlightColor="132, 0, 255">
                            <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center font-bold text-xl mb-6">1</div>
                            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <Search className="w-5 h-5 text-primary" /> Seed Framework
                            </h3>
                            <p className="text-muted-foreground mt-4">
                                Instantly populate your library with SOC 2 or ISO 27001 controls.
                                Our seed engine creates a baseline of standard compliance requirements.
                            </p>
                        </MagicBentoCard>

                        <MagicBentoCard className="p-8 rounded-2xl bg-white/[0.01] magic-bento-card--border-glow" spotlightColor="132, 0, 255">
                            <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center font-bold text-xl mb-6">2</div>
                            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <Files className="w-5 h-5 text-primary" /> Map Evidence
                            </h3>
                            <p className="text-muted-foreground mt-4">
                                Upload policies and technical evidence. Link them directly to controls
                                to satisfy auditor requirements and track your real-time progress.
                            </p>
                        </MagicBentoCard>

                        <MagicBentoCard className="p-8 rounded-2xl bg-white/[0.01] magic-bento-card--border-glow" spotlightColor="132, 0, 255">
                            <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center font-bold text-xl mb-6">3</div>
                            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary" /> Export Audit
                            </h3>
                            <p className="text-muted-foreground mt-4">
                                When you're ready, generate a comprehensive audit export. Download
                                all evidence and summary reports to share with your audit firm.
                            </p>
                        </MagicBentoCard>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-card border-y border-white/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-foreground">
                                Everything you need to <br />
                                <span className="text-primary">pass your next audit.</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1 text-foreground">Centralized Control Management</h4>
                                        <p className="text-muted-foreground text-sm">Unified dashboard to track all your security controls across multiple frameworks.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <Lock className="text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1 text-foreground">Secure Evidence Storage</h4>
                                        <p className="text-muted-foreground text-sm">Organized, searchable, and secure folder structure for all your compliance artifacts.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <BarChart3 className="text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1 text-foreground">Interactive Analytics</h4>
                                        <p className="text-muted-foreground text-sm">Visual progress tracking and task management to ensure nothing falls through the cracks.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <MagicBentoCard className="p-6 rounded-2xl bg-white/[0.01] magic-bento-card--border-glow" spotlightColor="132, 0, 255">
                                        <div className="text-2xl font-bold mb-1 text-foreground">SOC 2</div>
                                        <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase">Type I & II</p>
                                    </MagicBentoCard>
                                    <MagicBentoCard className="p-6 rounded-2xl h-48 bg-white/[0.01] magic-bento-card--border-glow" spotlightColor="132, 0, 255">
                                        <div className="text-muted-foreground text-sm mb-4">Progress</div>
                                        <div className="progress-bar w-full bg-white/10 border border-white/5 overflow-hidden">
                                            <div className="progress-bar-fill w-[75%] bg-gradient-to-r from-white/20 via-white/50 to-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
                                        </div>
                                        <div className="mt-4 text-2xl font-bold text-foreground">75% Ready</div>
                                    </MagicBentoCard>
                                </div>
                                <div className="space-y-4 pt-12">
                                    <MagicBentoCard className="p-6 rounded-2xl h-48 bg-primary/10 magic-bento-card--border-glow" spotlightColor="132, 0, 255">
                                        <CheckCircle2 className="w-8 h-8 text-primary mb-4" />
                                        <div className="text-xl font-bold mb-2 text-foreground">Audit Ready</div>
                                        <p className="text-xs text-muted-foreground">Evidence verified and approved.</p>
                                    </MagicBentoCard>
                                    <MagicBentoCard className="p-6 rounded-2xl bg-white/[0.01] magic-bento-card--border-glow" spotlightColor="132, 0, 255">
                                        <div className="text-2xl font-bold mb-1 text-foreground">ISO 27001</div>
                                        <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase">Information Security</p>
                                    </MagicBentoCard>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 bg-primary relative overflow-hidden text-center text-white">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to simplify <br /> your compliance?</h2>
                    <p className="text-lg text-white/80 mb-10">
                        Join other SMB SaaS companies who save hundreds of hours every year.
                        Start your compliance journey with ComplianceCheckpoint today.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-10 py-5 bg-white text-primary rounded-xl font-bold shadow-xl hover:bg-gray-100 transition-all hover-lift"
                    >
                        Get Started Now <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 grayscale brightness-200 opacity-70 hover:grayscale-0 hover:brightness-100 transition-all cursor-pointer">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <span className="font-bold text-foreground tracking-tight">ComplianceCP</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} ComplianceCheckpoint. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
