import { useEffect, useState } from "react";
import { getDashboardData } from "./api/dashboardApi";
import {
  getProposals,
  createProposal,
  deleteProposal,
  updateProposal,
  generateProposalDraft,
  downloadProposalPdf,
  downloadProposalDocx,
} from "./api/proposalsApi";
import ReactMarkdown from "react-markdown";
/* ═══════════════════════════════════════════════════════════════ */
/*  INLINE SVG ICONS                                               */
/* ═══════════════════════════════════════════════════════════════ */
const I = ({ children, size = 16, className = "", ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>{children}</svg>
);
const GridIcon = (p) => <I {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></I>;
const BookIcon = (p) => <I {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"/></I>;
const BriefIcon = (p) => <I {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></I>;
const UsersIcon = (p) => <I {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></I>;
const ImageIcon = (p) => <I {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></I>;
const FileIcon = (p) => <I {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></I>;
const ChartIcon = (p) => <I {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></I>;
const ChatIcon = (p) => <I {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></I>;
const GearIcon = (p) => <I {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1.08 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1.08z"/></I>;
const RadarIcon = (p) => <I {...p}><path d="M19.07 4.93A10 10 0 0 0 2 12c0 5.52 4.48 10 10 10a10 10 0 0 0 7.07-17.07z"/><path d="M12 12l4.24-4.24"/><circle cx="12" cy="12" r="2"/></I>;
const TargetIcon = (p) => <I {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></I>;
const InboxIcon = (p) => <I {...p}><polyline points="22,12 16,12 14,15 10,15 8,12 2,12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></I>;
const SendIcon = (p) => <I {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></I>;
const MailIcon = (p) => <I {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></I>;
const SearchIcon = (p) => <I {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></I>;
const PlusIcon = (p) => <I {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></I>;
const TrendIcon = (p) => <I {...p}><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></I>;
const SparkIcon = (p) => <I {...p}><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"/></I>;
const XIcon = (p) => <I {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></I>;
const CheckIcon = (p) => <I {...p}><polyline points="20,6 9,17 4,12"/></I>;
const ClockIcon = (p) => <I {...p}><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></I>;
const ShieldIcon = (p) => <I {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></I>;
const PenIcon = (p) => <I {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></I>;
const TrashIcon = (p) => <I {...p}><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></I>;
const LogOutIcon = (p) => <I {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></I>;
const SaveIcon = (p) => <I {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></I>;
const BotIcon = (p) => <I {...p}><path d="M12 8V4H8"/><rect x="2" y="8" width="20" height="12" rx="2"/><circle cx="8" cy="14" r="2"/><circle cx="16" cy="14" r="2"/></I>;
const KeyIcon = (p) => <I {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></I>;
const GlobeIcon = (p) => <I {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></I>;
const SlidersIcon = (p) => <I {...p}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><circle cx="4" cy="12" r="2"/><circle cx="12" cy="10" r="2"/><circle cx="20" cy="14" r="2"/></I>;
const CodeIcon = (p) => <I {...p}><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></I>;
const RssIcon = (p) => <I {...p}><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></I>;
const PlayIcon = (p) => <I {...p}><polygon points="5,3 19,12 5,21"/></I>;
const LayersIcon = (p) => <I {...p}><polygon points="12,2 2,7 12,12 22,7"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/></I>;
const Share2Icon = (p) => <I {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/></I>;
const PlugIcon = (p) => <I {...p}><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a6 6 0 0 1-12 0V8z"/></I>;
const ArrowRightIcon = (p) => <I {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></I>;
const RefreshIcon = (p) => <I {...p}><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></I>;
const AlertIcon = (p) => <I {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></I>;
const DownloadIcon = (p) => <I {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></I>;
const FolderIcon = (p) => <I {...p}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></I>;
const LinkIcon = (p) => <I {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></I>;
const EyeIcon = (p) => <I {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></I>;
const TagIcon = (p) => <I {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></I>;
const ZapIcon = (p) => <I {...p}><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></I>;
const FilterIcon = (p) => <I {...p}><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></I>;

/* ═══════════════════════════════════════════════════════════════ */
/*  SHARED UI                                                      */
/* ═══════════════════════════════════════════════════════════════ */
const Badge = ({ label, color = "bg-gray-100 text-gray-600" }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>{label}</span>
);

const StageBadge = ({ stage }) => {
  const map = {
    "Detected":       "bg-blue-100 text-blue-700",
    "Researching":    "bg-cyan-100 text-cyan-700",
    "Contacted":      "bg-indigo-100 text-indigo-700",
    "Replied":        "bg-amber-100 text-amber-700",
    "In Conversation":"bg-purple-100 text-purple-700",
    "Won":            "bg-green-100 text-green-700",
    "Lost":           "bg-red-100 text-red-700",
    "Customer":       "bg-emerald-100 text-emerald-700",
  };
  return <Badge label={stage} color={map[stage] || "bg-gray-100 text-gray-600"} />;
};

const Btn = ({ variant = "primary", children, icon, className = "", small, ...p }) => {
  const v = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    teal: "bg-teal-500 text-white hover:bg-teal-600",
    ghost: "text-gray-500 hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button className={`inline-flex items-center gap-1.5 font-medium rounded-lg transition-colors text-xs ${small ? "px-2.5 py-1.5" : "px-3.5 py-2"} ${v[variant] || v.primary} ${className}`} {...p}>
      {icon}{children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>{children}</div>
);

const Section = ({ title, IconComp, desc, badge, children }) => (
  <Card className="p-5">
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center"><IconComp size={14} className="text-indigo-600" /></div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {desc && <p className="text-xs text-gray-400">{desc}</p>}
        </div>
      </div>
      {badge}
    </div>
    {children}
  </Card>
);

const Tag = ({ label }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
    {label}<button className="hover:text-indigo-900"><XIcon size={9} /></button>
  </span>
);

const TagInput = ({ tags, placeholder }) => (
  <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded-lg bg-white min-h-[32px]">
    {tags.map(t => <Tag key={t} label={t} />)}
    <input type="text" placeholder={tags.length === 0 ? placeholder : ""} className="flex-1 min-w-[80px] outline-none text-xs bg-transparent placeholder-gray-400" />
  </div>
);

const KpiCard = ({ icon: Ic, label, value, sub, color }) => (
  <Card className="p-4">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Ic size={18} /></div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  </Card>
);

const Input = (p) => <input className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" {...p} />;
const Select = ({ children, ...p }) => <select className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" {...p}>{children}</select>;
const Field = ({ label, hint, children }) => (
  <div className="mb-3">
    <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════════════ */
/*  PAGE: UNIFIED DASHBOARD                                        */
/* ═══════════════════════════════════════════════════════════════ */
function DashboardPage() {
    const [dashboardData, setDashboardData] = useState({
    detected: 0,
    researched: 0,
    contacted: 0,
    pending_review: 0,
    replied: 0,
    won: 0,
     });

  useEffect(() => {
  getDashboardData().then((data) => {
    console.log("Datos recibidos:", data);
    setDashboardData(data);
    });



    }, []);

  return (
    
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500">Full-funnel view — from discovery to conversion</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" icon={<RefreshIcon size={13} />}>Refresh</Btn>
          <Btn variant="teal" icon={<PlayIcon size={13} />}>Run Pipeline</Btn>
        </div>
      </div>

      {/* Full-funnel KPI row */}
      <div className="grid grid-cols-6 gap-3">
        
        <KpiCard icon={SearchIcon} label="Detected" value={dashboardData.detected} sub="this week" color="bg-blue-50 text-blue-600" />
        <KpiCard icon={UsersIcon} label="Researched" value={dashboardData.researched} sub="contacts" color="bg-cyan-50 text-cyan-600" />            
        <KpiCard icon={MailIcon} label="Contacted" value={dashboardData.contacted} sub="emails" color="bg-indigo-50 text-indigo-600" />
        <KpiCard icon={AlertIcon} label="Pending Review" value={dashboardData.pending_review} sub="need attention" color="bg-amber-50 text-amber-600" />
        <KpiCard icon={ChatIcon} label="Replied" value={dashboardData.replied} sub="conversations" color="bg-purple-50 text-purple-600" />
        <KpiCard icon={CheckIcon} label="Won" value={dashboardData.won} sub="new clients" color="bg-green-50 text-green-600" />
      </div>

      {/* Full-funnel visualization */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-900">Opportunity Funnel (last 7 days)</p>
          <div className="flex gap-1 text-xs text-gray-400">
            <span>Intelligence</span><span>→</span><span>Content</span><span>→</span><span>Outreach</span><span>→</span><span>Conversion</span>
          </div>
        </div>
        <div className="space-y-2.5">
          {[
            { label: "Jobs scanned by Scout", val: "342", w: "100%", color: "bg-blue-300", icon: "🔍" },
            { label: "Relevant opportunities (score ≥ 60%)", val: "89", w: "26%", color: "bg-blue-500", icon: "🎯" },
            { label: "Contacts enriched by Researcher", val: "214", w: "62%", color: "bg-cyan-500", icon: "👤" },
            { label: "Content matched from library", val: "178", w: "52%", color: "bg-indigo-400", icon: "📄" },
            { label: "Personalized emails sent", val: "156", w: "45%", color: "bg-indigo-600", icon: "✉️" },
            { label: "Replies received", val: "18", w: "5%", color: "bg-purple-500", icon: "💬" },
            { label: "Deals won", val: "7", w: "2%", color: "bg-green-500", icon: "🏆" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <span className="text-sm w-5">{f.icon}</span>
              <span className="text-xs text-gray-600 w-56 shrink-0">{f.label}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${f.color} rounded-full transition-all`} style={{width:f.w}} /></div>
              <span className="text-xs font-semibold text-gray-700 w-10 text-right">{f.val}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Two-column: Activity + Content impact */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs font-semibold text-gray-700 mb-3">Pipeline Activity (14 days)</p>
          <div className="h-32 bg-gradient-to-t from-indigo-50 to-transparent rounded-lg flex items-end justify-around px-4 pb-2">
            {[40,65,45,70,55,80,60,75,85,50,90,70,65,78].map((h,i) => (
              <div key={i} className="w-2 rounded-t" style={{height:`${h}%`, background: i%2===0 ? "#818cf8" : "#2dd4bf"}} />
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-2 h-2 rounded bg-indigo-400"/>Emails</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-2 h-2 rounded bg-teal-400"/>Replies</span>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold text-gray-700 mb-3">Content Used in Outreach</p>
          <div className="space-y-2.5">
            {[
              { name: "BPO Guide for Finance", type: "Case Study", uses: 23, color: "bg-indigo-500" },
              { name: "Data Entry Services", type: "Proposal", uses: 18, color: "bg-teal-500" },
              { name: "Customer Support Excellence", type: "Whitepaper", uses: 12, color: "bg-amber-500" },
              { name: "Follow-up Email", type: "Template", uses: 45, color: "bg-purple-500" },
            ].map(c => (
              <div key={c.name} className="flex items-center gap-2">
                <div className={`w-1 h-8 rounded-full ${c.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.type}</p>
                </div>
                <span className="text-xs font-semibold text-gray-600">{c.uses}×</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Latest pipeline run */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-700">Last Pipeline Run — 2 hours ago</p>
          <Badge label="Completed" color="bg-green-100 text-green-700" />
        </div>
        <div className="flex items-center gap-2">
          {[
            { label: "Scout", sub: "23 leads", color: "bg-blue-500", done: true },
            { label: "Research", sub: "67 contacts", color: "bg-cyan-500", done: true },
            { label: "Match Content", sub: "14 assets", color: "bg-indigo-500", done: true },
            { label: "Compose", sub: "45 emails", color: "bg-purple-500", done: true },
            { label: "Review", sub: "12 pending", color: "bg-amber-500", done: false },
            { label: "Send", sub: "33 sent", color: "bg-green-500", done: true },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 flex-1">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${s.done ? s.color : "bg-gray-300"}`}>
                    {s.done ? <CheckIcon size={10} /> : i + 1}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{s.label}</span>
                </div>
                <p className="text-xs text-gray-400 ml-6">{s.sub}</p>
              </div>
              {i < 5 && <div className={`w-6 h-0.5 ${s.done ? s.color : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  PAGE: OPPORTUNITIES (merged Leads + Customers)                 */
/* ═══════════════════════════════════════════════════════════════ */
function OpportunitiesPage() {
  const [stageFilter, setStageFilter] = useState("All");
  const stages = ["All","Detected","Researching","Contacted","Replied","In Conversation","Won","Customer","Lost"];

  const opps = [
    { company: "FinServe Global", job: "Data Entry Specialist", contact: "Sarah Chen", role: "VP Operations", stage: "Replied", score: 92, source: "JSearch", kw: ["data entry","back office"], content: "BPO Guide for Finance", date: "Apr 15" },
    { company: "MedTech Inc", job: "Customer Support Lead", contact: "James Wilson", role: "Head of HR", stage: "Contacted", score: 87, source: "Indeed", kw: ["customer support"], content: "Support Excellence", date: "Apr 15" },
    { company: "RetailMax", job: "Accounts Payable Clerk", contact: "Ana Ruiz", role: "Procurement Mgr", stage: "Detected", score: 78, source: "JSearch", kw: ["accounting","BPO"], content: "—", date: "Apr 14" },
    { company: "LogiCorp", job: "Back Office Manager", contact: "Mike Ross", role: "COO", stage: "Won", score: 95, source: "RSS", kw: ["back office","outsourcing"], content: "Outsourcing Playbook", date: "Apr 12" },
    { company: "StartupXYZ", job: "Virtual Assistant", contact: "Lisa Park", role: "Founder", stage: "In Conversation", score: 65, source: "Scraper", kw: ["outsourcing"], content: "Follow-up Template", date: "Apr 10" },
    { company: "DataFlow Inc", job: "Data Analyst", contact: "Tom Brown", role: "VP Data", stage: "Customer", score: 88, source: "JSearch", kw: ["data entry"], content: "Data Entry Services", date: "Mar 28" },
  ];

  const filtered = stageFilter === "All" ? opps : opps.filter(o => o.stage === stageFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-xs text-gray-500">Track every prospect from first detection through conversion</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" icon={<DownloadIcon size={13} />}>Export</Btn>
          <Btn icon={<PlusIcon size={14} />}>Add Manually</Btn>
        </div>
      </div>

      {/* Stage pipeline visualization */}
      <Card className="p-3">
        <div className="flex gap-1">
          {stages.map(s => {
            const count = s === "All" ? opps.length : opps.filter(o => o.stage === s).length;
            const active = stageFilter === s;
            return (
              <button key={s} onClick={() => setStageFilter(s)}
                className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors text-center ${
                  active ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}>
                <span className="block">{s}</span>
                <span className={`text-lg font-bold ${active ? "text-white" : "text-gray-900"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Opportunities table */}
      <Card>
        <table className="w-full text-xs">
          <thead><tr className="bg-slate-50 text-slate-600 uppercase">
            <th className="px-4 py-2.5 text-left font-medium">Company</th>
            <th className="px-4 py-2.5 text-left font-medium">Opportunity</th>
            <th className="px-4 py-2.5 text-left font-medium">Contact</th>
            <th className="px-4 py-2.5 text-left font-medium">Stage</th>
            <th className="px-4 py-2.5 text-left font-medium">Score</th>
            <th className="px-4 py-2.5 text-left font-medium">Content Used</th>
            <th className="px-4 py-2.5 text-left font-medium">Last Activity</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((o) => (
              <tr key={o.company + o.job} className="hover:bg-slate-50 cursor-pointer">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{o.company}</p>
                  <div className="flex gap-1 mt-0.5">{o.kw.map(k => <span key={k} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">{k}</span>)}</div>
                </td>
                <td className="px-4 py-3 text-indigo-600 font-medium">{o.job}</td>
                <td className="px-4 py-3">
                  <p className="text-gray-800">{o.contact}</p>
                  <p className="text-gray-400">{o.role}</p>
                </td>
                <td className="px-4 py-3"><StageBadge stage={o.stage} /></td>
                <td className="px-4 py-3"><span className={`text-xs font-bold ${o.score >= 80 ? "text-green-600" : o.score >= 70 ? "text-amber-600" : "text-gray-500"}`}>{o.score}%</span></td>
                <td className="px-4 py-3">
                  {o.content !== "—" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-indigo-600"><LinkIcon size={10} />{o.content}</span>
                  ) : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3 text-gray-500">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  PAGE: CONTENT LIBRARY (merged Assets, Proposals, Templates)    */
/* ═══════════════════════════════════════════════════════════════ */
function ContentLibraryPage() {
  const [proposals, setProposals] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProposal, setEditingProposal] = useState(null);
  const [viewingProposal, setViewingProposal] = useState(null);
  const [contentTitle, setContentTitle] = useState("");
  const [contentDescription, setContentDescription] = useState("");
  
  useEffect(() => {
    const loadProposals = async () => {
      try {
        const data = await getProposals();
        setProposals(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadProposals();
  }, []);

  const handleDeleteProposal = async (id) => {
  await deleteProposal(id);

  const updatedProposals = await getProposals();
  setProposals(updatedProposals);
  };

  const [createType, setCreateType] = useState("Case Study");
  const types = ["All", "Case Study", "Proposal", "Template", "Whitepaper", "Social Post"];

  const items = [
    { title: "BPO Guide for Finance", type: "Case Study", industry: "Finance", services: ["data entry","back office"], status: "Published", uses: 23, date: "Apr 15" },
    { title: "BPO Proposal for Fintech", type: "Proposal", industry: "Finance", services: ["BPO"], status: "Sent", uses: 8, date: "Apr 14" },
    { title: "Follow-up Email", type: "Template", industry: "General", services: ["outreach"], status: "Active", uses: 45, date: "Apr 14" },
    { title: "Customer Support Excellence", type: "Whitepaper", industry: "Healthcare", services: ["customer support"], status: "Published", uses: 12, date: "Apr 12" },
    { title: "Outsourcing Playbook 2026", type: "Case Study", industry: "General", services: ["outsourcing","BPO"], status: "Draft", uses: 0, date: "Apr 10" },
    { title: "Cold Outreach – Data Entry", type: "Template", industry: "General", services: ["data entry"], status: "Active", uses: 31, date: "Apr 8" },
    { title: "LinkedIn Posts: Q2", type: "Social Post", industry: "General", services: ["brand"], status: "Generating...", uses: 0, date: "Apr 8" },
    { title: "Data Entry Services", type: "Proposal", industry: "Retail", services: ["data entry","accounting"], status: "Accepted", uses: 18, date: "Apr 5" },
  ];

  const realProposalItems = proposals.map((proposal) => ({
  id: proposal.id,
  title: proposal.title,
  type: "Proposal",
  status: proposal.status || "Draft",
  industry: proposal.description || "Created from backend",
  services: ["backend"],
  uses: 0,
  date: "Today",
}));

const allItems = [...items, ...realProposalItems];

const filtered =
  typeFilter === "All"
    ? allItems
    : allItems.filter((item) => item.type === typeFilter);

  const typeIcon = (t) => {
    const m = { "Case Study": BookIcon, "Proposal": BriefIcon, "Template": FileIcon, "Whitepaper": LayersIcon, "Social Post": Share2Icon };
    return m[t] || FileIcon;
  };
  const typeColor = (t) => {
    const m = { "Case Study": "text-indigo-600 bg-indigo-50", "Proposal": "text-teal-600 bg-teal-50", "Template": "text-amber-600 bg-amber-50", "Whitepaper": "text-purple-600 bg-purple-50", "Social Post": "text-pink-600 bg-pink-50" };
    return m[t] || "text-gray-600 bg-gray-50";
  };
  const statusColor = (s) => {
    const m = { "Published": "bg-green-100 text-green-700", "Active": "bg-green-100 text-green-700", "Sent": "bg-blue-100 text-blue-700", "Accepted": "bg-green-100 text-green-700", "Draft": "bg-gray-100 text-gray-600", "Generating...": "bg-yellow-100 text-yellow-700" };
    return m[s] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Content Library</h1>
          <p className="text-xs text-gray-500">Case studies, proposals, templates, and assets — all in one place. AI agents pull from here to personalize outreach.</p>
        </div>
        <Btn icon={<PlusIcon size={14} />} onClick={() => setShowCreateModal(true)}>Create Content</Btn>
      </div>

      {/* Type filter tabs */}
      <div className="flex gap-2">
        {types.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${typeFilter === t ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {t}{t !== "All" && <span className="ml-1 opacity-60">{items.filter(i => t === "All" || i.type === t).length}</span>}
          </button>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-3 gap-3">
        {filtered.map(item => {
          const Ic = typeIcon(item.type);
          return (
            <Card key={item.title} className="p-4 hover:border-indigo-200 cursor-pointer transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColor(item.type)}`}><Ic size={14} /></div>
                  <Badge label={item.type} color={typeColor(item.type)} />
                </div>
                <Badge label={item.status} color={statusColor(item.status)} />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">{item.title}</p>
              <div
                className="text-xs text-gray-400 mb-2 line-clamp-3"
                dangerouslySetInnerHTML={{
              __html: `${item.industry || ""} · Updated ${item.date}`,
              }}
              />
              <div className="flex flex-wrap gap-1 mb-3">
                {item.services.map(s => <span key={s} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">{s}</span>)}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  {item.uses > 0 ? <><LinkIcon size={10} /> Used in {item.uses} emails</> : "Not yet used"}
                </span>
                
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100">

                  <button
                    onClick={() => setViewingProposal(item)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <EyeIcon size={11} className="text-gray-400" />
                  </button>

                  <button
                    onClick={() => setEditingProposal(item)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <PenIcon size={11} className="text-gray-400" />
                  </button>

                  {item.type === "Proposal" && (
                    <button
                      onClick={() => handleDeleteProposal(item.id)}
                      className="p-1 rounded hover:bg-red-100"
                    >
                      <TrashIcon size={11} className="text-red-500" />
                    </button>
                  )}

                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Create Content Modal ── */}
{showCreateModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setShowCreateModal(false)}
    />

    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <PlusIcon size={16} className="text-indigo-600" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900">Create Content</h2>
            <p className="text-xs text-gray-400">Add a new item to your Content Library</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(false)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <XIcon size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <Field label="Content type">
          <div className="grid grid-cols-5 gap-1.5">
            {["Case Study", "Proposal", "Template", "Whitepaper", "Social Post"].map((t) => {
              const Ic = typeIcon(t);
              const active = createType === t;

              return (
                <button
                  key={t}
                  onClick={() => setCreateType(t)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-colors ${
                    active
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <Ic size={16} />
                  <span className="text-xs font-medium leading-tight">{t}</span>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Title">
          <Input
            placeholder={`e.g. "${
              createType === "Template"
                ? "Follow-up after demo"
                : createType === "Proposal"
                ? "BPO Proposal for [Client]"
                : "Outsourcing in Healthcare"
            }"`}
            value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
          />
        </Field>

        {createType !== "Social Post" && (
          <Field
            label="Description"
            hint="Brief summary — the AI will use this when referencing your content in outreach emails."
          >
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20"
              placeholder="What is this content about? What value does it demonstrate?"
              value={contentDescription}
              onChange={(e) => setContentDescription(e.target.value)}
            />
          </Field>
        )}
        
        {(createType === "Case Study" ||
          createType === "Whitepaper" ||
          createType === "Proposal" ||
          createType === "Template") && (
        <Field label="Content source">
          <div className="space-y-2">
          <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:border-indigo-200 transition-colors">
          <input type="radio" name="source" defaultChecked className="accent-indigo-600" />
        <SparkIcon size={14} className="text-indigo-500" />
          <div>
          <p className="text-xs font-medium text-gray-800">Generate with AI</p>
          <p className="text-xs text-gray-400">AI creates the content based on title and tags</p>
        </div>
      </label>

      <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:border-indigo-200 transition-colors">
        <input type="radio" name="source" className="accent-indigo-600" />
        <DownloadIcon size={14} className="text-gray-400" />
        <div>
          <p className="text-xs font-medium text-gray-800">Upload existing file</p>
          <p className="text-xs text-gray-400">PDF, DOCX, or plain text</p>
        </div>
      </label>

      <label className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:border-indigo-200 transition-colors">
        <input type="radio" name="source" className="accent-indigo-600" />
        <PenIcon size={14} className="text-gray-400" />
        <div>
          <p className="text-xs font-medium text-gray-800">Write manually</p>
          <p className="text-xs text-gray-400">Enter content directly in the editor</p>
        </div>
      </label>
    </div>
  </Field>
)}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <Btn variant="ghost" onClick={() => setShowCreateModal(false)}>
          Cancel
        </Btn>

        <div className="flex gap-2">
          <Btn variant="secondary" icon={<SaveIcon size={12} />}>
            Save as Draft
          </Btn>
        <Btn
          icon={<SparkIcon size={13} />}
          onClick={async () => {
        try {
        // 1. Crear proposal
         const newProposal = await createProposal({
            title: contentTitle,
            description: contentDescription,
            status: "draft",
          });

          // 2. Generar draft con IA
            await generateProposalDraft(newProposal.id);

          // 3. Refrescar proposals
            const updatedProposals = await getProposals();
            setProposals(updatedProposals);

          // 4. Limpiar modal
            setContentTitle("");
            setContentDescription("");
            setShowCreateModal(false);

            alert("Proposal generada con IA correctamente");
          } catch (error) {
            console.error(error);
            alert("Error generating proposal");
          }
            }}
          >
            Create & Generate
          </Btn>
        </div>
      </div>
    </div>
  </div>
)}

{/* ── View Proposal Modal ── */}
{viewingProposal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setViewingProposal(null)}
    />

    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {viewingProposal.title}
          </h2>
          <p className="text-xs text-gray-400">
            Proposal Preview
          </p>
        </div>

        <button
          onClick={() => setViewingProposal(null)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <XIcon size={16} className="text-gray-400" />
        </button>
      </div>

      <div
        className="p-6 prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{
          __html: viewingProposal.industry || "",
        }}
      />

      <div className="flex justify-end gap-2 p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <Btn variant="secondary" onClick={() => setViewingProposal(null)}>
          Close
        </Btn>
      <Btn
            onClick={() => {
            window.open(
            `http://127.0.0.1:8000/api/v1/proposals/${viewingProposal.id}/download?format=pdf`,
            "_blank"
          );
        }}
      >
          Download PDF
      </Btn>
    <Btn
        onClick={() => {
        window.open(
        `http://127.0.0.1:8000/api/v1/proposals/${viewingProposal.id}/download?format=docx`,"_blank"  
            );
          }}
        >
        Download Word
        </Btn>
      </div>
    </div>
  </div>
)}
{/* ── Edit Proposal Modal ── */}
{editingProposal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setEditingProposal(null)}
    />

    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Edit Proposal
      </h2>

      <div className="space-y-3">
        <Input
          value={editingProposal.title}
          onChange={(e) =>
            setEditingProposal({
              ...editingProposal,
              title: e.target.value,
            })
          }
          placeholder="Proposal title"
        />

        <div
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm max-h-80 overflow-y-auto"
          dangerouslySetInnerHTML={{
          __html: editingProposal.industry || "",
        }}
      />
        <div className="flex justify-end gap-2 pt-3">
          <Btn variant="ghost" onClick={() => setEditingProposal(null)}>
            Cancel
          </Btn>

          <Btn
            onClick={async () => {
              await updateProposal(editingProposal.id, {
                title: editingProposal.title,
                description: editingProposal.industry,
                status: editingProposal.status,
              });

              const updated = await getProposals();
              setProposals(updated);

              setEditingProposal(null);
            }}
          >
            Save Changes
          </Btn>
        </div>
      </div>
    </div>
  </div>
)}
  </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  PAGE: OUTREACH (merged Review Queue + Outreach History)        */
/* ═══════════════════════════════════════════════════════════════ */
function OutreachPage() {
  const [tab, setTab] = useState("review");
  const [selected, setSelected] = useState(0);

  const reviewEmails = [
    { to: "Sarah Chen", role: "VP Operations", company: "FinServe Global", vacancy: "Data Entry Specialist", score: 92, contentRef: "BPO Guide for Finance", subject: "Optimize your data entry with NoonDalton", preview: "Dear Sarah,\n\nI noticed that FinServe Global is looking for a Data Entry Specialist. At NoonDalton, we help financial services companies scale their back-office operations with dedicated teams.\n\nDrawing from our experience documented in our BPO Guide for Finance, we've helped similar organizations reduce operational costs by up to 40%.\n\nWould you have 15 minutes this week for a brief call?" },
    { to: "James Wilson", role: "Head of HR", company: "MedTech Inc", vacancy: "Customer Support Lead", score: 74, contentRef: "Support Excellence", subject: "Specialized Customer Support for MedTech", preview: "Dear James,\n\nI saw that MedTech Inc is looking for a Customer Support Lead. At NoonDalton, we have extensive experience providing specialized customer support teams for the healthcare sector.\n\nOur whitepaper on Customer Support Excellence outlines the frameworks we use with healthcare clients.\n\nCould we schedule a 20-minute demo?" },
    { to: "Ana Ruiz", role: "Procurement Mgr", company: "RetailMax", vacancy: "Accounts Payable Clerk", score: 68, contentRef: "Data Entry Services", subject: "Accounts Payable as a Service for RetailMax", preview: "Dear Ana,\n\nI noticed the AP Clerk opening at RetailMax. NoonDalton offers comprehensive accounts payable services that could reduce your operational costs by up to 40%.\n\nOur Data Entry Services proposal for the retail sector details our approach." },
  ];

  const history = [
    { name: "Sarah Chen", co: "FinServe Global", subj: "Optimize your data entry...", st: "Replied", stc: "bg-green-100 text-green-700", date: "Apr 15", score: "92%", content: "BPO Guide" },
    { name: "Mike Ross", co: "LogiCorp", subj: "Back office outsourcing...", st: "Opened", stc: "bg-blue-100 text-blue-700", date: "Apr 15", score: "95%", content: "Outsourcing Playbook" },
    { name: "Lisa Park", co: "DataFlow", subj: "Professional data entry...", st: "Sent", stc: "bg-gray-100 text-gray-600", date: "Apr 14", score: "88%", content: "Data Entry Services" },
    { name: "Tom Brown", co: "HealthCo", subj: "BPO customer support...", st: "Opened", stc: "bg-blue-100 text-blue-700", date: "Apr 14", score: "81%", content: "Support Excellence" },
    { name: "Ana Ruiz", co: "RetailMax", subj: "AP as a service...", st: "Bounced", stc: "bg-red-100 text-red-700", date: "Apr 13", score: "68%", content: "Data Entry Services" },
  ];

  const e = reviewEmails[selected];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Outreach</h1>
          <p className="text-xs text-gray-500">Review pending emails and track sent communications</p>
        </div>
        {tab === "review" && (
          <div className="flex gap-2">
            <Btn variant="destructive" small icon={<XIcon size={12} />}>Reject All</Btn>
            <Btn variant="teal" small icon={<CheckIcon size={12} />}>Approve All</Btn>
          </div>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button onClick={() => setTab("review")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${tab === "review" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
          <InboxIcon size={13} />Review Queue
          <span className="bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">3</span>
        </button>
        <button onClick={() => setTab("history")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${tab === "history" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
          <ClockIcon size={13} />Sent History
        </button>
      </div>

      {tab === "review" && (
        <div className="grid gap-4" style={{gridTemplateColumns:"2fr 3fr"}}>
          {/* Email list */}
          <div className="space-y-2">
            {reviewEmails.map((em, i) => (
              <div key={i} onClick={() => setSelected(i)}
                className={`p-3 rounded-xl border cursor-pointer transition-colors ${selected === i ? "border-indigo-300 bg-indigo-50" : "border-gray-100 bg-white hover:border-gray-200"}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-900">{em.to}</p>
                  <span className={`text-xs font-bold ${em.score >= 80 ? "text-green-600" : "text-amber-600"}`}>{em.score}%</span>
                </div>
                <p className="text-xs text-gray-500">{em.role} · {em.company}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{em.subject}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {em.score >= 80 && <Badge label="Auto-approved" color="bg-green-100 text-green-700" />}
                  <span className="text-xs text-indigo-500 flex items-center gap-0.5"><LinkIcon size={9} />{em.contentRef}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Email preview */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">{e.to}</p>
                <p className="text-xs text-gray-500">{e.role} @ {e.company}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${e.score >= 80 ? "text-green-600" : "text-amber-600"}`}>{e.score}%</span>
                <Badge label={e.score >= 80 ? "High confidence" : "Review suggested"} color={e.score >= 80 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"} />
              </div>
            </div>
            <div className="flex gap-3 mb-3">
              <div className="flex-1 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Opportunity</p>
                <p className="text-xs font-medium text-gray-800">{e.vacancy} @ {e.company}</p>
              </div>
              <div className="flex-1 p-2 bg-indigo-50 rounded-lg">
                <p className="text-xs text-indigo-400">Content referenced</p>
                <p className="text-xs font-medium text-indigo-700 flex items-center gap-1"><LinkIcon size={10} />{e.contentRef}</p>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Subject:</p>
              <p className="text-xs font-semibold text-gray-900">{e.subject}</p>
            </div>
            <div className="mb-4 p-3 bg-white border border-gray-200 rounded-lg">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{e.preview}</pre>
            </div>
            <div className="flex gap-2 justify-end">
              <Btn variant="ghost" small icon={<RefreshIcon size={12} />}>Regenerate</Btn>
              <Btn variant="secondary" small icon={<PenIcon size={12} />}>Edit</Btn>
              <Btn variant="destructive" small icon={<XIcon size={12} />}>Reject</Btn>
              <Btn variant="teal" icon={<CheckIcon size={13} />}>Approve & Send</Btn>
            </div>
          </Card>
        </div>
      )}

      {tab === "history" && (
        <>
          <div className="flex gap-2">{["All","Sent","Opened","Replied","Bounced"].map((t,i)=>(
            <button key={t} className={`px-3 py-1.5 rounded-full text-xs font-medium ${i===0 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t}</button>
          ))}</div>
          <Card>
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-50 text-slate-600 uppercase">
                <th className="px-4 py-2.5 text-left font-medium">Contact</th>
                <th className="px-4 py-2.5 text-left font-medium">Company</th>
                <th className="px-4 py-2.5 text-left font-medium">Subject</th>
                <th className="px-4 py-2.5 text-left font-medium">Content Used</th>
                <th className="px-4 py-2.5 text-left font-medium">Status</th>
                <th className="px-4 py-2.5 text-left font-medium">Sent</th>
                <th className="px-4 py-2.5 text-left font-medium">Score</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((o) => (
                  <tr key={o.name} className="hover:bg-slate-50 cursor-pointer">
                    <td className="px-4 py-3 font-medium text-gray-900">{o.name}</td>
                    <td className="px-4 py-3 text-gray-600">{o.co}</td>
                    <td className="px-4 py-3 text-gray-500 truncate max-w-[180px]">{o.subj}</td>
                    <td className="px-4 py-3"><span className="text-xs text-indigo-600 flex items-center gap-1"><LinkIcon size={10} />{o.content}</span></td>
                    <td className="px-4 py-3"><Badge label={o.st} color={o.stc} /></td>
                    <td className="px-4 py-3 text-gray-500">{o.date}</td>
                    <td className="px-4 py-3 font-semibold text-indigo-600">{o.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  PAGE: AI ASSISTANT (contextual)                                */
/* ═══════════════════════════════════════════════════════════════ */
function AssistantPage() {
  const suggestions = [
    { icon: TargetIcon, text: "Find more companies like FinServe Global", color: "text-indigo-600 bg-indigo-50" },
    { icon: FileIcon, text: "Draft a proposal for MedTech's support needs", color: "text-teal-600 bg-teal-50" },
    { icon: MailIcon, text: "Write a follow-up for the LogiCorp deal", color: "text-purple-600 bg-purple-50" },
    { icon: BookIcon, text: "Create a whitepaper on healthcare outsourcing", color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparkIcon size={16} className="text-indigo-600" />
          <h2 className="text-sm font-semibold text-gray-900">AI Assistant</h2>
        </div>
        <Badge label="Context-aware" color="bg-indigo-100 text-indigo-700" />
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Context-aware suggestions */}
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Suggested actions based on your pipeline</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((s, i) => (
              <button key={i} className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors text-left">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}><s.icon size={12} /></div>
                <span className="text-xs text-gray-700">{s.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex gap-2 max-w-[80%]">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0"><BotIcon size={13} className="text-indigo-600" /></div>
          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-3 text-xs text-gray-700">
            Hi! I have context on your pipeline and content library. I can help you draft proposals using your existing case studies, write targeted outreach, or find new opportunities. What would you like to do?
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm p-3 text-xs max-w-[75%]">
            Draft a proposal for MedTech Inc. They need customer support — use data from the Support Excellence whitepaper.
          </div>
        </div>
        <div className="flex gap-2 max-w-[80%]">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0"><BotIcon size={13} className="text-indigo-600" /></div>
          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-3 text-xs text-gray-700">
            <p className="mb-2">I'll draft that proposal using your "Customer Support Excellence" whitepaper as a foundation. Here's what I'm pulling in:</p>
            <div className="bg-indigo-50 rounded-lg p-2 mb-2 flex items-center gap-2">
              <LinkIcon size={10} className="text-indigo-500" />
              <span className="text-xs text-indigo-700">Referencing: Customer Support Excellence whitepaper</span>
            </div>
            <p>Creating a personalized proposal for MedTech Inc's Customer Support Lead position, incorporating your healthcare BPO expertise and support frameworks...</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 flex gap-2">
        <input className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-xs" placeholder="Ask about your pipeline, draft content, find opportunities..." />
        <Btn icon={<SendIcon size={14} />}>Send</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  PAGE: REPORTS                                                  */
/* ═══════════════════════════════════════════════════════════════ */
function ReportsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
        <Btn variant="secondary" icon={<DownloadIcon size={14} />}>Export</Btn>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <KpiCard icon={TargetIcon} label="Win Rate" value="8.2%" sub="from pipeline" color="bg-green-50 text-green-600" />
        <KpiCard icon={MailIcon} label="Open Rate" value="46%" sub="emails opened" color="bg-blue-50 text-blue-600" />
        <KpiCard icon={ChatIcon} label="Reply Rate" value="11.5%" sub="responses" color="bg-purple-50 text-purple-600" />
        <KpiCard icon={ClockIcon} label="Avg. Time to Reply" value="2.3d" sub="days" color="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs font-semibold text-gray-700 mb-3">Outreach Performance (14 days)</p>
          <div className="h-32 bg-gradient-to-t from-indigo-50 to-transparent rounded-lg flex items-end justify-around px-4 pb-2">
            {[35,55,40,70,60,45,75,50,80,65,55,70,60,85].map((h,i) => <div key={i} className="w-3 rounded-t" style={{height:`${h}%`, background: i%2===0 ? "#818cf8" : "#2dd4bf"}} />)}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-2 h-2 rounded bg-indigo-400"/>Sent</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-2 h-2 rounded bg-teal-400"/>Replies</span>
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold text-gray-700 mb-3">Top Performing Content</p>
          <div className="space-y-2">
            {[
              { name: "BPO Guide for Finance", replies: 8, sent: 23, rate: "35%" },
              { name: "Follow-up Template", replies: 5, sent: 45, rate: "11%" },
              { name: "Data Entry Services", replies: 3, sent: 18, rate: "17%" },
              { name: "Support Excellence", replies: 2, sent: 12, rate: "17%" },
            ].map(c => (
              <div key={c.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.sent} emails · {c.replies} replies</p>
                </div>
                <span className="text-xs font-bold text-green-600">{c.rate}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <p className="text-xs font-semibold text-gray-700 mb-3">Opportunities by Industry</p>
        <div className="grid grid-cols-4 gap-3">
          {[
            { industry: "Finance", detected: 45, won: 3, rate: "6.7%" },
            { industry: "Healthcare", detected: 28, won: 2, rate: "7.1%" },
            { industry: "Retail", detected: 19, won: 1, rate: "5.3%" },
            { industry: "Technology", detected: 35, won: 1, rate: "2.9%" },
          ].map(ind => (
            <div key={ind.industry} className="p-3 bg-gray-50 rounded-xl text-center">
              <p className="text-xs font-medium text-gray-700">{ind.industry}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{ind.detected}</p>
              <p className="text-xs text-gray-400">detected</p>
              <p className="text-xs font-semibold text-green-600 mt-1">{ind.won} won ({ind.rate})</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  PAGE: SETTINGS                                                 */
/* ═══════════════════════════════════════════════════════════════ */
function SettingsPage() {
  const [tab, setTab] = useState("pipeline");
  const [pipelineOn, setPipelineOn] = useState(true);
  const [threshold, setThreshold] = useState(80);
  const [socialModal, setSocialModal] = useState(null); // null or channel object

  const socialChannels = [
    { l: "LinkedIn", c: "bg-blue-600", ok: true, user: "noondalton-sales" },
    { l: "Medium", c: "bg-black", ok: false, user: "" },
    { l: "Facebook", c: "bg-blue-500", ok: true, user: "NoonDaltonBPO" },
    { l: "Twitter / X", c: "bg-gray-900", ok: false, user: "" },
    { l: "Instagram", c: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600", ok: false, user: "" },
    { l: "TikTok", c: "bg-black", ok: false, user: "" },
  ];

  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-bold text-gray-900">Settings</h1><p className="text-xs text-gray-500">Configure AI model, integrations, and the prospecting pipeline</p></div>
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
        <button onClick={() => setTab("general")} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${tab === "general" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}><BotIcon size={13} />General</button>
        <button onClick={() => setTab("pipeline")} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${tab === "pipeline" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}><RadarIcon size={13} />Pipeline{pipelineOn && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}</button>
        <button onClick={() => setTab("content")} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${tab === "content" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}><TagIcon size={13} />Content Tagging</button>
      </div>

      {tab === "general" && (<>
        <Section title="AI Model (Gemini)" IconComp={BotIcon}>
          <Field label="Model"><Select><option>Gemini 2.0 Flash (fast, low cost)</option></Select></Field>
          <div className="grid grid-cols-2 gap-3"><Field label="Temperature"><Input defaultValue="0.7" /></Field><Field label="Max Output Tokens"><Input defaultValue="8192" /></Field></div>
        </Section>
        <Section title="Integrations" IconComp={PlugIcon}>
          <Field label="CRM Provider"><Select><option>No CRM</option><option>HubSpot</option><option>Salesforce</option></Select></Field>
          <p className="text-xs text-gray-400 mt-1">When connected, won opportunities sync automatically as CRM contacts.</p>
        </Section>
        <Section title="Social Connections" IconComp={Share2Icon} desc="Connect your social accounts to publish content and track engagement">
          <div className="grid grid-cols-2 gap-2">
            {socialChannels.map(n => (
              <div key={n.l} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 group hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${n.c} flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{n.l[0]}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-800">{n.l}</span>
                    {n.ok && <p className="text-xs text-gray-400">@{n.user}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={n.ok ? "Connected" : "Not connected"} color={n.ok ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"} />
                  <button onClick={() => setSocialModal(n)} className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-colors">
                    <GearIcon size={12} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>
        <div className="flex justify-end"><Btn icon={<SaveIcon size={13} />}>Save Settings</Btn></div>

        {/* ── Social Channel Credentials Modal ── */}
        {socialModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSocialModal(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl ${socialModal.c} flex items-center justify-center`}>
                    <span className="text-white text-sm font-bold">{socialModal.l[0]}</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">{socialModal.l}</h2>
                    <p className="text-xs text-gray-400">{socialModal.ok ? "Edit connection settings" : "Connect your account"}</p>
                  </div>
                </div>
                <button onClick={() => setSocialModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><XIcon size={16} className="text-gray-400" /></button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {socialModal.ok && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-green-50 border border-green-100">
                    <CheckIcon size={14} className="text-green-600" />
                    <span className="text-xs text-green-700 font-medium">Currently connected as @{socialModal.user}</span>
                  </div>
                )}

                <Field label="Account / Username">
                  <Input defaultValue={socialModal.ok ? socialModal.user : ""} placeholder={`Your ${socialModal.l} username or handle`} />
                </Field>

                {(socialModal.l === "LinkedIn" || socialModal.l === "Facebook") && (
                  <>
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="flex items-start gap-2">
                        <ShieldIcon size={14} className="text-blue-500 mt-0.5 shrink-0" />
                        <div className="text-xs text-blue-700">
                          <p className="font-medium mb-0.5">OAuth recommended</p>
                          <p>{socialModal.l} supports secure OAuth login. Click the button below to authenticate directly.</p>
                        </div>
                      </div>
                    </div>
                    <Btn variant="primary" className="w-full justify-center" icon={<KeyIcon size={13} />}>
                      Connect with {socialModal.l} OAuth
                    </Btn>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex-1 h-px bg-gray-200" /><span>or enter credentials manually</span><div className="flex-1 h-px bg-gray-200" />
                    </div>
                  </>
                )}

                <Field label="API Key / Access Token" hint="Required for automated posting and analytics">
                  <Input type="password" defaultValue={socialModal.ok ? "••••••••••••••••" : ""} placeholder="Paste your API key or access token" />
                </Field>

                <Field label="API Secret / Token Secret" hint="Some platforms require a secret alongside the key">
                  <Input type="password" defaultValue={socialModal.ok ? "••••••••••••••••" : ""} placeholder="Paste your API secret" />
                </Field>

                {(socialModal.l === "Twitter / X" || socialModal.l === "Facebook" || socialModal.l === "Instagram") && (
                  <Field label="Page / Account ID" hint={`The ${socialModal.l} page or account ID for publishing`}>
                    <Input placeholder="e.g. 123456789" />
                  </Field>
                )}

                {socialModal.l === "TikTok" && (
                  <Field label="Open ID" hint="Your TikTok Open Platform application ID">
                    <Input placeholder="e.g. aw7xxx..." />
                  </Field>
                )}

                {/* Permissions info */}
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs font-medium text-gray-700 mb-1.5">Permissions needed</p>
                  <div className="space-y-1">
                    {[
                      { p: "Read profile information", always: true },
                      { p: "Publish posts and content", always: true },
                      { p: "Read engagement analytics", always: true },
                      { p: "Manage comments", always: false },
                    ].map(perm => (
                      <div key={perm.p} className="flex items-center gap-2 text-xs">
                        <CheckIcon size={10} className={perm.always ? "text-green-500" : "text-gray-300"} />
                        <span className={perm.always ? "text-gray-700" : "text-gray-400"}>{perm.p}</span>
                        {!perm.always && <span className="text-xs text-gray-300">(optional)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <div>
                  {socialModal.ok && (
                    <Btn variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" icon={<TrashIcon size={12} />}>Disconnect</Btn>
                  )}
                </div>
                <div className="flex gap-2">
                  <Btn variant="secondary" onClick={() => setSocialModal(null)}>Cancel</Btn>
                  <Btn variant="secondary" small icon={<PlayIcon size={11} />}>Test Connection</Btn>
                  <Btn icon={<SaveIcon size={12} />}>{socialModal.ok ? "Update" : "Connect"}</Btn>
                </div>
              </div>
            </div>
          </div>
        )}
      </>)}

      {tab === "pipeline" && (<>
        <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${pipelineOn ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
          <div className="flex items-center gap-2.5">
            <RadarIcon size={18} className={pipelineOn ? "text-green-600" : "text-gray-400"} />
            <div><p className="text-xs font-semibold text-gray-900">Prospecting Pipeline</p><p className="text-xs text-gray-500">{pipelineOn ? "Active — scanning every 24 hours" : "Inactive — enable to start"}</p></div>
          </div>
          <button onClick={() => setPipelineOn(!pipelineOn)} className="relative w-11 h-6 rounded-full transition-colors" style={{backgroundColor: pipelineOn ? "#16a34a" : "#d1d5db"}}>
            <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" style={{transform: pipelineOn ? "translateX(20px)" : "translateX(0)"}} />
          </button>
        </div>

        <Section title="Specializations & Keywords" IconComp={SearchIcon} desc="Define NoonDalton's services and target industries">
          <Field label="Service keywords" hint="Press Enter or comma to add"><TagInput tags={["BPO","outsourcing","data entry","back office","customer support","accounting"]} /></Field>
          <Field label="Target industries" hint="Leave empty for all industries"><TagInput tags={["finance","healthcare","retail"]} /></Field>
          <Field label="Excluded companies" hint="Competitors or orgs to skip"><TagInput tags={["Acme BPO","CompetitorCorp"]} /></Field>
        </Section>

        <Section title="Job Sources" IconComp={GlobeIcon} desc="Where job postings are fetched from" badge={<Btn small icon={<PlusIcon size={12} />}>Add Source</Btn>}>
          <div className="space-y-2">
            {[
              {name:"LinkedIn via JSearch", type:"API", url:"jsearch.p.rapidapi.com", c:"text-violet-600 bg-violet-50", ic:CodeIcon},
              {name:"Indeed RSS Feed", type:"RSS", url:"indeed.com/rss/q=outsourcing", c:"text-orange-600 bg-orange-50", ic:RssIcon},
              {name:"Remote.co Careers", type:"SCRAPER", url:"remote.co/remote-jobs", c:"text-cyan-600 bg-cyan-50", ic:GlobeIcon},
            ].map(s => (
              <div key={s.name} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 group hover:border-indigo-200">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.c}`}><s.ic size={14} /></div>
                  <div><p className="text-xs font-medium text-gray-800">{s.name}</p><p className="text-xs text-gray-400">{s.type} · {s.url}</p></div>
                </div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100"><button className="p-1.5 rounded hover:bg-gray-100"><PenIcon size={11} className="text-gray-400" /></button><button className="p-1.5 rounded hover:bg-red-50"><TrashIcon size={11} className="text-gray-400" /></button></div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="SMTP Configuration" IconComp={MailIcon} desc="Mail server for sending outreach emails">
          <div className="grid grid-cols-2 gap-3"><Field label="SMTP Server"><Input defaultValue="smtp.gmail.com" /></Field><Field label="Port"><Input defaultValue="587" /></Field></div>
          <div className="grid grid-cols-2 gap-3"><Field label="Username"><Input defaultValue="sales@noondalton.com" /></Field><Field label="Password"><Input type="password" defaultValue="secret" /></Field></div>
          <div className="grid grid-cols-2 gap-3"><Field label="Sender Email"><Input defaultValue="sales@noondalton.com" /></Field><Field label="Sender Name"><Input defaultValue="NoonDalton Sales" /></Field></div>
          <div className="flex justify-end"><Btn variant="secondary" small>Test Connection</Btn></div>
        </Section>

        <Section title="Automation" IconComp={SlidersIcon} desc="Control the pipeline's automation level">
          <Field label={`Auto-approval threshold: ${threshold}%`} hint="Emails at or above this score send automatically. Lower ones go to review.">
            <div className="flex items-center gap-3">
              <input type="range" min={50} max={100} step={5} value={threshold} onChange={e => setThreshold(Number(e.target.value))} className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              <span className="w-12 text-center text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg">{threshold}%</span>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3"><Field label="Max emails per day"><Input defaultValue="50" /></Field><Field label="Scan frequency"><Select><option>Every 24 hours</option><option>Every 6 hours</option><option>Every 12 hours</option></Select></Field></div>
        </Section>

        <div className="flex justify-end pb-2"><Btn icon={<SaveIcon size={13} />}>Save Pipeline</Btn></div>
      </>)}

      {tab === "content" && (<>
        <Section title="Auto-Tagging Rules" IconComp={TagIcon} desc="Define how content is tagged so agents can match it to opportunities">
          <p className="text-xs text-gray-500 mb-3">Content is automatically tagged by industry and service line. The email composer uses these tags to find the most relevant case studies, proposals, and templates for each opportunity.</p>
          <Field label="Industry tags"><TagInput tags={["finance","healthcare","retail","technology","logistics"]} placeholder="Add industry..." /></Field>
          <Field label="Service line tags"><TagInput tags={["data entry","customer support","accounting","back office","outsourcing","virtual assistant"]} placeholder="Add service..." /></Field>
        </Section>
        <Section title="Content Matching" IconComp={ZapIcon} desc="How the email composer selects content for personalization">
          <Field label="Matching strategy">
            <Select>
              <option>Best match (industry + service + recency)</option>
              <option>Industry match only</option>
              <option>Service match only</option>
              <option>Manual only (no auto-matching)</option>
            </Select>
          </Field>
          <Field label="Minimum relevance score" hint="Content below this score won't be included in emails">
            <Input defaultValue="0.6" />
          </Field>
          <div className="mt-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-xs text-blue-800 font-medium mb-1.5">How it works</p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>1. Scout detects a job posting and extracts industry + service keywords</p>
              <p>2. The system searches your Content Library for items with matching tags</p>
              <p>3. Composer weaves the best-matching content into the personalized email</p>
              <p>4. You see which content was used in the Review Queue and Outreach History</p>
            </div>
          </div>
        </Section>
        <div className="flex justify-end"><Btn icon={<SaveIcon size={13} />}>Save Content Settings</Btn></div>
      </>)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  MAIN APP — SIDEBAR + ROUTING                                   */
/* ═══════════════════════════════════════════════════════════════ */

const PAGES = {
  dashboard:  { label: "Dashboard",        icon: GridIcon,    component: DashboardPage },
  opportunities: { label: "Opportunities",  icon: TargetIcon,  component: OpportunitiesPage },
  content:    { label: "Content Library",   icon: FolderIcon,  component: ContentLibraryPage },
  outreach:   { label: "Outreach",          icon: SendIcon,    component: OutreachPage, badge: 3 },
  assistant:  { label: "AI Assistant",      icon: SparkIcon,   component: AssistantPage },
  reports:    { label: "Reports",           icon: ChartIcon,   component: ReportsPage },
  settings:   { label: "Settings",          icon: GearIcon,    component: SettingsPage },
};

const MAIN_NAV = ["dashboard", "opportunities", "content", "outreach", "assistant", "reports"];
const BOTTOM_NAV = ["settings"];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const PageComp = PAGES[page]?.component || DashboardPage;

  const navLink = (key) => {
    const p = PAGES[key];
    const active = page === key;
    return (
      <button key={key} onClick={() => setPage(key)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
          active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
        } ${collapsed ? "justify-center" : ""}`}
        title={collapsed ? p.label : undefined}>
        <p.icon size={16} className="shrink-0" />
        {!collapsed && (
          <span className="flex-1 text-left">{p.label}</span>
        )}
        {!collapsed && p.badge && (
          <span className="bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">{p.badge}</span>
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 rounded-xl overflow-hidden border border-gray-200" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-14" : "w-52"} bg-slate-800 flex flex-col h-full shrink-0 transition-all duration-200 rounded-l-xl`}>
        <div className={`flex items-center h-14 px-3 border-b border-slate-700 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && <div><p className="text-white font-bold text-sm leading-tight">NoonDalton</p><p className="text-teal-400 text-xs">AI Marketing Suite</p></div>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700">
            {collapsed ? <ArrowRightIcon size={14} /> : <XIcon size={14} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {MAIN_NAV.map(navLink)}
        </nav>

        <div className="mx-2 border-t border-slate-700" />
        <nav className="px-2 py-2 space-y-0.5">
          {BOTTOM_NAV.map(navLink)}
          <button className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-red-700/30 hover:text-red-300 ${collapsed ? "justify-center" : ""}`}>
            <LogOutIcon size={16} />{!collapsed && "Log Out"}
          </button>
        </nav>
        {!collapsed && (
          <div className="px-3 py-2.5 border-t border-slate-700">
            <p className="text-white text-xs font-medium">Admin User</p>
            <p className="text-slate-400 text-xs">admin@noondalton.com</p>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-5">
        <div className="max-w-5xl mx-auto">
          <PageComp />
        </div>
      </main>
    </div>
  );
}
