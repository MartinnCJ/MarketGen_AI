import React, { useState, useEffect } from 'react';

export default function NDMarketingWizard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const [page, setPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [expandedContent, setExpandedContent] = useState(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState('content');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalStep, setProposalStep] = useState(1);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showInfographicModal, setShowInfographicModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [contentLanguage, setContentLanguage] = useState('en');
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [selectedGenerateTypes, setSelectedGenerateTypes] = useState([]);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [selectedInfographicStyle, setSelectedInfographicStyle] = useState(null);
  const [selectedImageStyle, setSelectedImageStyle] = useState(null);
  const [generatingChapter, setGeneratingChapter] = useState(null);
  const [generatingAsset, setGeneratingAsset] = useState(null);
  const [publishing, setPublishing] = useState(false);
  
  // Proposals sorting
  const [proposalSortColumn, setProposalSortColumn] = useState('date');
  const [proposalSortDirection, setProposalSortDirection] = useState('desc');
  
  // Content Editor states
  const [editorContent, setEditorContent] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [showAIToolbar, setShowAIToolbar] = useState(false);
  const [aiToolbarPosition, setAIToolbarPosition] = useState({ top: 0, left: 0 });
  const [seoScore, setSeoScore] = useState(78);
  const [plagiarismScore, setPlagiarismScore] = useState(null);
  const [scanningPlagiarism, setScanningPlagiarism] = useState(false);
  const [aiDetectionScore, setAiDetectionScore] = useState(null);
  
  // Drag and drop
  const [draggedChapter, setDraggedChapter] = useState(null);
  const [dragOverChapter, setDragOverChapter] = useState(null);
  
  // Market Research Chat
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "👋 Hi! I'm your AI Marketing Strategist. I can help you analyze your content performance, plan your marketing strategy, and optimize your publishing schedule. Ask me anything about your marketing data!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Infographic Generator State
  const [infographicSource, setInfographicSource] = useState('chapter-summary');
  const [infographicCustomText, setInfographicCustomText] = useState('');
  const [infographicColorTheme, setInfographicColorTheme] = useState('brand');
  const [infographicGenerating, setInfographicGenerating] = useState(false);
  const [infographicProgress, setInfographicProgress] = useState(0);
  const [infographicProgressStep, setInfographicProgressStep] = useState('');
  
  // AI Image Studio State
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageAspectRatio, setImageAspectRatio] = useState('16:9');
  const [imageArtStyle, setImageArtStyle] = useState('photorealistic');
  const [showNegativePrompt, setShowNegativePrompt] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [imageHistory, setImageHistory] = useState([
    { id: 1, url: 'gradient-1', prompt: 'AI healthcare concept', style: 'Photorealistic' },
    { id: 2, url: 'gradient-2', prompt: 'Digital transformation', style: 'Flat Vector' },
    { id: 3, url: 'gradient-3', prompt: 'Content marketing', style: 'Cyberpunk' },
  ]);
  const [imageGenerating, setImageGenerating] = useState(false);
  
  // Translation State
  const [targetLanguages, setTargetLanguages] = useState(['es', 'fr']);
  const [adaptCulturalNuances, setAdaptCulturalNuances] = useState(true);
  const [translationProcessing, setTranslationProcessing] = useState(false);
  const [translationProgress, setTranslationProgress] = useState({});
  
  // Export State
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportIncludeCover, setExportIncludeCover] = useState(true);
  const [exportIncludeTOC, setExportIncludeTOC] = useState(true);
  const [exportPageSize, setExportPageSize] = useState('letter');
  const [exportRemoveWatermark, setExportRemoveWatermark] = useState(false);
  const [exportGenerating, setExportGenerating] = useState(false);
  
  // Asset Gallery State
  const [assetGalleryTab, setAssetGalleryTab] = useState('all');
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  
  // Content data with chapters (mutable for reordering)
  const [contentsData, setContentsData] = useState([
    { id: 1, title: 'AI in Healthcare: A Comprehensive Guide', status: 'Generated', chapters: [
      { id: 1, title: 'Introduction to AI in Healthcare', words: 2450, status: 'Generated' },
      { id: 2, title: 'Machine Learning for Diagnostics', words: 3120, status: 'Generated' },
      { id: 3, title: 'NLP in Medicine', words: 1800, status: 'Draft' },
    ]},
    { id: 2, title: 'Content Marketing Strategies 2025', status: 'Published', chapters: [
      { id: 1, title: 'The Evolving Content Landscape', words: 2100, status: 'Published' },
      { id: 2, title: 'AI-Powered Content Creation', words: 2890, status: 'Published' },
    ]},
    { id: 3, title: 'Digital Transformation Playbook', status: 'Draft', chapters: [
      { id: 1, title: 'Understanding Digital Transformation', words: 0, status: 'Outlined' },
      { id: 2, title: 'Building Your Digital Strategy', words: 500, status: 'Draft' },
    ]},
  ]);
  
  const [proposalData, setProposalData] = useState({
    template: '',
    customer: '',
    isNewCustomer: false,
    newCustomerName: '',
    newCustomerEmail: '',
    newCustomerCompany: '',
    items: [],
    businessProcess: ''
  });
  const [generating, setGenerating] = useState(false);

  const bg = darkMode ? '#0F172A' : '#F8FAFC';
  const cardBg = darkMode ? '#1E293B' : 'white';
  const border = darkMode ? '#334155' : '#E2E8F0';
  const textPrimary = darkMode ? '#F1F5F9' : '#0F172A';
  const textMuted = darkMode ? '#94A3B8' : '#64748B';

  // Proposal Templates
  const proposalTemplates = [
    { id: 'enterprise', name: 'Enterprise Template', description: 'For large organizations with complex needs', icon: '🏢' },
    { id: 'standard', name: 'Standard Template', description: 'Balanced template for mid-size clients', icon: '📋' },
    { id: 'startup', name: 'Startup Template', description: 'Streamlined for growing businesses', icon: '🚀' },
    { id: 'custom', name: 'Custom Template', description: 'Start from scratch with full flexibility', icon: '✨' },
  ];

  // Existing Customers
  const existingCustomers = [
    { id: 1, name: 'TechCorp Inc.', email: 'contact@techcorp.com', company: 'TechCorp Inc.' },
    { id: 2, name: 'GlobalRetail', email: 'info@globalretail.com', company: 'GlobalRetail' },
    { id: 3, name: 'StartupXYZ', email: 'hello@startupxyz.io', company: 'StartupXYZ' },
    { id: 4, name: 'FinServ Corp', email: 'sales@finserv.com', company: 'FinServ Corp' },
    { id: 5, name: 'MediaGroup', email: 'contact@mediagroup.com', company: 'MediaGroup' },
  ];

  // Available Services/Items
  const availableItems = [
    { id: 1, name: 'Content Strategy Development', category: 'Strategy', basePrice: 5000 },
    { id: 2, name: 'AI Content Generation (per month)', category: 'Content', basePrice: 2500 },
    { id: 3, name: 'Social Media Management', category: 'Social', basePrice: 3000 },
    { id: 4, name: 'SEO Optimization Package', category: 'SEO', basePrice: 4000 },
    { id: 5, name: 'Email Marketing Campaign', category: 'Marketing', basePrice: 2000 },
    { id: 6, name: 'Brand Identity Design', category: 'Design', basePrice: 8000 },
    { id: 7, name: 'Video Production (per video)', category: 'Content', basePrice: 3500 },
    { id: 8, name: 'Marketing Analytics Setup', category: 'Analytics', basePrice: 4500 },
    { id: 9, name: 'PPC Campaign Management', category: 'Advertising', basePrice: 3000 },
    { id: 10, name: 'Influencer Outreach Program', category: 'Social', basePrice: 5500 },
  ];

  // Social Networks for Publishing
  const socialNetworks = [
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2', description: 'Professional network' },
    { id: 'medium', name: 'Medium', icon: '📝', color: '#000000', description: 'Long-form articles' },
    { id: 'twitter', name: 'X / Twitter', icon: '𝕏', color: '#000000', description: 'Short updates' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: '#1877F2', description: 'Social sharing' },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F', description: 'Visual content' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000', description: 'Short videos' },
  ];

  // Writing Styles
  const writingStyles = [
    { id: 'professional', name: 'Professional', icon: '👔' },
    { id: 'conversational', name: 'Conversational', icon: '💬' },
    { id: 'academic', name: 'Academic', icon: '🎓' },
    { id: 'creative', name: 'Creative', icon: '🎨' },
    { id: 'technical', name: 'Technical', icon: '⚙️' },
    { id: 'persuasive', name: 'Persuasive', icon: '🎯' },
  ];

  // Document Templates
  const documentTemplates = [
    { id: 'blog', name: 'Blog Post', icon: '📰' },
    { id: 'whitepaper', name: 'Whitepaper', icon: '📄' },
    { id: 'casestudy', name: 'Case Study', icon: '📊' },
    { id: 'pressrelease', name: 'Press Release', icon: '📢' },
    { id: 'newsletter', name: 'Newsletter', icon: '✉️' },
    { id: 'social', name: 'Social Post', icon: '📱' },
  ];

  // Generate Content Types
  const generateTypes = [
    { 
      id: 'full', 
      name: 'Full Text', 
      icon: '📄', 
      description: 'Complete comprehensive content with all details and sections',
      wordCount: '2,000 - 4,000 words',
      color: '#0891B2'
    },
    { 
      id: 'long', 
      name: 'Long Article', 
      icon: '📝', 
      description: 'Detailed article suitable for blogs and publications',
      wordCount: '800 - 1,500 words',
      color: '#8B5CF6'
    },
    { 
      id: 'short', 
      name: 'Short Summary', 
      icon: '🐦', 
      description: 'Concise version optimized for Twitter/X and social sharing',
      wordCount: '100 - 280 characters',
      color: '#000000'
    },
  ];

  // Languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  ];

  // Infographic Styles
  const infographicStyles = [
    { id: 'timeline', name: 'Minimalist Timeline', icon: '📅', description: 'Clean chronological layout' },
    { id: 'statistical', name: 'Statistical Pie', icon: '📊', description: 'Data-driven pie charts' },
    { id: 'process', name: 'Process Flow', icon: '🔄', description: 'Step-by-step workflow' },
    { id: 'comparison', name: 'Comparison Grid', icon: '⚖️', description: 'Side-by-side analysis' },
    { id: 'modern-dark', name: 'Modern Dark', icon: '🌙', description: 'Sleek dark theme' },
    { id: 'corporate', name: 'Corporate Clean', icon: '🏢', description: 'Professional business style' },
  ];
  
  const infographicSources = [
    { id: 'chapter-summary', label: 'Chapter Summary', icon: '📄' },
    { id: 'key-takeaways', label: 'Key Takeaways List', icon: '✨' },
    { id: 'statistics', label: 'Statistics & Data', icon: '📊' },
    { id: 'process-steps', label: 'Process Steps', icon: '🔢' },
    { id: 'custom', label: 'Custom Text', icon: '✏️' },
  ];
  
  const colorThemes = [
    { id: 'brand', name: 'Brand Colors', colors: ['#0891B2', '#5EEAD4', '#0F4C5C'] },
    { id: 'ocean', name: 'Ocean Blue', colors: ['#0EA5E9', '#38BDF8', '#7DD3FC'] },
    { id: 'forest', name: 'Forest Green', colors: ['#10B981', '#34D399', '#6EE7B7'] },
    { id: 'sunset', name: 'Sunset Warm', colors: ['#F59E0B', '#FBBF24', '#FCD34D'] },
    { id: 'berry', name: 'Berry Purple', colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'] },
    { id: 'mono', name: 'Monochrome', colors: ['#1E293B', '#64748B', '#CBD5E1'] },
  ];

  // AI Image Styles
  const imageStyles = [
    { id: 'photorealistic', name: 'Photorealistic', icon: '📷', description: 'Lifelike imagery' },
    { id: 'illustration', name: 'Illustration', icon: '🎨', description: 'Hand-drawn artistic style' },
    { id: 'abstract', name: 'Abstract', icon: '🔮', description: 'Conceptual and artistic' },
    { id: '3d', name: '3D Render', icon: '🧊', description: 'Three-dimensional graphics' },
    { id: 'minimalist', name: 'Minimalist', icon: '⚪', description: 'Simple and clean' },
    { id: 'vintage', name: 'Vintage', icon: '📜', description: 'Retro and classic feel' },
  ];
  
  const aspectRatios = [
    { id: '16:9', label: '16:9', desc: 'Blog/Web', icon: '🖥️' },
    { id: '1:1', label: '1:1', desc: 'Social', icon: '📱' },
    { id: '9:16', label: '9:16', desc: 'Stories', icon: '📲' },
    { id: 'a4', label: 'A4', desc: 'Cover', icon: '📄' },
  ];
  
  const artStyles = [
    { id: 'photorealistic', name: 'Photorealistic', icon: '📷', preview: 'linear-gradient(135deg, #374151, #1F2937)' },
    { id: 'flat-vector', name: 'Flat Vector', icon: '🎨', preview: 'linear-gradient(135deg, #0891B2, #5EEAD4)' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌆', preview: 'linear-gradient(135deg, #7C3AED, #EC4899)' },
    { id: 'watercolor', name: 'Watercolor', icon: '🖌️', preview: 'linear-gradient(135deg, #F472B6, #FBBF24)' },
    { id: '3d-render', name: '3D Render', icon: '🎮', preview: 'linear-gradient(135deg, #10B981, #3B82F6)' },
    { id: 'anime', name: 'Anime Style', icon: '✨', preview: 'linear-gradient(135deg, #EC4899, #8B5CF6)' },
  ];
  
  const translationLanguages = [
    { code: 'es', name: 'Spanish', flag: '🇪🇸', tokens: 1200 },
    { code: 'fr', name: 'French', flag: '🇫🇷', tokens: 1150 },
    { code: 'de', name: 'German', flag: '🇩🇪', tokens: 1300 },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', tokens: 1800 },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', tokens: 1600 },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷', tokens: 1100 },
    { code: 'it', name: 'Italian', flag: '🇮🇹', tokens: 1150 },
    { code: 'ko', name: 'Korean', flag: '🇰🇷', tokens: 1700 },
  ];

  const toggleNetworkSelection = (networkId) => {
    setSelectedNetworks(prev => 
      prev.includes(networkId) 
        ? prev.filter(id => id !== networkId)
        : [...prev, networkId]
    );
  };

  const selectAllNetworks = () => {
    setSelectedNetworks(socialNetworks.map(n => n.id));
  };

  const deselectAllNetworks = () => {
    setSelectedNetworks([]);
  };

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setShowPublishModal(false);
      setSelectedNetworks([]);
      setSelectedChapter(null);
      alert(`Published to ${selectedNetworks.length} network(s) successfully!`);
    }, 2000);
  };

  const openGenerateModal = (content, chapter) => {
    setSelectedChapter({ content, chapter });
    setSelectedGenerateTypes([]);
    setShowGenerateModal(true);
  };

  const toggleGenerateType = (typeId) => {
    setSelectedGenerateTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleGenerate = () => {
    if (selectedGenerateTypes.length === 0 || !selectedChapter) return;
    
    setShowGenerateModal(false);
    setGeneratingChapter(`${selectedChapter.content.id}-${selectedChapter.chapter.id}`);
    
    const typeNames = selectedGenerateTypes.map(id => generateTypes.find(t => t.id === id)?.name).join(', ');
    const langName = languages.find(l => l.code === contentLanguage)?.name || 'English';
    
    setTimeout(() => {
      setGeneratingChapter(null);
      setGeneratedContent({
        chapter: selectedChapter.chapter,
        types: selectedGenerateTypes,
        language: contentLanguage
      });
      setShowExportModal(true);
    }, 2500);
  };

  const handleExportToWord = () => {
    alert(`Exporting to Word document in ${languages.find(l => l.code === contentLanguage)?.name}...`);
    setShowExportModal(false);
    setGeneratedContent(null);
    setSelectedChapter(null);
    setSelectedGenerateTypes([]);
  };

  const openInfographicModal = (content, chapter) => {
    setSelectedChapter({ content, chapter });
    setSelectedInfographicStyle(null);
    setShowInfographicModal(true);
  };

  const handleGenerateInfographic = () => {
    if (!selectedInfographicStyle || !selectedChapter) return;
    
    const styleName = infographicStyles.find(s => s.id === selectedInfographicStyle)?.name;
    setShowInfographicModal(false);
    setGeneratingAsset(`infographic-${selectedChapter.content.id}-${selectedChapter.chapter.id}`);
    
    setTimeout(() => {
      setGeneratingAsset(null);
      alert(`${styleName} infographic generated and inserted into "${selectedChapter.chapter.title}"!`);
      setSelectedChapter(null);
      setSelectedInfographicStyle(null);
    }, 2500);
  };

  const openImageModal = (content, chapter) => {
    setSelectedChapter({ content, chapter });
    setSelectedImageStyle(null);
    setShowImageModal(true);
  };

  const handleGenerateImage = () => {
    if (!selectedImageStyle || !selectedChapter) return;
    
    const styleName = imageStyles.find(s => s.id === selectedImageStyle)?.name;
    setShowImageModal(false);
    setGeneratingAsset(`image-${selectedChapter.content.id}-${selectedChapter.chapter.id}`);
    
    setTimeout(() => {
      setGeneratingAsset(null);
      alert(`${styleName} AI image generated and inserted into "${selectedChapter.chapter.title}"!`);
      setSelectedChapter(null);
      setSelectedImageStyle(null);
    }, 2500);
  };

  // Proposals Data with version history and signature status
  const proposalsData = [
    { id: 1, name: 'Q1 Marketing Strategy', customer: 'TechCorp Inc.', amount: 45000, status: 'Sent', date: '2025-01-15', crm: 'Synced', signature: 'pending', versions: [
      { version: 3, date: '2025-01-15', amount: 45000, changes: 'Removed SEO package per client request' },
      { version: 2, date: '2025-01-12', amount: 52000, changes: 'Added content strategy services' },
      { version: 1, date: '2025-01-10', amount: 35000, changes: 'Initial proposal created' },
    ]},
    { id: 2, name: 'Digital Transformation', customer: 'GlobalRetail', amount: 28500, status: 'Draft', date: '2025-01-18', crm: 'Not Synced', signature: 'none', versions: [
      { version: 1, date: '2025-01-18', amount: 28500, changes: 'Initial proposal created' },
    ]},
    { id: 3, name: 'Content Marketing Suite', customer: 'StartupXYZ', amount: 12000, status: 'Uploaded', date: '2025-01-10', crm: 'Synced', signature: 'signed', versions: [
      { version: 2, date: '2025-01-10', amount: 12000, changes: 'Applied startup discount' },
      { version: 1, date: '2025-01-08', amount: 15000, changes: 'Initial proposal created' },
    ]},
    { id: 4, name: 'Annual Retainer', customer: 'FinServ Corp', amount: 120000, status: 'Pending', date: '2025-01-05', crm: 'Pending', signature: 'sent', versions: [
      { version: 1, date: '2025-01-05', amount: 120000, changes: 'Initial proposal created' },
    ]},
    { id: 5, name: 'Brand Refresh Campaign', customer: 'MediaGroup', amount: 35000, status: 'Sent', date: '2025-01-12', crm: 'Synced', signature: 'viewed', versions: [
      { version: 1, date: '2025-01-12', amount: 35000, changes: 'Initial proposal created' },
    ]},
  ];

  // Service Bundles (Pre-set packages)
  const serviceBundles = [
    { 
      id: 'startup', 
      name: 'Startup Growth Package', 
      icon: '🚀', 
      description: 'Essential marketing services for growing startups',
      discount: 15,
      items: [1, 2, 3, 5] // IDs from availableItems
    },
    { 
      id: 'enterprise', 
      name: 'Enterprise Suite', 
      icon: '🏢', 
      description: 'Comprehensive solution for large organizations',
      discount: 10,
      items: [1, 2, 3, 4, 6, 8]
    },
    { 
      id: 'content', 
      name: 'Content Creator Bundle', 
      icon: '✍️', 
      description: 'Full-stack content production services',
      discount: 12,
      items: [2, 6, 7]
    },
    { 
      id: 'social', 
      name: 'Social Media Domination', 
      icon: '📱', 
      description: 'Complete social media presence package',
      discount: 10,
      items: [3, 5, 10]
    },
  ];

  // CRM Activity Log
  const [crmActivityLog] = useState([
    { id: 1, action: 'Proposal Synced', proposal: 'Q1 Marketing Strategy', crm: 'Salesforce', timestamp: '2025-01-15 14:32:05', status: 'success' },
    { id: 2, action: 'Contact Updated', proposal: 'TechCorp Inc.', crm: 'Salesforce', timestamp: '2025-01-15 14:32:06', status: 'success' },
    { id: 3, action: 'Proposal Synced', proposal: 'Content Marketing Suite', crm: 'Salesforce', timestamp: '2025-01-10 09:15:22', status: 'success' },
    { id: 4, action: 'Sync Failed', proposal: 'Digital Transformation', crm: 'Salesforce', timestamp: '2025-01-18 11:45:00', status: 'error', error: 'Authentication expired' },
    { id: 5, action: 'Proposal Synced', proposal: 'Brand Refresh Campaign', crm: 'Salesforce', timestamp: '2025-01-12 16:20:33', status: 'success' },
    { id: 6, action: 'Deal Stage Updated', proposal: 'Annual Retainer', crm: 'Salesforce', timestamp: '2025-01-05 10:00:00', status: 'success' },
  ]);

  // Version history modal state
  const [showVersionHistory, setShowVersionHistory] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showAssetGallery, setShowAssetGallery] = useState(false);
  const [showShareModal, setShowShareModal] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [selectedBrandVoice, setSelectedBrandVoice] = useState('professional');

  // Team members for assignments
  const teamMembers = [
    { id: 1, name: 'Alex Chen', avatar: '👨‍💻', role: 'Content Lead' },
    { id: 2, name: 'Sarah Miller', avatar: '👩‍🎨', role: 'Designer' },
    { id: 3, name: 'James Wilson', avatar: '👨‍💼', role: 'Account Manager' },
    { id: 4, name: 'Emma Davis', avatar: '👩‍💻', role: 'SEO Specialist' },
  ];

  // Asset Gallery
  const [assetGallery] = useState([
    { id: 1, type: 'image', name: 'AI Healthcare Header', project: 'AI in Healthcare', date: '2025-01-15', thumbnail: '🖼️' },
    { id: 2, type: 'infographic', name: 'ML Diagnostics Flow', project: 'AI in Healthcare', date: '2025-01-14', thumbnail: '📊' },
    { id: 3, type: 'image', name: 'Content Strategy Banner', project: 'Content Marketing 2025', date: '2025-01-12', thumbnail: '🖼️' },
    { id: 4, type: 'infographic', name: 'Social Media Stats', project: 'Content Marketing 2025', date: '2025-01-10', thumbnail: '📊' },
    { id: 5, type: 'image', name: 'Digital Transform Hero', project: 'Digital Transformation', date: '2025-01-08', thumbnail: '🖼️' },
    { id: 6, type: 'infographic', name: 'ROI Comparison Chart', project: 'Q1 Marketing Strategy', date: '2025-01-05', thumbnail: '📊' },
  ]);
  
  // Proposal Templates for Asset Gallery
  const galleryProposalTemplates = [
    { id: 1, name: 'Marketing Retainer', description: 'Monthly marketing services agreement', category: 'Marketing', uses: 45, thumbnail: '📋', color: '#0891B2' },
    { id: 2, name: 'Content Package', description: 'Blog posts, articles, and social content', category: 'Content', uses: 38, thumbnail: '✍️', color: '#10B981' },
    { id: 3, name: 'SEO Audit Proposal', description: 'Technical SEO analysis and recommendations', category: 'SEO', uses: 32, thumbnail: '🔍', color: '#8B5CF6' },
    { id: 4, name: 'Social Media Management', description: 'Full social media handling package', category: 'Social', uses: 28, thumbnail: '📱', color: '#EC4899' },
    { id: 5, name: 'Brand Strategy', description: 'Complete branding and identity proposal', category: 'Branding', uses: 22, thumbnail: '🎨', color: '#F59E0B' },
    { id: 6, name: 'PPC Campaign', description: 'Paid advertising management proposal', category: 'Advertising', uses: 19, thumbnail: '📈', color: '#EF4444' },
  ];
  
  // Document Templates for Asset Gallery
  const galleryDocumentTemplates = [
    { id: 1, name: 'Blog Post Template', description: 'SEO-optimized blog article structure', category: 'Content', uses: 89, thumbnail: '📝', color: '#0891B2' },
    { id: 2, name: 'Case Study', description: 'Client success story format', category: 'Marketing', uses: 56, thumbnail: '📊', color: '#10B981' },
    { id: 3, name: 'Email Newsletter', description: 'Weekly/monthly newsletter layout', category: 'Email', uses: 72, thumbnail: '📧', color: '#8B5CF6' },
    { id: 4, name: 'Social Media Calendar', description: 'Monthly content planning template', category: 'Social', uses: 64, thumbnail: '📅', color: '#EC4899' },
    { id: 5, name: 'White Paper', description: 'In-depth research document format', category: 'Content', uses: 34, thumbnail: '📄', color: '#F59E0B' },
    { id: 6, name: 'Press Release', description: 'News announcement template', category: 'PR', uses: 28, thumbnail: '📰', color: '#EF4444' },
    { id: 7, name: 'Landing Page Copy', description: 'Conversion-focused page structure', category: 'Web', uses: 47, thumbnail: '🌐', color: '#06B6D4' },
    { id: 8, name: 'Product Description', description: 'E-commerce product copy template', category: 'E-commerce', uses: 41, thumbnail: '🏷️', color: '#84CC16' },
  ];

  // Revenue data with proposal details for drill-down
  const revenueData = [
    { month: 'Aug', value: 32000, proposals: [
      { name: 'Summer Campaign', customer: 'BeachCo', amount: 18000 },
      { name: 'Brand Refresh', customer: 'StyleHub', amount: 14000 },
    ]},
    { month: 'Sep', value: 45000, proposals: [
      { name: 'Fall Marketing', customer: 'RetailMax', amount: 25000 },
      { name: 'SEO Package', customer: 'TechStart', amount: 12000 },
      { name: 'Social Media', customer: 'FoodieApp', amount: 8000 },
    ]},
    { month: 'Oct', value: 38000, proposals: [
      { name: 'Q4 Strategy', customer: 'FinanceFirst', amount: 38000 },
    ]},
    { month: 'Nov', value: 52000, proposals: [
      { name: 'Holiday Campaign', customer: 'GiftShop', amount: 28000 },
      { name: 'Year-End Review', customer: 'CorpGiant', amount: 24000 },
    ]},
    { month: 'Dec', value: 48000, proposals: [
      { name: 'New Year Prep', customer: 'EventsPro', amount: 22000 },
      { name: 'Annual Retainer', customer: 'LoyalClient', amount: 26000 },
    ]},
    { month: 'Jan', value: 61000, proposals: [
      { name: 'Q1 Marketing Strategy', customer: 'TechCorp Inc.', amount: 45000 },
      { name: 'Content Suite', customer: 'StartupXYZ', amount: 16000 },
    ]},
  ];

  // CLV Data
  const customerCLV = [
    { customer: 'TechCorp Inc.', totalRevenue: 185000, proposals: 8, avgDeal: 23125, firstDeal: '2023-03', lastDeal: '2025-01', status: 'active' },
    { customer: 'FinServ Corp', totalRevenue: 156000, proposals: 5, avgDeal: 31200, firstDeal: '2023-06', lastDeal: '2025-01', status: 'active' },
    { customer: 'GlobalRetail', totalRevenue: 142000, proposals: 12, avgDeal: 11833, firstDeal: '2022-11', lastDeal: '2025-01', status: 'active' },
    { customer: 'MediaGroup', totalRevenue: 98000, proposals: 6, avgDeal: 16333, firstDeal: '2024-02', lastDeal: '2025-01', status: 'active' },
    { customer: 'StartupXYZ', totalRevenue: 45000, proposals: 4, avgDeal: 11250, firstDeal: '2024-08', lastDeal: '2025-01', status: 'new' },
  ];

  // Predictive content topics
  const predictedTopics = [
    { topic: 'AI-Powered Customer Service', score: 94, trend: 'up', engagement: '+45%' },
    { topic: 'Sustainable Marketing Practices', score: 89, trend: 'up', engagement: '+38%' },
    { topic: 'Voice Search Optimization', score: 85, trend: 'up', engagement: '+32%' },
    { topic: 'Privacy-First Marketing', score: 82, trend: 'stable', engagement: '+28%' },
    { topic: 'Short-Form Video Strategy', score: 78, trend: 'up', engagement: '+52%' },
  ];

  // Brand Voice Profiles
  const brandVoices = [
    { id: 'professional', name: 'Professional', icon: '👔', description: 'Formal, authoritative, data-driven', tone: 'Formal and business-oriented' },
    { id: 'friendly', name: 'Friendly Startup', icon: '🚀', description: 'Casual, approachable, innovative', tone: 'Conversational and energetic' },
    { id: 'enterprise', name: 'Formal Enterprise', icon: '🏢', description: 'Corporate, precise, compliance-aware', tone: 'Structured and executive-level' },
    { id: 'creative', name: 'Creative Agency', icon: '🎨', description: 'Bold, trendy, storytelling-focused', tone: 'Imaginative and inspiring' },
  ];

  // Sort proposals
  const sortedProposals = [...proposalsData].sort((a, b) => {
    let aVal = a[proposalSortColumn];
    let bVal = b[proposalSortColumn];
    
    if (proposalSortColumn === 'amount') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    } else if (proposalSortColumn === 'date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (aVal < bVal) return proposalSortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return proposalSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleProposalSort = (column) => {
    if (proposalSortColumn === column) {
      setProposalSortDirection(proposalSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setProposalSortColumn(column);
      setProposalSortDirection('asc');
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e, contentId, chapterIndex) => {
    setDraggedChapter({ contentId, chapterIndex });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, contentId, chapterIndex) => {
    e.preventDefault();
    setDragOverChapter({ contentId, chapterIndex });
  };

  const handleDragEnd = () => {
    setDraggedChapter(null);
    setDragOverChapter(null);
  };

  const handleDrop = (e, contentId, targetIndex) => {
    e.preventDefault();
    if (!draggedChapter || draggedChapter.contentId !== contentId) return;
    
    const sourceIndex = draggedChapter.chapterIndex;
    if (sourceIndex === targetIndex) return;
    
    setContentsData(prev => prev.map(content => {
      if (content.id === contentId) {
        const newChapters = [...content.chapters];
        const [removed] = newChapters.splice(sourceIndex, 1);
        newChapters.splice(targetIndex, 0, removed);
        // Update chapter IDs to reflect new order
        return { ...content, chapters: newChapters.map((ch, idx) => ({ ...ch, id: idx + 1 })) };
      }
      return content;
    }));
    
    setDraggedChapter(null);
    setDragOverChapter(null);
  };

  // Editor functions
  const openEditor = (content, chapter) => {
    setSelectedChapter({ content, chapter });
    setEditorContent(`<h2>${chapter.title}</h2>
<p>This is the beginning of your chapter content. The AI has generated this initial draft based on your outline and preferences.</p>
<p>Healthcare organizations worldwide are increasingly turning to <strong>artificial intelligence</strong> to improve patient outcomes, streamline operations, and reduce costs. This transformation represents one of the most significant shifts in medical practice since the introduction of electronic health records.</p>
<h3>Key Benefits</h3>
<p>The implementation of AI in healthcare settings offers numerous advantages:</p>
<ul>
<li>Improved diagnostic accuracy through machine learning algorithms</li>
<li>Reduced administrative burden on healthcare professionals</li>
<li>Enhanced patient engagement through personalized care plans</li>
<li>Predictive analytics for early disease detection</li>
</ul>
<p>As we explore these technologies further in subsequent sections, we'll examine real-world case studies and implementation strategies that have proven successful across various healthcare settings.</p>`);
    setSeoScore(Math.floor(Math.random() * 30) + 65);
    setPlagiarismScore(null);
    setAiDetectionScore(null);
    setShowEditor(true);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text.length > 0) {
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setAIToolbarPosition({ top: rect.top - 50, left: rect.left + (rect.width / 2) - 100 });
      setShowAIToolbar(true);
    } else {
      setShowAIToolbar(false);
      setSelectedText('');
    }
  };

  const handleAIAction = (action) => {
    alert(`AI Action: "${action}" applied to selected text: "${selectedText.substring(0, 50)}..."`);
    setShowAIToolbar(false);
    setSelectedText('');
  };

  const runPlagiarismScan = () => {
    setScanningPlagiarism(true);
    setPlagiarismScore(null);
    setAiDetectionScore(null);
    
    setTimeout(() => {
      setPlagiarismScore(Math.floor(Math.random() * 5) + 95);
      setAiDetectionScore(Math.floor(Math.random() * 30) + 15);
      setScanningPlagiarism(false);
    }, 2500);
  };

  const handleTranslate = (targetLang) => {
    setShowTranslateModal(false);
    alert(`Translating chapter to ${languages.find(l => l.code === targetLang)?.name}...`);
  };

  // Apply service bundle
  const applyBundle = (bundle) => {
    const bundleItems = bundle.items.map(itemId => {
      const item = availableItems.find(i => i.id === itemId);
      if (item && !proposalData.items.find(i => i.id === item.id)) {
        return { ...item, quantity: 1, unitPrice: item.basePrice, discount: bundle.discount };
      }
      return null;
    }).filter(Boolean);
    
    setProposalData({
      ...proposalData,
      items: [...proposalData.items, ...bundleItems]
    });
  };

  // Get signature status badge
  const getSignatureBadge = (status) => {
    const configs = {
      'none': { bg: '#6B728020', color: '#6B7280', label: 'Not Sent', icon: '—' },
      'sent': { bg: '#3B82F620', color: '#3B82F6', label: 'Sent', icon: '📤' },
      'viewed': { bg: '#F59E0B20', color: '#F59E0B', label: 'Viewed', icon: '👁️' },
      'pending': { bg: '#8B5CF620', color: '#8B5CF6', label: 'Pending', icon: '⏳' },
      'signed': { bg: '#10B98120', color: '#10B981', label: 'Signed', icon: '✓' },
    };
    return configs[status] || configs['none'];
  };

  // Send for signature
  const handleSendForSignature = (proposalId) => {
    setShowSignatureModal(null);
    alert(`Proposal sent for e-signature via DocuSign!`);
  };

  // Voice recording simulation
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setVoiceTranscript('');
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Simulate transcription
    setTimeout(() => {
      setVoiceTranscript("Based on my voice memo, I want to create a comprehensive guide about leveraging AI for small business marketing. The content should cover practical applications, cost-effective tools, and step-by-step implementation strategies. Target audience is small business owners with limited technical knowledge but eager to adopt modern marketing techniques.");
    }, 1500);
  };

  // Generate share link
  const generateShareLink = (content) => {
    const linkId = Math.random().toString(36).substring(7);
    return `https://nd-wizard.app/review/${linkId}`;
  };

  // Recording timer effect would go here in real implementation

  // Marketing Insights Data
  const marketingInsights = {
    bestPublishingTimes: {
      'LinkedIn': { day: 'Tuesday', time: '10:00 AM', engagement: '+47%' },
      'Twitter': { day: 'Wednesday', time: '9:00 AM', engagement: '+38%' },
      'Facebook': { day: 'Thursday', time: '1:00 PM', engagement: '+32%' },
      'Instagram': { day: 'Monday', time: '11:00 AM', engagement: '+52%' },
      'TikTok': { day: 'Friday', time: '7:00 PM', engagement: '+61%' },
    },
    topPerformingContent: [
      { title: 'AI in Healthcare: Introduction', views: 12500, engagement: '8.2%', trend: 'up' },
      { title: 'Content Marketing Strategies', views: 9800, engagement: '7.1%', trend: 'up' },
      { title: 'Digital Transformation Guide', views: 7200, engagement: '5.8%', trend: 'stable' },
    ],
    underperformingContent: [
      { title: 'NLP in Medicine', views: 890, engagement: '1.2%', issue: 'Low reach' },
      { title: 'Building Digital Strategy', views: 450, engagement: '0.8%', issue: 'Incomplete content' },
    ],
    trendingTopics: [
      { topic: 'AI Automation in Marketing', score: 94, growth: '+127%' },
      { topic: 'Voice Search SEO', score: 87, growth: '+89%' },
      { topic: 'Sustainable Business Practices', score: 82, growth: '+76%' },
      { topic: 'Remote Work Productivity', score: 78, growth: '+54%' },
    ],
    productRecommendations: [
      { product: 'Content Marketing Suite', reason: 'High demand this season', potential: '$45K' },
      { product: 'AI Automation Package', reason: 'Trending topic alignment', potential: '$62K' },
      { product: 'SEO Optimization Bundle', reason: 'Client requests up 40%', potential: '$28K' },
    ],
    weeklyStrategy: {
      monday: 'Launch new content series on AI trends',
      tuesday: 'LinkedIn thought leadership post',
      wednesday: 'Customer success story feature',
      thursday: 'Behind-the-scenes content',
      friday: 'Weekly roundup & engagement push',
    }
  };

  // Suggested Questions for Market Research
  const suggestedQuestions = [
    { icon: '⏰', text: 'What is the best time to publish on LinkedIn?' },
    { icon: '📝', text: 'What content should I talk about this week?' },
    { icon: '📈', text: 'Which of my content is performing well?' },
    { icon: '📉', text: 'What content needs improvement?' },
    { icon: '🎯', text: 'Which product should I market this week?' },
    { icon: '📅', text: 'What\'s the best publishing strategy for this week?' },
    { icon: '🔥', text: 'What topics are trending right now?' },
    { icon: '💡', text: 'Give me a complete weekly marketing plan' },
  ];

  // Chat message handler
  const handleSendMessage = (message) => {
    const userMessage = message || chatInput;
    if (!userMessage.trim()) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      let response = '';
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('best time') || lowerMessage.includes('when to publish') || lowerMessage.includes('publish on')) {
        const network = Object.keys(marketingInsights.bestPublishingTimes).find(n => 
          lowerMessage.includes(n.toLowerCase())
        );
        if (network) {
          const data = marketingInsights.bestPublishingTimes[network];
          response = `📊 **Best Time to Publish on ${network}**\n\nBased on your audience engagement data:\n\n• **Best Day:** ${data.day}\n• **Optimal Time:** ${data.time}\n• **Expected Engagement Boost:** ${data.engagement}\n\n💡 **Pro Tip:** Schedule your posts 15 minutes before peak time to catch early engagement.`;
        } else {
          response = `📊 **Optimal Publishing Times Across Networks**\n\n${Object.entries(marketingInsights.bestPublishingTimes).map(([net, data]) => 
            `• **${net}:** ${data.day} at ${data.time} (${data.engagement} boost)`
          ).join('\n')}\n\n💡 Which network would you like more details about?`;
        }
      } else if (lowerMessage.includes('content should') || lowerMessage.includes('talk about') || lowerMessage.includes('trending')) {
        response = `🔥 **Trending Topics This Week**\n\nBased on market analysis and your audience interests:\n\n${marketingInsights.trendingTopics.map((t, i) => 
          `${i + 1}. **${t.topic}**\n   • Relevance Score: ${t.score}/100\n   • Growth: ${t.growth}`
        ).join('\n\n')}\n\n✨ **My Recommendation:** Focus on "${marketingInsights.trendingTopics[0].topic}" - it aligns perfectly with your existing content and has the highest growth potential!`;
      } else if (lowerMessage.includes('performing well') || lowerMessage.includes('good traction') || lowerMessage.includes('top content')) {
        response = `📈 **Your Top Performing Content**\n\n${marketingInsights.topPerformingContent.map((c, i) => 
          `${i + 1}. **${c.title}**\n   • Views: ${c.views.toLocaleString()}\n   • Engagement Rate: ${c.engagement}\n   • Trend: ${c.trend === 'up' ? '📈 Growing' : '➡️ Stable'}`
        ).join('\n\n')}\n\n💡 **Insight:** Your AI-related content is resonating strongly with your audience. Consider creating a follow-up series!`;
      } else if (lowerMessage.includes('needs improvement') || lowerMessage.includes('bad traction') || lowerMessage.includes('underperforming') || lowerMessage.includes('not performing')) {
        response = `📉 **Content Needing Attention**\n\n${marketingInsights.underperformingContent.map((c, i) => 
          `${i + 1}. **${c.title}**\n   • Views: ${c.views.toLocaleString()}\n   • Engagement: ${c.engagement}\n   • Issue: ${c.issue}`
        ).join('\n\n')}\n\n🛠️ **Recommended Actions:**\n• Refresh headlines and meta descriptions\n• Add more visuals and infographics\n• Promote through email newsletter\n• Consider repurposing into different formats`;
      } else if (lowerMessage.includes('product') || lowerMessage.includes('service') || lowerMessage.includes('market this week')) {
        response = `🎯 **Product/Service Marketing Recommendations**\n\nBased on market demand and your sales pipeline:\n\n${marketingInsights.productRecommendations.map((p, i) => 
          `${i + 1}. **${p.product}**\n   • Why: ${p.reason}\n   • Revenue Potential: ${p.potential}`
        ).join('\n\n')}\n\n🏆 **Top Pick:** "${marketingInsights.productRecommendations[1].product}" - The trending topics align perfectly with this offering, maximizing your marketing ROI!`;
      } else if (lowerMessage.includes('strategy') || lowerMessage.includes('publishing plan') || lowerMessage.includes('weekly plan')) {
        response = `📅 **Your Optimized Weekly Publishing Strategy**\n\n${Object.entries(marketingInsights.weeklyStrategy).map(([day, activity]) => 
          `**${day.charAt(0).toUpperCase() + day.slice(1)}:** ${activity}`
        ).join('\n')}\n\n📊 **Channel Mix:**\n• LinkedIn: 3 posts (Tue, Wed, Thu)\n• Twitter: Daily engagement + 2 threads\n• Instagram: 2 posts + 5 stories\n• Newsletter: Friday roundup\n\n💡 This strategy is projected to increase your overall engagement by 34% based on historical data!`;
      } else if (lowerMessage.includes('complete') || lowerMessage.includes('full plan') || lowerMessage.includes('everything')) {
        response = `📋 **Complete Weekly Marketing Plan**\n\n**🎯 Focus Product:** ${marketingInsights.productRecommendations[1].product}\n\n**🔥 Key Topic:** ${marketingInsights.trendingTopics[0].topic}\n\n**📅 Daily Breakdown:**\n${Object.entries(marketingInsights.weeklyStrategy).map(([day, activity]) => 
          `• **${day.charAt(0).toUpperCase() + day.slice(1)}:** ${activity}`
        ).join('\n')}\n\n**⏰ Optimal Posting Times:**\n${Object.entries(marketingInsights.bestPublishingTimes).slice(0, 3).map(([net, data]) => 
          `• ${net}: ${data.day} ${data.time}`
        ).join('\n')}\n\n**📈 Expected Results:**\n• Reach: +45%\n• Engagement: +34%\n• Leads: +28%\n\nWant me to elaborate on any specific part?`;
      } else {
        response = `I'd be happy to help with your marketing strategy! Here are some things I can assist with:\n\n• 📊 **Publishing optimization** - Best times to post on each network\n• 📈 **Content analysis** - What's working and what needs improvement\n• 🔥 **Trend insights** - Topics your audience cares about\n• 🎯 **Product strategy** - What to market and when\n• 📅 **Weekly planning** - Complete publishing schedules\n\nTry asking something like "What's the best time to publish on LinkedIn?" or "What content should I focus on this week?"`;
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  // Login handler
  const handleLogin = () => {
    setLoginError('');
    setIsLoggingIn(true);
    
    // Simulate API call
    setTimeout(() => {
      // Demo credentials: any email with password "demo" or "password"
      if (loginPassword === 'demo' || loginPassword === 'password' || loginPassword === '123456') {
        setCurrentUser({
          name: loginEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: loginEmail,
          avatar: '👤',
          role: 'Marketing Manager'
        });
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError('Invalid email or password. Try password: "demo"');
      }
      setIsLoggingIn(false);
    }, 1500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    setPage('dashboard');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(`Password reset link sent to ${loginEmail}`);
    setShowForgotPassword(false);
  };

  const handleGenerateAsset = (type, contentId, chapterId, chapterTitle) => {
    setGeneratingAsset(`${type}-${contentId}-${chapterId}`);
    setTimeout(() => {
      setGeneratingAsset(null);
      alert(`${type === 'infographic' ? 'Infographic' : 'AI Image'} for "${chapterTitle}" generated!`);
    }, 2500);
  };

  const openPublishModal = (content, chapter) => {
    setSelectedChapter({ content, chapter });
    setSelectedNetworks([]);
    setShowPublishModal(true);
  };

  const openStyleModal = (content, chapter) => {
    setSelectedChapter({ content, chapter });
    setShowStyleModal(true);
  };

  const addItemToProposal = (item) => {
    if (!proposalData.items.find(i => i.id === item.id)) {
      setProposalData({
        ...proposalData,
        items: [...proposalData.items, { ...item, quantity: 1, unitPrice: item.basePrice, discount: 0 }]
      });
    }
  };

  const removeItemFromProposal = (itemId) => {
    setProposalData({
      ...proposalData,
      items: proposalData.items.filter(i => i.id !== itemId)
    });
  };

  const updateItemField = (itemId, field, value) => {
    setProposalData({
      ...proposalData,
      items: proposalData.items.map(i => 
        i.id === itemId ? { ...i, [field]: parseFloat(value) || 0 } : i
      )
    });
  };

  const calculateItemTotal = (item) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    return subtotal - discountAmount;
  };

  const calculateGrandTotal = () => {
    return proposalData.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const handleGenerateProposal = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowProposalModal(false);
      setProposalStep(1);
      setProposalData({
        template: '',
        customer: '',
        isNewCustomer: false,
        newCustomerName: '',
        newCustomerEmail: '',
        newCustomerCompany: '',
        items: [],
        businessProcess: ''
      });
      // In real app, would add to proposals list
      alert('Proposal generated successfully!');
    }, 3000);
  };

  const canProceedStep1 = proposalData.template !== '';
  const canProceedStep2 = proposalData.isNewCustomer 
    ? (proposalData.newCustomerName && proposalData.newCustomerCompany)
    : proposalData.customer !== '';
  const canProceedStep3 = proposalData.items.length > 0;
  const canGenerate = proposalData.businessProcess.length >= 50;

  // Dashboard Data
  const recentActivity = [
    { title: 'AI in Healthcare Guide', type: 'Content', status: 'Published', time: '2 hours ago', color: '#10B981' },
    { title: 'Q1 Marketing Proposal', type: 'Proposal', status: 'Sent', time: '5 hours ago', color: '#10B981' },
    { title: 'Digital Strategy Whitepaper', type: 'Content', status: 'Draft', time: '1 day ago', color: '#3B82F6' },
    { title: 'TechCorp Partnership', type: 'Proposal', status: 'Pending', time: '2 days ago', color: '#F59E0B' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Published': '#10B981', 'Sent': '#10B981', 'Generated': '#10B981', 'Synced': '#10B981',
      'Draft': '#3B82F6', 'Outlined': '#3B82F6', 'Uploaded': '#3B82F6',
      'Pending': '#F59E0B', 'Not Synced': '#6B7280'
    };
    return colors[status] || '#6B7280';
  };

  const Badge = ({ status }) => (
    <span style={{
      padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
      background: `${getStatusColor(status)}20`, color: getStatusColor(status)
    }}>
      {status}
    </span>
  );

  // Login Page
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F4C5C 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif', padding: '20px'
      }}>
        <div style={{ 
          width: '100%', maxWidth: '420px',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px', padding: '40px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              width: '70px', height: '70px', margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
              borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', boxShadow: '0 10px 30px rgba(8, 145, 178, 0.3)'
            }}>
              ✨
            </div>
            <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              ND Marketing Wizard
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
              AI-Powered Marketing Content Platform
            </p>
          </div>

          {!showForgotPassword ? (
            <div>
              {/* Email Field */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', color: 'rgba(255,255,255,0.7)', 
                  fontSize: '13px', fontWeight: '500', marginBottom: '8px' 
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white', fontSize: '14px',
                    outline: 'none', transition: 'all 0.2s'
                  }}
                />
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', color: 'rgba(255,255,255,0.7)', 
                  fontSize: '13px', fontWeight: '500', marginBottom: '8px' 
                }}>
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white', fontSize: '14px',
                    outline: 'none', transition: 'all 0.2s'
                  }}
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '24px'
              }}>
                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: 'rgba(255,255,255,0.7)', fontSize: '13px', cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  style={{
                    background: 'none', border: 'none', color: '#5EEAD4',
                    fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Error Message */}
              {loginError && (
                <div style={{
                  padding: '12px 14px', borderRadius: '8px', marginBottom: '20px',
                  background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5', fontSize: '13px', textAlign: 'center'
                }}>
                  {loginError}
                </div>
              )}

              {/* Login Button */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn || !loginEmail || !loginPassword}
                style={{
                  width: '100%', padding: '14px', borderRadius: '10px',
                  background: (isLoggingIn || !loginEmail || !loginPassword) ? 'rgba(8, 145, 178, 0.5)' : 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                  color: 'white', border: 'none', fontSize: '15px', fontWeight: '600',
                  cursor: (isLoggingIn || !loginEmail || !loginPassword) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(8, 145, 178, 0.3)'
                }}
              >
                {isLoggingIn ? (
                  <>⏳ Signing in...</>
                ) : (
                  <>Sign In →</>
                )}
              </button>

              {/* Divider */}
              <div style={{ 
                display: 'flex', alignItems: 'center', margin: '24px 0',
                color: 'rgba(255,255,255,0.4)', fontSize: '13px'
              }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
                <span style={{ padding: '0 12px' }}>or continue with</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
              </div>

              {/* Social Login */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { name: 'Google', icon: '🔵' },
                  { name: 'Microsoft', icon: '🟦' },
                  { name: 'SSO', icon: '🔐' },
                ].map(provider => (
                  <button
                    key={provider.name}
                    type="button"
                    onClick={() => { setLoginEmail('demo@company.com'); setLoginPassword('demo'); }}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'white', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      fontSize: '13px'
                    }}
                  >
                    {provider.icon}
                  </button>
                ))}
              </div>

              {/* Sign Up Link */}
              <p style={{ 
                textAlign: 'center', marginTop: '24px',
                color: 'rgba(255,255,255,0.6)', fontSize: '14px'
              }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => alert('Contact sales@noondalton.com for access')}
                  style={{
                    background: 'none', border: 'none', color: '#5EEAD4',
                    cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                  }}
                >
                  Request Access
                </button>
              </p>
            </div>
          ) : (
            /* Forgot Password Form */
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', color: 'rgba(255,255,255,0.7)', 
                  fontSize: '13px', fontWeight: '500', marginBottom: '8px' 
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white', fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => { alert(`Password reset link sent to ${loginEmail}`); setShowForgotPassword(false); }}
                style={{
                  width: '100%', padding: '14px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                  color: 'white', border: 'none', fontSize: '15px', fontWeight: '600',
                  cursor: 'pointer', marginBottom: '16px'
                }}
              >
                Send Reset Link
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '14px'
                }}
              >
                ← Back to Login
              </button>
            </div>
          )}

          {/* Demo Hint */}
          <div style={{
            marginTop: '24px', padding: '12px', borderRadius: '8px',
            background: 'rgba(94, 234, 212, 0.1)', border: '1px solid rgba(94, 234, 212, 0.2)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#5EEAD4', fontSize: '12px', margin: 0 }}>
              💡 Demo: Use any email with password <strong>"demo"</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: bg, color: textPrimary }}>
      
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 998
          }}
        />
      )}
      
      {/* Sidebar */}
      <div style={{ 
        width: isMobile ? '280px' : '250px', 
        background: darkMode ? '#020617' : '#0F4C5C', 
        color: 'white', 
        padding: '20px', 
        flexShrink: 0, 
        position: isMobile ? 'fixed' : 'relative',
        top: 0,
        left: isMobile ? (sidebarOpen ? 0 : '-280px') : 0,
        bottom: 0,
        zIndex: 999,
        transition: 'left 0.3s ease',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '20px', fontWeight: '700' }}>ND Marketing</div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px',
                color: 'white', padding: '8px 12px', cursor: 'pointer', fontSize: '16px'
              }}
            >
              ✕
            </button>
          )}
        </div>
        
        {['dashboard', 'content', 'research', 'proposals', 'reports', 'settings'].map(p => (
          <button
            key={p}
            onClick={() => { setPage(p); if (isMobile) setSidebarOpen(false); }}
            style={{
              display: 'block', width: '100%', padding: '12px 16px', marginBottom: '4px',
              background: page === p ? 'rgba(255,255,255,0.15)' : 'transparent',
              border: 'none', borderRadius: '8px', color: 'white', textAlign: 'left',
              cursor: 'pointer', fontSize: '14px'
            }}
          >
            {p === 'content' ? '📝 Content Generator' : 
             p === 'research' ? '🔍 Market Research' :
             p === 'dashboard' ? '📊 Dashboard' :
             p === 'proposals' ? '📋 Proposals' :
             p === 'reports' ? '📈 Reports' :
             p === 'settings' ? '⚙️ Settings' : p}
          </button>
        ))}
        
        {/* User Profile & Logout */}
        <div style={{ 
          marginTop: '40px',
          padding: '16px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', flexShrink: 0
            }}>
              {currentUser?.avatar || '👤'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.name || 'User'}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.role || 'Team Member'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              color: 'white', cursor: 'pointer', fontSize: '13px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Bar */}
        <div style={{ 
          height: '56px', background: cardBg, borderBottom: `1px solid ${border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: isMobile ? '0 12px' : '0 24px',
          position: 'sticky', top: 0, zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Hamburger Menu for Mobile */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: darkMode ? '#334155' : '#F1F5F9',
                  border: 'none', borderRadius: '8px', padding: '8px 10px',
                  cursor: 'pointer', color: textPrimary, fontSize: '18px'
                }}
              >
                ☰
              </button>
            )}
            <span style={{ color: textMuted, fontSize: isMobile ? '14px' : '16px' }}>
              {isMobile ? 'ND Wizard' : 'ND Marketing Wizard'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
            {/* Language Selector - Compact on mobile */}
            {!isMobile && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  style={{
                    padding: '8px 16px', background: darkMode ? '#334155' : '#F1F5F9',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', color: textPrimary,
                    display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px'
                  }}
                >
                  {languages.find(l => l.code === contentLanguage)?.flag} {languages.find(l => l.code === contentLanguage)?.name}
                  <span style={{ fontSize: '10px' }}>▼</span>
                </button>
                {showLanguageMenu && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '4px',
                    background: cardBg, border: `1px solid ${border}`, borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)', minWidth: '160px', zIndex: 100,
                    overflow: 'hidden'
                  }}>
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setContentLanguage(lang.code); setShowLanguageMenu(false); }}
                        style={{
                          width: '100%', padding: '10px 16px', background: contentLanguage === lang.code ? (darkMode ? '#334155' : '#F1F5F9') : 'transparent',
                          border: 'none', cursor: 'pointer', color: textPrimary,
                          display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px',
                          borderBottom: `1px solid ${border}`
                        }}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                        {contentLanguage === lang.code && <span style={{ marginLeft: 'auto', color: '#0891B2' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: isMobile ? '8px 10px' : '8px 16px', 
                background: darkMode ? '#334155' : '#F1F5F9',
                border: 'none', borderRadius: '8px', cursor: 'pointer', color: textPrimary
              }}
            >
              {isMobile ? (darkMode ? '☀️' : '🌙') : (darkMode ? '☀️ Light' : '🌙 Dark')}
            </button>
            {/* User Avatar - Hide name on mobile */}
            {currentUser && !isMobile && (
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '6px 12px 6px 6px', borderRadius: '8px',
                background: darkMode ? '#334155' : '#F1F5F9'
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px'
                }}>
                  {currentUser.avatar}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{currentUser.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, padding: isMobile ? '16px' : (isTablet ? '24px' : '32px'), overflowY: 'auto' }}>
          
          {/* DASHBOARD */}
          {page === 'dashboard' && (
            <div>
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'stretch' : 'center', 
                marginBottom: '24px',
                gap: isMobile ? '16px' : '0'
              }}>
                <div>
                  <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', marginBottom: '8px' }}>Dashboard</h1>
                  <p style={{ color: textMuted, fontSize: isMobile ? '14px' : '16px' }}>Welcome back! Here's what's happening.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setShowShareModal({ type: 'dashboard' })}
                    style={{ 
                      padding: isMobile ? '8px 12px' : '10px 16px', 
                      background: darkMode ? '#334155' : '#F1F5F9',
                      color: textPrimary, border: 'none', borderRadius: '8px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      fontSize: isMobile ? '13px' : '14px'
                    }}
                  >
                    🔗 {isMobile ? '' : 'Share'}
                  </button>
                  <button 
                    onClick={() => setShowNewProjectModal(true)}
                    style={{ 
                      padding: '10px 20px', background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                      color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
                    }}
                  >
                    + New Project
                  </button>
                </div>
              </div>

              {/* KPIs */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'), 
                gap: isMobile ? '12px' : '20px', 
                marginBottom: '24px' 
              }}>
                {[
                  { label: 'Total Content', value: '127', change: '+12%', color: '#0891B2' },
                  { label: 'Proposals Sent', value: '45', change: '+8%', color: '#10B981' },
                  { label: 'Active Campaigns', value: '12', change: '+3%', color: '#8B5CF6' },
                  { label: 'Revenue', value: '$234K', change: '+18%', color: '#F59E0B' },
                ].map((kpi, i) => (
                  <div key={i} style={{ background: cardBg, padding: isMobile ? '16px' : '24px', borderRadius: '12px', border: `1px solid ${border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isMobile ? '8px' : '12px' }}>
                      <span style={{ color: textMuted, fontSize: isMobile ? '12px' : '14px' }}>{kpi.label}</span>
                      <span style={{ color: '#10B981', fontSize: isMobile ? '11px' : '13px', fontWeight: '600' }}>{kpi.change}</span>
                    </div>
                    <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: kpi.color }}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Recent Activity & Quick Actions */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', 
                gap: '20px' 
              }}>
                <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}` }}>
                  <div style={{ 
                    padding: isMobile ? '16px' : '20px 24px', 
                    borderBottom: `1px solid ${border}`, 
                    fontWeight: '600', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <span>Recent Activity</span>
                    {!isMobile && <span style={{ fontSize: '12px', color: textMuted, fontWeight: '400' }}>Team assignments shown</span>}
                  </div>
                  <div style={{ padding: isMobile ? '0 16px' : '0 24px' }}>
                    {recentActivity.map((item, i) => (
                      <div key={i} style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: isMobile ? '12px 0' : '16px 0', 
                        borderBottom: i < recentActivity.length - 1 ? `1px solid ${border}` : 'none',
                        flexWrap: isMobile ? 'wrap' : 'nowrap',
                        gap: isMobile ? '8px' : '0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px', flex: 1, minWidth: 0 }}>
                          {/* Team Member Avatar */}
                          <div 
                            title={`Assigned to: ${teamMembers[i % teamMembers.length].name}`}
                            style={{ 
                              width: isMobile ? '32px' : '36px', 
                              height: isMobile ? '32px' : '36px', 
                              borderRadius: '50%',
                              background: darkMode ? '#334155' : '#E2E8F0',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: isMobile ? '14px' : '18px', 
                              cursor: 'pointer', 
                              border: `2px solid ${cardBg}`,
                              flexShrink: 0
                            }}
                          >
                            {teamMembers[i % teamMembers.length].avatar}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: '500', marginBottom: '4px', fontSize: isMobile ? '13px' : '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                            <div style={{ fontSize: isMobile ? '11px' : '13px', color: textMuted }}>{item.type} - {item.time}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px' }}>
                          <Badge status={item.status} />
                          {!isMobile && (
                            <button
                              onClick={() => setShowShareModal({ type: 'content', title: item.title })}
                              style={{ padding: '4px 8px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                              title="Share for approval"
                            >
                              🔗
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}` }}>
                  <div style={{ padding: isMobile ? '16px' : '20px 24px', borderBottom: `1px solid ${border}`, fontWeight: '600' }}>Quick Actions</div>
                  <div style={{ padding: isMobile ? '16px' : '24px' }}>
                    {[
                      { label: '✨ Create Content', action: () => setShowNewProjectModal(true) },
                      { label: '📋 New Proposal', action: () => setShowProposalModal(true) },
                      { label: '🖼️ Asset Gallery', action: () => setShowAssetGallery(true) },
                      { label: '📊 View Reports', action: () => setPage('reports') },
                    ].map((action, i) => (
                      <button
                        key={i}
                        onClick={action.action}
                        style={{
                          width: '100%', padding: isMobile ? '10px' : '12px', marginBottom: isMobile ? '8px' : '12px',
                          background: i === 0 ? 'linear-gradient(135deg, #0891B2, #5EEAD4)' : (darkMode ? '#334155' : '#F1F5F9'),
                          color: i === 0 ? 'white' : textPrimary,
                          border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
                          fontSize: isMobile ? '13px' : '14px'
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MARKET RESEARCH & PLANNING */}
          {page === 'research' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'stretch' : 'center', 
                marginBottom: '24px',
                gap: isMobile ? '16px' : '0'
              }}>
                <div>
                  <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', marginBottom: '8px' }}>🔍 Market Research & Planning</h1>
                  <p style={{ color: textMuted, fontSize: isMobile ? '14px' : '16px' }}>AI-powered insights for your marketing strategy</p>
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '300px 1fr',
                gap: '20px',
                flex: 1,
                minHeight: 0
              }}>
                {/* Suggested Questions Sidebar */}
                <div style={{ 
                  background: cardBg, 
                  borderRadius: '12px', 
                  border: `1px solid ${border}`,
                  padding: isMobile ? '16px' : '20px',
                  height: isMobile ? 'auto' : 'fit-content'
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: textMuted }}>
                    💡 Quick Questions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(q.text)}
                        style={{
                          padding: '12px 14px',
                          background: darkMode ? '#334155' : '#F8FAFC',
                          border: `1px solid ${border}`,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          color: textPrimary,
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>{q.icon}</span>
                        <span>{q.text}</span>
                      </button>
                    ))}
                  </div>

                  {/* Quick Stats */}
                  <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${border}` }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: textMuted }}>
                      📊 Quick Stats
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { label: 'Content Pieces', value: '127', color: '#0891B2' },
                        { label: 'Avg Engagement', value: '6.8%', color: '#10B981' },
                        { label: 'Active Campaigns', value: '12', color: '#8B5CF6' },
                      ].map((stat, i) => (
                        <div key={i} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '10px 12px',
                          background: darkMode ? '#0F172A' : '#F8FAFC',
                          borderRadius: '8px'
                        }}>
                          <span style={{ fontSize: '13px', color: textMuted }}>{stat.label}</span>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: stat.color }}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chat Interface */}
                <div style={{ 
                  background: cardBg, 
                  borderRadius: '12px', 
                  border: `1px solid ${border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: isMobile ? '500px' : '600px',
                  maxHeight: isMobile ? '500px' : 'calc(100vh - 250px)'
                }}>
                  {/* Chat Header */}
                  <div style={{ 
                    padding: isMobile ? '16px' : '20px 24px', 
                    borderBottom: `1px solid ${border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      🤖
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>AI Marketing Strategist</div>
                      <div style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
                        Online • Ready to help
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    padding: isMobile ? '16px' : '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    {chatMessages.map((msg, i) => (
                      <div 
                        key={i}
                        style={{
                          display: 'flex',
                          justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div style={{
                          maxWidth: isMobile ? '90%' : '80%',
                          padding: '14px 18px',
                          borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          background: msg.role === 'user' 
                            ? 'linear-gradient(135deg, #0891B2, #0E7490)' 
                            : (darkMode ? '#334155' : '#F1F5F9'),
                          color: msg.role === 'user' ? 'white' : textPrimary,
                          fontSize: '14px',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {msg.content.split('**').map((part, j) => 
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{
                          padding: '14px 18px',
                          borderRadius: '18px 18px 18px 4px',
                          background: darkMode ? '#334155' : '#F1F5F9',
                          display: 'flex',
                          gap: '6px'
                        }}>
                          <span style={{ animation: 'bounce 1s infinite', animationDelay: '0ms' }}>•</span>
                          <span style={{ animation: 'bounce 1s infinite', animationDelay: '150ms' }}>•</span>
                          <span style={{ animation: 'bounce 1s infinite', animationDelay: '300ms' }}>•</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div style={{ 
                    padding: isMobile ? '16px' : '20px 24px', 
                    borderTop: `1px solid ${border}`,
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about your marketing strategy..."
                      style={{
                        flex: 1,
                        padding: '14px 18px',
                        borderRadius: '12px',
                        border: `1px solid ${border}`,
                        background: darkMode ? '#0F172A' : 'white',
                        color: textPrimary,
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!chatInput.trim() || isTyping}
                      style={{
                        padding: '14px 20px',
                        borderRadius: '12px',
                        background: chatInput.trim() && !isTyping 
                          ? 'linear-gradient(135deg, #0891B2, #5EEAD4)' 
                          : (darkMode ? '#334155' : '#E2E8F0'),
                        color: chatInput.trim() && !isTyping ? 'white' : textMuted,
                        border: 'none',
                        cursor: chatInput.trim() && !isTyping ? 'pointer' : 'not-allowed',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {isMobile ? '➤' : 'Send ➤'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENT GENERATOR */}
          {page === 'content' && !showEditor && (
            <div>
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'stretch' : 'center', 
                marginBottom: '24px',
                gap: isMobile ? '16px' : '0'
              }}>
                <div>
                  <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', marginBottom: '8px' }}>Content Generator</h1>
                  <p style={{ color: textMuted, fontSize: isMobile ? '14px' : '16px' }}>Create and manage AI-generated content</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {!isMobile && (
                    <button 
                      onClick={() => setShowAssetGallery(true)}
                      style={{ 
                        padding: '10px 16px', background: darkMode ? '#334155' : '#F1F5F9',
                        color: textPrimary, border: 'none', borderRadius: '8px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      🖼️ Asset Gallery
                    </button>
                  )}
                  <button 
                    onClick={() => setShowNewProjectModal(true)}
                    style={{ 
                      padding: isMobile ? '10px 16px' : '10px 20px', 
                      background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                      color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
                      flex: isMobile ? 1 : 'none'
                    }}
                  >
                    + New Project
                  </button>
                </div>
              </div>

              <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}` }}>
                {contentsData.map((content, idx) => (
                  <div key={content.id} style={{ borderBottom: idx < contentsData.length - 1 ? `1px solid ${border}` : 'none' }}>
                    {/* Content Header */}
                    <div
                      onClick={() => setExpandedContent(expandedContent === content.id ? null : content.id)}
                      style={{ 
                        padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        cursor: 'pointer', background: expandedContent === content.id ? (darkMode ? '#1E293B' : '#F8FAFC') : 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: textMuted }}>{expandedContent === content.id ? '▼' : '▶'}</span>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{content.title}</div>
                          <div style={{ fontSize: '13px', color: textMuted }}>{content.chapters.length} chapters • Drag to reorder</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Team Avatars */}
                        <div style={{ display: 'flex', marginRight: '8px' }}>
                          {teamMembers.slice(0, 3).map((member, i) => (
                            <div
                              key={member.id}
                              title={member.name}
                              style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: darkMode ? '#334155' : '#E2E8F0',
                                border: `2px solid ${cardBg}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '14px', marginLeft: i > 0 ? '-8px' : 0,
                                cursor: 'pointer', zIndex: 3 - i
                              }}
                            >
                              {member.avatar}
                            </div>
                          ))}
                        </div>
                        <Badge status={content.status} />
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowShareModal({ type: 'content', title: content.title }); }}
                          style={{
                            padding: '6px 10px', background: darkMode ? '#334155' : '#F1F5F9',
                            border: 'none', borderRadius: '6px', cursor: 'pointer',
                            fontSize: '12px', color: textPrimary, display: 'flex', alignItems: 'center', gap: '4px'
                          }}
                        >
                          🔗 Share
                        </button>
                      </div>
                    </div>

                    {/* Expanded Chapters with Drag & Drop */}
                    {expandedContent === content.id && (
                      <div style={{ padding: '0 24px 20px 50px', background: darkMode ? '#0F172A' : '#F8FAFC' }}>
                        <div style={{ padding: '16px 0', fontSize: '14px', fontWeight: '600', color: textMuted, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>Chapters (drag to reorder)</span>
                          <button style={{ padding: '6px 12px', background: darkMode ? '#334155' : '#E2E8F0', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: textPrimary }}>
                            + Add Chapter
                          </button>
                        </div>
                        {content.chapters.map((chapter, chapterIdx) => (
                          <div 
                            key={chapter.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, content.id, chapterIdx)}
                            onDragOver={(e) => handleDragOver(e, content.id, chapterIdx)}
                            onDragEnd={handleDragEnd}
                            onDrop={(e) => handleDrop(e, content.id, chapterIdx)}
                            style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              padding: '12px 16px', marginBottom: '8px', borderRadius: '8px',
                              background: dragOverChapter?.contentId === content.id && dragOverChapter?.chapterIndex === chapterIdx 
                                ? (darkMode ? '#0891B230' : '#0891B215') 
                                : cardBg, 
                              border: `1px solid ${dragOverChapter?.contentId === content.id && dragOverChapter?.chapterIndex === chapterIdx ? '#0891B2' : border}`,
                              cursor: 'grab',
                              opacity: draggedChapter?.contentId === content.id && draggedChapter?.chapterIndex === chapterIdx ? 0.5 : 1,
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ cursor: 'grab', color: textMuted, fontSize: '16px' }}>⋮⋮</span>
                              <span style={{ 
                                width: '28px', height: '28px', borderRadius: '6px',
                                background: darkMode ? '#334155' : '#E2E8F0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '12px', fontWeight: '600'
                              }}>{chapter.id}</span>
                              <div>
                                <div style={{ fontWeight: '500', fontSize: '14px' }}>{chapter.title}</div>
                                <div style={{ fontSize: '12px', color: textMuted }}>
                                  {chapter.words > 0 ? `${chapter.words.toLocaleString()} words` : 'Not generated'}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <Badge status={chapter.status} />
                              <button 
                                onClick={(e) => { e.stopPropagation(); openGenerateModal(content, chapter); }}
                                disabled={generatingChapter === `${content.id}-${chapter.id}`}
                                style={{ 
                                  padding: '6px 10px', background: 'linear-gradient(135deg, #5EEAD4, #0891B2)', 
                                  color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                                  opacity: generatingChapter === `${content.id}-${chapter.id}` ? 0.7 : 1,
                                  display: 'flex', alignItems: 'center', gap: '4px'
                                }}
                              >
                                {generatingChapter === `${content.id}-${chapter.id}` ? '⏳' : '✨'} Generate
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); openEditor(content, chapter); }}
                                style={{ padding: '6px 10px', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                              >
                                ✏️ Edit
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); openStyleModal(content, chapter); }}
                                style={{ padding: '6px 10px', background: darkMode ? '#334155' : '#F1F5F9', color: textPrimary, border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                              >
                                🎨 Style
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); openInfographicModal(content, chapter); }}
                                disabled={generatingAsset === `infographic-${content.id}-${chapter.id}`}
                                style={{ 
                                  padding: '6px 10px', background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', 
                                  color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                                  opacity: generatingAsset === `infographic-${content.id}-${chapter.id}` ? 0.7 : 1
                                }}
                              >
                                {generatingAsset === `infographic-${content.id}-${chapter.id}` ? '⏳' : '📊'} Infographic
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); openImageModal(content, chapter); }}
                                disabled={generatingAsset === `image-${content.id}-${chapter.id}`}
                                style={{ 
                                  padding: '6px 10px', background: 'linear-gradient(135deg, #EC4899, #DB2777)', 
                                  color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                                  opacity: generatingAsset === `image-${content.id}-${chapter.id}` ? 0.7 : 1
                                }}
                              >
                                {generatingAsset === `image-${content.id}-${chapter.id}` ? '⏳' : '🖼️'} Image
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); openPublishModal(content, chapter); }}
                                style={{ padding: '6px 10px', background: '#0A66C2', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                              >
                                📤 Publish
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WYSIWYG EDITOR VIEW */}
          {page === 'content' && showEditor && selectedChapter && (
            <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 120px)' }}>
              {/* Main Editor */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Editor Header */}
                <div style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                      onClick={() => setShowEditor(false)}
                      style={{ padding: '8px 12px', background: darkMode ? '#334155' : '#F1F5F9', border: 'none', borderRadius: '6px', cursor: 'pointer', color: textPrimary }}
                    >
                      ← Back
                    </button>
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{selectedChapter.chapter.title}</h2>
                      <p style={{ fontSize: '13px', color: textMuted }}>{selectedChapter.content.title}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setShowTranslateModal(true)}
                      style={{ padding: '8px 14px', background: darkMode ? '#334155' : '#F1F5F9', border: 'none', borderRadius: '6px', cursor: 'pointer', color: textPrimary, display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      🌐 Translate
                    </button>
                    <button style={{ padding: '8px 14px', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                      💾 Save
                    </button>
                  </div>
                </div>

                {/* Formatting Toolbar */}
                <div style={{ 
                  display: 'flex', gap: '4px', padding: '10px 12px', marginBottom: '12px',
                  background: cardBg, borderRadius: '8px', border: `1px solid ${border}`, flexWrap: 'wrap'
                }}>
                  {[
                    { icon: 'B', label: 'Bold', style: { fontWeight: 'bold' } },
                    { icon: 'I', label: 'Italic', style: { fontStyle: 'italic' } },
                    { icon: 'U', label: 'Underline', style: { textDecoration: 'underline' } },
                    { icon: 'S', label: 'Strikethrough', style: { textDecoration: 'line-through' } },
                  ].map(btn => (
                    <button key={btn.label} title={btn.label} style={{
                      width: '32px', height: '32px', background: darkMode ? '#334155' : '#F1F5F9',
                      border: 'none', borderRadius: '4px', cursor: 'pointer', ...btn.style, color: textPrimary
                    }}>{btn.icon}</button>
                  ))}
                  <div style={{ width: '1px', background: border, margin: '0 8px' }} />
                  {['H1', 'H2', 'H3'].map(h => (
                    <button key={h} style={{
                      padding: '0 10px', height: '32px', background: darkMode ? '#334155' : '#F1F5F9',
                      border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: textPrimary
                    }}>{h}</button>
                  ))}
                  <div style={{ width: '1px', background: border, margin: '0 8px' }} />
                  {[
                    { icon: '•', label: 'Bullet List' },
                    { icon: '1.', label: 'Numbered List' },
                    { icon: '""', label: 'Quote' },
                    { icon: '🔗', label: 'Link' },
                    { icon: '📷', label: 'Image' },
                  ].map(btn => (
                    <button key={btn.label} title={btn.label} style={{
                      width: '32px', height: '32px', background: darkMode ? '#334155' : '#F1F5F9',
                      border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: textPrimary
                    }}>{btn.icon}</button>
                  ))}
                  <div style={{ width: '1px', background: border, margin: '0 8px' }} />
                  <button style={{
                    padding: '0 12px', height: '32px', background: 'linear-gradient(135deg, #5EEAD4, #0891B2)',
                    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: 'white',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}>✨ AI Assist</button>
                </div>

                {/* Editor Area */}
                <div 
                  style={{ 
                    flex: 1, padding: '24px', background: cardBg, borderRadius: '8px', 
                    border: `1px solid ${border}`, overflowY: 'auto', lineHeight: '1.8',
                    fontSize: '15px'
                  }}
                  contentEditable
                  onMouseUp={handleTextSelection}
                  dangerouslySetInnerHTML={{ __html: editorContent }}
                />

                {/* AI Contextual Toolbar (appears on text selection) */}
                {showAIToolbar && (
                  <div style={{
                    position: 'fixed', top: aiToolbarPosition.top, left: aiToolbarPosition.left,
                    background: darkMode ? '#1E293B' : 'white', borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)', border: `1px solid ${border}`,
                    display: 'flex', gap: '4px', padding: '6px', zIndex: 1000
                  }}>
                    {[
                      { action: 'Shorten', icon: '📝' },
                      { action: 'Expand', icon: '📖' },
                      { action: 'Improve', icon: '✨' },
                      { action: 'Simplify', icon: '💡' },
                      { action: 'Professional', icon: '👔' },
                      { action: 'Casual', icon: '😊' },
                    ].map(item => (
                      <button
                        key={item.action}
                        onClick={() => handleAIAction(item.action)}
                        style={{
                          padding: '6px 10px', background: darkMode ? '#334155' : '#F8FAFC',
                          border: 'none', borderRadius: '4px', cursor: 'pointer',
                          fontSize: '12px', color: textPrimary, display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        {item.icon} {item.action}
                      </button>
                    ))}
                  </div>
                )}

                {/* Plagiarism & AI Detection Footer */}
                <div style={{ 
                  marginTop: '12px', padding: '12px 16px', background: cardBg, 
                  borderRadius: '8px', border: `1px solid ${border}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <button
                      onClick={runPlagiarismScan}
                      disabled={scanningPlagiarism}
                      style={{
                        padding: '8px 14px', background: darkMode ? '#334155' : '#F1F5F9',
                        border: 'none', borderRadius: '6px', cursor: 'pointer',
                        fontSize: '13px', color: textPrimary, display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      {scanningPlagiarism ? '⏳ Scanning...' : '🔍 Scan for Plagiarism & AI'}
                    </button>
                    
                    {plagiarismScore !== null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', color: textMuted }}>Originality:</span>
                        <span style={{ 
                          fontWeight: '600', 
                          color: plagiarismScore >= 90 ? '#10B981' : plagiarismScore >= 70 ? '#F59E0B' : '#EF4444'
                        }}>{plagiarismScore}%</span>
                      </div>
                    )}
                    
                    {aiDetectionScore !== null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', color: textMuted }}>AI Detected:</span>
                        <span style={{ 
                          fontWeight: '600',
                          color: aiDetectionScore <= 20 ? '#10B981' : aiDetectionScore <= 50 ? '#F59E0B' : '#EF4444'
                        }}>{aiDetectionScore}%</span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ fontSize: '12px', color: textMuted }}>
                    Last saved: Just now
                  </div>
                </div>
              </div>

              {/* SEO Sidebar */}
              <div style={{ width: '280px', flexShrink: 0 }}>
                <div style={{ 
                  background: cardBg, borderRadius: '12px', border: `1px solid ${border}`,
                  padding: '20px', height: '100%', overflowY: 'auto'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📈 SEO Performance
                  </h3>
                  
                  {/* Overall Score */}
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ 
                      width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 12px',
                      background: `conic-gradient(${seoScore >= 70 ? '#10B981' : seoScore >= 50 ? '#F59E0B' : '#EF4444'} ${seoScore * 3.6}deg, ${darkMode ? '#334155' : '#E2E8F0'} 0deg)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{ 
                        width: '80px', height: '80px', borderRadius: '50%', background: cardBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px', fontWeight: '700', color: seoScore >= 70 ? '#10B981' : seoScore >= 50 ? '#F59E0B' : '#EF4444'
                      }}>
                        {seoScore}
                      </div>
                    </div>
                    <div style={{ fontWeight: '600' }}>SEO Score</div>
                    <div style={{ fontSize: '12px', color: textMuted }}>
                      {seoScore >= 70 ? 'Good' : seoScore >= 50 ? 'Needs Improvement' : 'Poor'}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Keyword Density', value: '2.4%', status: 'good', target: '1-3%' },
                      { label: 'Readability', value: 'Grade 8', status: 'good', target: 'Grade 7-9' },
                      { label: 'Title Length', value: '58 chars', status: 'warning', target: '50-60' },
                      { label: 'Meta Description', value: 'Missing', status: 'bad', target: '150-160 chars' },
                      { label: 'Headings', value: '4 found', status: 'good', target: 'H1, H2s' },
                      { label: 'Internal Links', value: '0', status: 'warning', target: '2-3 links' },
                      { label: 'Image Alt Text', value: '1/2', status: 'warning', target: 'All images' },
                    ].map(metric => (
                      <div key={metric.label} style={{ 
                        padding: '10px 12px', background: darkMode ? '#0F172A' : '#F8FAFC',
                        borderRadius: '8px', border: `1px solid ${border}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>{metric.label}</span>
                          <span style={{ 
                            fontSize: '12px', fontWeight: '600',
                            color: metric.status === 'good' ? '#10B981' : metric.status === 'warning' ? '#F59E0B' : '#EF4444'
                          }}>
                            {metric.status === 'good' ? '✓' : metric.status === 'warning' ? '⚠' : '✗'} {metric.value}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: textMuted }}>Target: {metric.target}</div>
                      </div>
                    ))}
                  </div>

                  {/* Focus Keyword */}
                  <div style={{ marginTop: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Focus Keyword</label>
                    <input
                      type="text"
                      placeholder="e.g., AI healthcare"
                      defaultValue="AI healthcare"
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: '6px',
                        border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                        color: textPrimary, fontSize: '13px'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROPOSALS */}
          {page === 'proposals' && (
            <div>
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'stretch' : 'center', 
                marginBottom: '24px',
                gap: isMobile ? '16px' : '0'
              }}>
                <div>
                  <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', marginBottom: '8px' }}>Proposals</h1>
                  <p style={{ color: textMuted, fontSize: isMobile ? '14px' : '16px' }}>Create and manage sales proposals</p>
                </div>
                <button 
                  onClick={() => setShowProposalModal(true)}
                  style={{ 
                    padding: isMobile ? '10px 16px' : '10px 20px', 
                    background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
                  }}
                >
                  + Create Proposal
                </button>
              </div>

              <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}`, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '800px' : 'auto' }}>
                    <thead>
                      <tr style={{ background: darkMode ? '#0F172A' : '#F8FAFC' }}>
                        {[
                          { key: 'name', label: 'Proposal Name' },
                          { key: 'customer', label: 'Customer' },
                          { key: 'amount', label: 'Amount' },
                          { key: 'status', label: 'Status' },
                          { key: 'signature', label: 'E-Signature' },
                          { key: 'date', label: 'Date' },
                          { key: 'crm', label: 'CRM' },
                        ].map(col => (
                          <th 
                            key={col.key}
                            onClick={() => handleProposalSort(col.key)}
                            style={{ 
                              padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', 
                              color: textMuted, borderBottom: `1px solid ${border}`, cursor: 'pointer',
                              userSelect: 'none', whiteSpace: 'nowrap'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {col.label}
                              <span style={{ fontSize: '10px', opacity: proposalSortColumn === col.key ? 1 : 0.3 }}>
                                {proposalSortColumn === col.key 
                                  ? (proposalSortDirection === 'asc' ? '▲' : '▼')
                                  : '⇅'
                                }
                              </span>
                            </div>
                          </th>
                        ))}
                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: textMuted, borderBottom: `1px solid ${border}` }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedProposals.map(p => {
                        const sigBadge = getSignatureBadge(p.signature);
                        return (
                          <tr key={p.id} style={{ borderBottom: `1px solid ${border}` }}>
                            <td style={{ padding: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>{p.name}</span>
                                {/* Version History Icon */}
                                <button
                                  onClick={() => setShowVersionHistory(p)}
                                  title={`${p.versions?.length || 1} version(s)`}
                                  style={{
                                  padding: '4px 6px', background: darkMode ? '#334155' : '#F1F5F9',
                                  border: 'none', borderRadius: '4px', cursor: 'pointer',
                                  fontSize: '11px', color: textMuted, display: 'flex', alignItems: 'center', gap: '4px'
                                }}
                              >
                                📋 v{p.versions?.[0]?.version || 1}
                              </button>
                            </div>
                          </td>
                          <td style={{ padding: '16px' }}>{p.customer}</td>
                          <td style={{ padding: '16px', fontWeight: '600' }}>${p.amount.toLocaleString()}</td>
                          <td style={{ padding: '16px' }}><Badge status={p.status} /></td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ 
                                padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                                background: sigBadge.bg, color: sigBadge.color,
                                display: 'flex', alignItems: 'center', gap: '4px'
                              }}>
                                {sigBadge.icon} {sigBadge.label}
                              </span>
                              {p.signature !== 'signed' && (
                                <button
                                  onClick={() => setShowSignatureModal(p)}
                                  style={{
                                    padding: '4px 8px', background: '#4F46E5', color: 'white',
                                    border: 'none', borderRadius: '4px', cursor: 'pointer',
                                    fontSize: '11px', fontWeight: '600'
                                  }}
                                >
                                  ✍️ Sign
                                </button>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '16px', color: textMuted }}>{new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td style={{ padding: '16px' }}><Badge status={p.crm} /></td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button title="View" style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}>👁️</button>
                              <button title="Edit" style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}>✏️</button>
                              <button title="Sync to CRM" style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}>☁️↑</button>
                              <button title="Download" style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}>📥</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
                <div style={{ padding: '12px 16px', borderTop: `1px solid ${border}`, fontSize: '13px', color: textMuted }}>
                  Showing {sortedProposals.length} proposals • Sorted by {proposalSortColumn} ({proposalSortDirection === 'asc' ? 'ascending' : 'descending'})
                </div>
              </div>
            </div>
          )}

          {/* VERSION HISTORY MODAL */}
          {showVersionHistory && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.6)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }} onClick={() => setShowVersionHistory(null)}>
              <div style={{
                background: cardBg, borderRadius: '16px', width: isMobile ? '95%' : '550px', maxHeight: '80vh',
                overflow: 'hidden', display: 'flex', flexDirection: 'column'
              }} onClick={e => e.stopPropagation()}>
                <div style={{ 
                  padding: '20px 24px', borderBottom: `1px solid ${border}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>📋 Version History</h2>
                    <p style={{ fontSize: '14px', color: textMuted }}>{showVersionHistory.name}</p>
                  </div>
                  <button 
                    onClick={() => setShowVersionHistory(null)}
                    style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textMuted }}
                  >×</button>
                </div>
                <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
                  <div style={{ position: 'relative' }}>
                    {/* Timeline line */}
                    <div style={{ 
                      position: 'absolute', left: '11px', top: '24px', bottom: '24px', 
                      width: '2px', background: border 
                    }} />
                    
                    {showVersionHistory.versions?.map((ver, idx) => (
                      <div key={ver.version} style={{ 
                        display: 'flex', gap: '16px', marginBottom: '20px', position: 'relative'
                      }}>
                        {/* Timeline dot */}
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                          background: idx === 0 ? '#0891B2' : (darkMode ? '#334155' : '#E2E8F0'),
                          border: `3px solid ${cardBg}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontWeight: '700', color: idx === 0 ? 'white' : textMuted
                        }}>
                          {ver.version}
                        </div>
                        
                        <div style={{
                          flex: 1, padding: '16px', borderRadius: '10px',
                          background: idx === 0 ? (darkMode ? '#0891B220' : '#0891B210') : (darkMode ? '#0F172A' : '#F8FAFC'),
                          border: `1px solid ${idx === 0 ? '#0891B2' : border}`
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontWeight: '600' }}>Version {ver.version} {idx === 0 && <span style={{ color: '#0891B2', fontSize: '12px' }}>(Current)</span>}</span>
                            <span style={{ fontSize: '12px', color: textMuted }}>{ver.date}</span>
                          </div>
                          <div style={{ fontSize: '13px', color: textMuted, marginBottom: '8px' }}>{ver.changes}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '600', color: '#10B981' }}>${ver.amount.toLocaleString()}</span>
                            {idx !== 0 && (
                              <button style={{
                                padding: '4px 10px', background: darkMode ? '#334155' : '#F1F5F9',
                                border: 'none', borderRadius: '4px', cursor: 'pointer',
                                fontSize: '11px', color: textPrimary
                              }}>
                                Restore this version
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ 
                  padding: '16px 24px', borderTop: `1px solid ${border}`,
                  display: 'flex', justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => setShowVersionHistory(null)}
                    style={{
                      padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                      background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                    }}
                  >Close</button>
                </div>
              </div>
            </div>
          )}

          {/* E-SIGNATURE MODAL */}
          {showSignatureModal && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.6)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }} onClick={() => setShowSignatureModal(null)}>
              <div style={{
                background: cardBg, borderRadius: '16px', width: isMobile ? '95%' : '500px',
                overflow: 'hidden', display: 'flex', flexDirection: 'column'
              }} onClick={e => e.stopPropagation()}>
                <div style={{ 
                  padding: '20px 24px', borderBottom: `1px solid ${border}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>✍️ Send for E-Signature</h2>
                    <p style={{ fontSize: '14px', color: textMuted }}>{showSignatureModal.name}</p>
                  </div>
                  <button 
                    onClick={() => setShowSignatureModal(null)}
                    style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textMuted }}
                  >×</button>
                </div>
                <div style={{ padding: '24px' }}>
                  <p style={{ fontSize: '14px', color: textMuted, marginBottom: '20px' }}>
                    Send this proposal to <strong>{showSignatureModal.customer}</strong> for electronic signature.
                  </p>
                  
                  <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>Select E-Signature Provider</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 'docusign', name: 'DocuSign', icon: '📝', color: '#FFCC00' },
                      { id: 'pandadoc', name: 'PandaDoc', icon: '🐼', color: '#4CAF50' },
                      { id: 'hellosign', name: 'HelloSign', icon: '✍️', color: '#00B4E6' },
                    ].map(provider => (
                      <button
                        key={provider.id}
                        onClick={() => handleSendForSignature(showSignatureModal.id)}
                        style={{
                          padding: '16px 20px', borderRadius: '10px', cursor: 'pointer',
                          background: darkMode ? '#334155' : '#F8FAFC',
                          border: `1px solid ${border}`,
                          display: 'flex', alignItems: 'center', gap: '16px',
                          color: textPrimary
                        }}
                      >
                        <span style={{ fontSize: '28px' }}>{provider.icon}</span>
                        <div style={{ textAlign: 'left', flex: 1 }}>
                          <div style={{ fontWeight: '600' }}>{provider.name}</div>
                          <div style={{ fontSize: '12px', color: textMuted }}>Send via {provider.name}</div>
                        </div>
                        <span style={{ color: textMuted }}>→</span>
                      </button>
                    ))}
                  </div>

                  <div style={{ 
                    marginTop: '16px', padding: '12px', borderRadius: '8px',
                    background: darkMode ? '#0F172A' : '#FEF3C7', border: '1px solid #F59E0B'
                  }}>
                    <div style={{ fontSize: '12px', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      💡 The recipient will receive an email with a link to review and sign the proposal electronically.
                    </div>
                  </div>
                </div>
                <div style={{ 
                  padding: '16px 24px', borderTop: `1px solid ${border}`,
                  display: 'flex', justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => setShowSignatureModal(null)}
                    style={{
                      padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                      background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                    }}
                  >Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* REPORTS */}
          {page === 'reports' && (
            <div>
              <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', marginBottom: '8px' }}>Reports</h1>
              <p style={{ color: textMuted, marginBottom: '24px', fontSize: isMobile ? '14px' : '16px' }}>Analytics and performance insights</p>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', 
                gap: isMobile ? '12px' : '20px', 
                marginBottom: '24px' 
              }}>
                {[
                  { label: 'Total Revenue', value: '$234,500', color: '#0891B2' },
                  { label: 'Content Generated', value: '156', color: '#10B981' },
                  { label: 'Proposals Created', value: '45', color: '#8B5CF6' },
                  { label: 'Deals Closed', value: '23', color: '#F59E0B' },
                ].map((kpi, i) => (
                  <div key={i} style={{ background: cardBg, padding: isMobile ? '16px' : '24px', borderRadius: '12px', border: `1px solid ${border}` }}>
                    <div style={{ color: textMuted, fontSize: isMobile ? '12px' : '14px', marginBottom: '8px' }}>{kpi.label}</div>
                    <div style={{ fontSize: isMobile ? '20px' : '28px', fontWeight: '700', color: kpi.color }}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', 
                gap: '20px', 
                marginBottom: '24px' 
              }}>
                {/* Interactive Revenue Chart */}
                <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}`, padding: isMobile ? '16px' : '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ fontWeight: '600', fontSize: isMobile ? '14px' : '16px' }}>Revenue Trend</h3>
                    <span style={{ fontSize: '12px', color: textMuted }}>Click a bar for details</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: isMobile ? '6px' : '12px', height: isMobile ? '120px' : '160px' }}>
                    {revenueData.map((data, i) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedMonth(selectedMonth === data.month ? null : data.month)}
                        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                      >
                        <div style={{ 
                          width: '100%', height: `${(data.value / 70000) * (isMobile ? 100 : 140)}px`, 
                          background: selectedMonth === data.month 
                            ? 'linear-gradient(180deg, #F59E0B, #FCD34D)' 
                            : 'linear-gradient(180deg, #0891B2, #5EEAD4)', 
                          borderRadius: '4px 4px 0 0',
                          transition: 'all 0.2s',
                          transform: selectedMonth === data.month ? 'scale(1.05)' : 'scale(1)'
                        }} />
                        <span style={{ fontSize: isMobile ? '10px' : '12px', color: selectedMonth === data.month ? '#F59E0B' : textMuted, marginTop: '8px', fontWeight: selectedMonth === data.month ? '600' : '400' }}>
                          {data.month}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Drill-down details */}
                  {selectedMonth && (
                    <div style={{ 
                      marginTop: '20px', padding: isMobile ? '12px' : '16px', borderRadius: '10px',
                      background: darkMode ? '#0F172A' : '#FEF3C7', border: '1px solid #F59E0B'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '13px' : '14px' }}>
                        <span>📊 {selectedMonth} Breakdown</span>
                        <span style={{ color: '#F59E0B' }}>${revenueData.find(d => d.month === selectedMonth)?.value.toLocaleString()}</span>
                      </div>
                      {revenueData.find(d => d.month === selectedMonth)?.proposals.map((p, i) => (
                        <div key={i} style={{ 
                          display: 'flex', justifyContent: 'space-between', 
                          padding: '8px 0', borderTop: i > 0 ? `1px solid ${border}` : 'none',
                          fontSize: isMobile ? '12px' : '13px',
                          flexWrap: isMobile ? 'wrap' : 'nowrap',
                          gap: '4px'
                        }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: '500' }}>{p.name}</span>
                            {!isMobile && <span style={{ color: textMuted, marginLeft: '8px' }}>• {p.customer}</span>}
                          </div>
                          <span style={{ fontWeight: '600', color: '#10B981' }}>${p.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content by Status */}
                <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}`, padding: '24px' }}>
                  <h3 style={{ marginBottom: '20px', fontWeight: '600' }}>Content by Status</h3>
                  {[
                    { label: 'Published', pct: 45, color: '#10B981' },
                    { label: 'Generated', pct: 32, color: '#0891B2' },
                    { label: 'Draft', pct: 18, color: '#F59E0B' },
                    { label: 'Outlined', pct: 5, color: '#8B5CF6' },
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                        <span>{item.label}</span>
                        <span style={{ fontWeight: '600' }}>{item.pct}%</span>
                      </div>
                      <div style={{ height: '8px', borderRadius: '4px', background: darkMode ? '#334155' : '#E2E8F0' }}>
                        <div style={{ height: '100%', width: `${item.pct}%`, borderRadius: '4px', background: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Predictive Content & CLV */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                {/* Predictive Content Performance */}
                <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}`, padding: isMobile ? '16px' : '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <span style={{ fontSize: isMobile ? '20px' : '24px' }}>🔮</span>
                    <div>
                      <h3 style={{ fontWeight: '600', fontSize: isMobile ? '14px' : '16px' }}>Predictive Content Performance</h3>
                      <p style={{ fontSize: '12px', color: textMuted }}>AI-suggested topics for Q2 2025</p>
                    </div>
                  </div>
                  
                  {predictedTopics.map((topic, i) => (
                    <div key={i} style={{ 
                      padding: isMobile ? '12px' : '14px 16px', marginBottom: '10px', borderRadius: '10px',
                      background: darkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${border}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontWeight: '500', fontSize: isMobile ? '13px' : '14px' }}>{topic.topic}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600',
                            background: '#10B98120', color: '#10B981'
                          }}>
                            {topic.engagement}
                          </span>
                          <span style={{ fontSize: '14px' }}>{topic.trend === 'up' ? '📈' : '➡️'}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: darkMode ? '#334155' : '#E2E8F0' }}>
                          <div style={{ 
                            height: '100%', width: `${topic.score}%`, borderRadius: '3px',
                            background: topic.score >= 90 ? '#10B981' : topic.score >= 80 ? '#0891B2' : '#F59E0B'
                          }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: topic.score >= 90 ? '#10B981' : '#0891B2' }}>
                          {topic.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <button style={{
                    width: '100%', padding: '12px', marginTop: '10px',
                    background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                    color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
                  }}>
                    ✨ Generate Content for Top Topic
                  </button>
                </div>

                {/* Customer Lifetime Value Report */}
                <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}`, padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '24px' }}>💎</span>
                    <div>
                      <h3 style={{ fontWeight: '600' }}>Customer Lifetime Value</h3>
                      <p style={{ fontSize: '12px', color: textMuted }}>Top customers by total revenue</p>
                    </div>
                  </div>
                  
                  {customerCLV.map((customer, i) => (
                    <div key={i} style={{ 
                      padding: '12px 0', borderBottom: i < customerCLV.length - 1 ? `1px solid ${border}` : 'none'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ 
                            width: '24px', height: '24px', borderRadius: '6px',
                            background: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : (darkMode ? '#334155' : '#E2E8F0'),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: '700'
                          }}>
                            {i + 1}
                          </span>
                          <span style={{ fontWeight: '500' }}>{customer.customer}</span>
                          {customer.status === 'new' && (
                            <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', background: '#3B82F620', color: '#3B82F6' }}>NEW</span>
                          )}
                        </div>
                        <span style={{ fontWeight: '700', color: '#10B981' }}>${customer.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: textMuted, marginLeft: '34px' }}>
                        <span>{customer.proposals} proposals</span>
                        <span>Avg: ${customer.avgDeal.toLocaleString()}</span>
                        <span>Since: {customer.firstDeal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {page === 'settings' && (
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Settings</h1>
              <p style={{ color: textMuted, marginBottom: '24px' }}>Manage templates, social networks, and integrations</p>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: `1px solid ${border}` }}>
                {[
                  { id: 'content', label: 'Content Templates' },
                  { id: 'proposals', label: 'Proposal Templates' },
                  { id: 'social', label: 'Social Networks' },
                  { id: 'language', label: 'Document Language' },
                  { id: 'integrations', label: 'Integrations' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSettingsTab(tab.id)}
                    style={{
                      padding: '12px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
                      fontSize: '14px', fontWeight: '500',
                      color: activeSettingsTab === tab.id ? '#0891B2' : textMuted,
                      borderBottom: activeSettingsTab === tab.id ? '2px solid #0891B2' : '2px solid transparent',
                      marginBottom: '-1px'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Templates */}
              {activeSettingsTab === 'content' && (
                <div>
                  {/* Brand Voice Profiles */}
                  <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}`, marginBottom: '20px' }}>
                    <div style={{ padding: '20px 24px', borderBottom: `1px solid ${border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '20px' }}>🎭</span>
                        <span style={{ fontWeight: '600' }}>Brand Voice Profiles</span>
                      </div>
                      <p style={{ fontSize: '13px', color: textMuted }}>Define your brand's tone for AI-generated content</p>
                    </div>
                    <div style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                        {brandVoices.map(voice => (
                          <div
                            key={voice.id}
                            onClick={() => setSelectedBrandVoice(voice.id)}
                            style={{
                              padding: '16px', borderRadius: '10px', cursor: 'pointer',
                              border: `2px solid ${selectedBrandVoice === voice.id ? '#0891B2' : border}`,
                              background: selectedBrandVoice === voice.id ? '#0891B215' : 'transparent',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                              <span style={{ fontSize: '24px' }}>{voice.icon}</span>
                              <div>
                                <div style={{ fontWeight: '600' }}>{voice.name}</div>
                                <div style={{ fontSize: '12px', color: textMuted }}>{voice.description}</div>
                              </div>
                              {selectedBrandVoice === voice.id && (
                                <span style={{ marginLeft: 'auto', color: '#0891B2' }}>✓</span>
                              )}
                            </div>
                            <div style={{ 
                              fontSize: '11px', padding: '6px 10px', borderRadius: '6px',
                              background: darkMode ? '#0F172A' : '#F1F5F9', color: textMuted
                            }}>
                              Tone: {voice.tone}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button style={{
                        marginTop: '16px', padding: '10px 16px',
                        background: darkMode ? '#334155' : '#F1F5F9',
                        border: 'none', borderRadius: '8px', cursor: 'pointer',
                        fontSize: '13px', color: textPrimary
                      }}>
                        + Create Custom Voice Profile
                      </button>
                    </div>
                  </div>

                  {/* Content Templates List */}
                  <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}` }}>
                    <div style={{ padding: '20px 24px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600' }}>Content Templates</span>
                      <button style={{ padding: '8px 16px', background: '#0891B2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Upload</button>
                    </div>
                    {['Modern Corporate One-Pager', 'Professional Whitepaper', 'LinkedIn Post Template'].map((t, i) => (
                      <div key={i} style={{ padding: '16px 24px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t}</span>
                        <div>
                          <button style={{ padding: '4px 8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>👁️</button>
                          <button style={{ padding: '4px 8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>✏️</button>
                          <button style={{ padding: '4px 8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Networks */}
              {activeSettingsTab === 'social' && (
                <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}`, padding: '24px' }}>
                  <p style={{ color: textMuted, marginBottom: '20px' }}>Connect your social media accounts to publish content directly</p>
                  {[
                    { name: 'LinkedIn', color: '#0A66C2', connected: true },
                    { name: 'Medium', color: '#000000', connected: true },
                    { name: 'TikTok', color: '#000000', connected: false },
                    { name: 'Facebook', color: '#1877F2', connected: true },
                    { name: 'Instagram', color: '#E4405F', connected: false },
                  ].map((n, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '16px 20px', marginBottom: '12px', borderRadius: '12px',
                      background: n.connected ? (darkMode ? '#0F4C5C20' : '#5EEAD410') : (darkMode ? '#1E293B' : '#F8FAFC'),
                      border: `1px solid ${n.connected ? '#5EEAD4' : border}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: n.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                          {n.name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600' }}>{n.name}</div>
                          <div style={{ fontSize: '13px', color: textMuted }}>{n.connected ? 'Connected' : 'Not connected'}</div>
                        </div>
                      </div>
                      <button style={{
                        padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px',
                        background: n.connected ? 'transparent' : '#0891B2',
                        color: n.connected ? '#EF4444' : 'white',
                        border: n.connected ? '1px solid #EF4444' : 'none'
                      }}>
                        {n.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Document Language */}
              {activeSettingsTab === 'language' && (
                <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}`, padding: '24px' }}>
                  <p style={{ color: textMuted, marginBottom: '20px' }}>Select the default language for AI-generated content</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {[
                      { code: 'en', label: 'English', flag: '🇺🇸' },
                      { code: 'es', label: 'Spanish', flag: '🇪🇸' },
                      { code: 'fr', label: 'French', flag: '🇫🇷' },
                      { code: 'de', label: 'German', flag: '🇩🇪' },
                      { code: 'pt', label: 'Portuguese', flag: '🇧🇷' },
                      { code: 'it', label: 'Italian', flag: '🇮🇹' },
                      { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
                      { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
                    ].map(lang => (
                      <button
                        key={lang.code}
                        style={{
                          padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                          background: darkMode ? '#1E293B' : '#F8FAFC', border: `2px solid ${border}`,
                          borderRadius: '12px', cursor: 'pointer'
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>{lang.flag}</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: textPrimary }}>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Integrations */}
              {activeSettingsTab === 'integrations' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                    {[
                      { name: 'Salesforce', code: 'SF', color: '#00A1E0', connected: true },
                      { name: 'HubSpot', code: 'HS', color: '#FF7A59', connected: false },
                      { name: 'AI Model', code: 'AI', color: '#0891B2', connected: true },
                    ].map((int, i) => (
                      <div key={i} style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}`, padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: int.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>{int.code}</div>
                          <div>
                            <div style={{ fontWeight: '600' }}>{int.name}</div>
                            <div style={{ fontSize: '12px', color: int.connected ? '#10B981' : '#F59E0B' }}>{int.connected ? '✓ Connected' : '⚠ Not Connected'}</div>
                          </div>
                        </div>
                        <button style={{
                          width: '100%', padding: '10px', borderRadius: '8px', cursor: 'pointer',
                          background: int.connected ? 'transparent' : '#0891B2',
                          color: int.connected ? textPrimary : 'white',
                          border: int.connected ? `1px solid ${border}` : 'none'
                        }}>
                          {int.connected ? 'Configure' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* CRM Activity Log */}
                  <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}` }}>
                    <div style={{ 
                      padding: '20px 24px', borderBottom: `1px solid ${border}`,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>📋 CRM Activity Log</h3>
                        <p style={{ fontSize: '13px', color: textMuted }}>Recent sync activity and events</p>
                      </div>
                      <button style={{
                        padding: '8px 14px', background: darkMode ? '#334155' : '#F1F5F9',
                        border: 'none', borderRadius: '6px', cursor: 'pointer',
                        fontSize: '13px', color: textPrimary
                      }}>
                        🔄 Refresh
                      </button>
                    </div>
                    
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {crmActivityLog.map((log, idx) => (
                        <div 
                          key={log.id}
                          style={{
                            padding: '14px 24px',
                            borderBottom: idx < crmActivityLog.length - 1 ? `1px solid ${border}` : 'none',
                            display: 'flex', alignItems: 'center', gap: '16px'
                          }}
                        >
                          {/* Status Icon */}
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: log.status === 'success' ? '#10B98120' : '#EF444420',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '16px'
                          }}>
                            {log.status === 'success' ? '✓' : '✗'}
                          </div>
                          
                          {/* Log Details */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                              <span style={{ fontWeight: '500' }}>{log.action}</span>
                              <span style={{ 
                                padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '600',
                                background: log.status === 'success' ? '#10B98120' : '#EF444420',
                                color: log.status === 'success' ? '#10B981' : '#EF4444'
                              }}>
                                {log.status === 'success' ? 'Success' : 'Failed'}
                              </span>
                            </div>
                            <div style={{ fontSize: '13px', color: textMuted }}>
                              {log.proposal} • {log.crm}
                              {log.error && <span style={{ color: '#EF4444' }}> • {log.error}</span>}
                            </div>
                          </div>
                          
                          {/* Timestamp */}
                          <div style={{ fontSize: '12px', color: textMuted, textAlign: 'right' }}>
                            {log.timestamp}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ 
                      padding: '12px 24px', borderTop: `1px solid ${border}`,
                      fontSize: '12px', color: textMuted, display: 'flex', justifyContent: 'space-between'
                    }}>
                      <span>Showing last {crmActivityLog.length} events</span>
                      <button style={{
                        background: 'none', border: 'none', color: '#0891B2',
                        cursor: 'pointer', fontSize: '12px'
                      }}>
                        View full history →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Proposal Templates */}
              {activeSettingsTab === 'proposals' && (
                <div style={{ background: cardBg, borderRadius: '12px', border: `1px solid ${border}` }}>
                  <div style={{ padding: '20px 24px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600' }}>Proposal Templates</span>
                    <button style={{ padding: '8px 16px', background: '#0891B2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Create</button>
                  </div>
                  {['Enterprise Template (12 variables)', 'Standard Template (8 variables)', 'Startup Template (6 variables)'].map((t, i) => (
                    <div key={i} style={{ padding: '16px 24px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t}</span>
                      <div>
                        <button style={{ padding: '4px 8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>✏️</button>
                        <button style={{ padding: '4px 8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* TRANSLATE MODAL */}
      {showTranslateModal && selectedChapter && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowTranslateModal(false)}>
          <div style={{
            background: cardBg, borderRadius: '16px', width: isMobile ? '95%' : '550px',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ 
              padding: '20px 24px', borderBottom: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>🌐 Global Translation</h2>
                <p style={{ fontSize: '14px', color: textMuted }}>Localize your content for international audiences</p>
              </div>
              <button 
                onClick={() => setShowTranslateModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textMuted }}
              >×</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* Current Language */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: textMuted, marginBottom: '10px', textTransform: 'uppercase' }}>
                  Current Language
                </h3>
                <div style={{
                  padding: '14px 16px', borderRadius: '10px',
                  background: darkMode ? '#334155' : '#F1F5F9',
                  display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                  <span style={{ fontSize: '28px' }}>{languages.find(l => l.code === contentLanguage)?.flag}</span>
                  <span style={{ fontWeight: '600', fontSize: '15px' }}>
                    {languages.find(l => l.code === contentLanguage)?.name} (Original)
                  </span>
                </div>
              </div>

              {/* Target Languages */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: textMuted, marginBottom: '10px', textTransform: 'uppercase' }}>
                  Target Languages
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {translationLanguages.filter(l => l.code !== contentLanguage).map(lang => {
                    const isSelected = targetLanguages.includes(lang.code);
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setTargetLanguages(prev => 
                            isSelected ? prev.filter(c => c !== lang.code) : [...prev, lang.code]
                          );
                        }}
                        style={{
                          padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                          background: isSelected ? '#0891B220' : 'transparent',
                          border: `2px solid ${isSelected ? '#0891B2' : border}`,
                          display: 'flex', alignItems: 'center', gap: '10px',
                          color: textPrimary, textAlign: 'left'
                        }}
                      >
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '4px',
                          border: `2px solid ${isSelected ? '#0891B2' : border}`,
                          background: isSelected ? '#0891B2' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: '12px'
                        }}>
                          {isSelected && '✓'}
                        </div>
                        <span style={{ fontSize: '20px' }}>{lang.flag}</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{lang.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tone Adaptation */}
              <div style={{ marginBottom: '24px' }}>
                <button
                  onClick={() => setAdaptCulturalNuances(!adaptCulturalNuances)}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                    background: adaptCulturalNuances ? '#10B98120' : 'transparent',
                    border: `2px solid ${adaptCulturalNuances ? '#10B981' : border}`,
                    display: 'flex', alignItems: 'center', gap: '12px',
                    color: textPrimary, textAlign: 'left'
                  }}
                >
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '6px',
                    border: `2px solid ${adaptCulturalNuances ? '#10B981' : border}`,
                    background: adaptCulturalNuances ? '#10B981' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '14px'
                  }}>
                    {adaptCulturalNuances && '✓'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>🎭 Adapt Cultural Nuances</div>
                    <div style={{ fontSize: '12px', color: textMuted }}>
                      Localize idioms, references, and tone (vs. literal translation)
                    </div>
                  </div>
                </button>
              </div>

              {/* Cost Estimate */}
              {targetLanguages.length > 0 && (
                <div style={{
                  padding: '14px 16px', borderRadius: '10px', marginBottom: '20px',
                  background: darkMode ? '#0F172A' : '#FEF3C7',
                  border: '1px solid #F59E0B'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#D97706' }}>
                        💰 Estimated Usage
                      </div>
                      <div style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>
                        {targetLanguages.length} language{targetLanguages.length > 1 ? 's' : ''} × ~{selectedChapter.chapter.words || 2000} words
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#D97706' }}>
                        ~{(targetLanguages.reduce((acc, code) => 
                          acc + (translationLanguages.find(l => l.code === code)?.tokens || 1000), 0
                        ) * (selectedChapter.chapter.words || 2000) / 1000).toFixed(0)}K
                      </div>
                      <div style={{ fontSize: '11px', color: textMuted }}>tokens</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div style={{ 
                padding: '12px 14px', borderRadius: '10px',
                background: darkMode ? '#0F172A' : '#F0FDF4', border: '1px solid #10B981'
              }}>
                <div style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span>💡</span>
                  <span>Translations will process in the background. You can continue working while they generate.</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ 
              padding: '16px 24px', borderTop: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <button
                onClick={() => setShowTranslateModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowTranslateModal(false);
                  setTranslationProcessing(true);
                  // Initialize progress for each language
                  const initialProgress = {};
                  targetLanguages.forEach(code => { initialProgress[code] = 0; });
                  setTranslationProgress(initialProgress);
                  
                  // Simulate progress updates
                  targetLanguages.forEach((code, index) => {
                    setTimeout(() => {
                      setTranslationProgress(prev => ({ ...prev, [code]: 50 }));
                    }, 1000 + index * 500);
                    setTimeout(() => {
                      setTranslationProgress(prev => ({ ...prev, [code]: 100 }));
                    }, 2500 + index * 500);
                  });
                  
                  // Complete after all done
                  setTimeout(() => {
                    setTranslationProcessing(false);
                    alert(`Translation complete! ${targetLanguages.length} language version(s) created.`);
                  }, 2500 + targetLanguages.length * 500);
                }}
                disabled={targetLanguages.length === 0}
                style={{
                  padding: '10px 24px', borderRadius: '8px', cursor: targetLanguages.length === 0 ? 'not-allowed' : 'pointer',
                  background: targetLanguages.length > 0 ? 'linear-gradient(135deg, #0891B2, #5EEAD4)' : (darkMode ? '#334155' : '#E2E8F0'),
                  color: targetLanguages.length > 0 ? 'white' : textMuted,
                  border: 'none', fontWeight: '600',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                🚀 Start Translation Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Translation Processing Toast */}
      {translationProcessing && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1001,
          background: cardBg, borderRadius: '12px', padding: '16px 20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', border: `1px solid ${border}`,
          minWidth: '300px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ fontSize: '20px', animation: 'spin 1s linear infinite' }}>🌐</div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>Processing Translations...</div>
              <div style={{ fontSize: '12px', color: textMuted }}>You can continue working</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {targetLanguages.map(code => {
              const lang = translationLanguages.find(l => l.code === code);
              const progress = translationProgress[code] || 0;
              return (
                <div key={code} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>{lang?.flag}</span>
                  <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: darkMode ? '#334155' : '#E2E8F0' }}>
                    <div style={{
                      height: '100%', borderRadius: '3px',
                      background: progress === 100 ? '#10B981' : 'linear-gradient(90deg, #0891B2, #5EEAD4)',
                      width: `${progress}%`, transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '12px', color: progress === 100 ? '#10B981' : textMuted, minWidth: '24px' }}>
                    {progress === 100 ? '✓' : `${progress}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PUBLISH MODAL */}
      {showPublishModal && selectedChapter && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowPublishModal(false)}>
          <div style={{
            background: cardBg, borderRadius: '16px', width: isMobile ? '95%' : '600px', maxHeight: '90vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ 
              padding: '20px 24px', borderBottom: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>Publish Content</h2>
                <p style={{ fontSize: '14px', color: textMuted }}>{selectedChapter.chapter.title}</p>
              </div>
              <button 
                onClick={() => setShowPublishModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textMuted }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted }}>Select Social Networks</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={selectAllNetworks}
                    style={{
                      padding: '6px 12px', fontSize: '12px', borderRadius: '6px', cursor: 'pointer',
                      background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                    }}
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAllNetworks}
                    style={{
                      padding: '6px 12px', fontSize: '12px', borderRadius: '6px', cursor: 'pointer',
                      background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                    }}
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {socialNetworks.map(network => {
                  const isSelected = selectedNetworks.includes(network.id);
                  return (
                    <div
                      key={network.id}
                      onClick={() => toggleNetworkSelection(network.id)}
                      style={{
                        padding: '16px 20px', borderRadius: '12px', cursor: 'pointer',
                        border: `2px solid ${isSelected ? network.color : border}`,
                        background: isSelected ? `${network.color}15` : 'transparent',
                        display: 'flex', alignItems: 'center', gap: '16px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '12px',
                        background: network.color, color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px'
                      }}>
                        {network.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', marginBottom: '2px' }}>{network.name}</div>
                        <div style={{ fontSize: '12px', color: textMuted }}>{network.description}</div>
                      </div>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        border: `2px solid ${isSelected ? network.color : border}`,
                        background: isSelected ? network.color : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '14px'
                      }}>
                        {isSelected && '✓'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedNetworks.length > 0 && (
                <div style={{ 
                  marginTop: '20px', padding: '16px', borderRadius: '10px',
                  background: darkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${border}`
                }}>
                  <div style={{ fontSize: '13px', color: textMuted, marginBottom: '8px' }}>
                    Publishing to {selectedNetworks.length} network{selectedNetworks.length > 1 ? 's' : ''}:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedNetworks.map(id => {
                      const network = socialNetworks.find(n => n.id === id);
                      return (
                        <span key={id} style={{
                          padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                          background: `${network.color}20`, color: network.color
                        }}>
                          {network.icon} {network.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Schedule Section */}
              <div style={{ 
                marginTop: '20px', padding: '20px', borderRadius: '10px',
                background: darkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '20px' }}>📅</span>
                  <div>
                    <div style={{ fontWeight: '600' }}>Schedule Post</div>
                    <div style={{ fontSize: '12px', color: textMuted }}>Set a future date and time for publishing</div>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px' }}>Date</label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: '8px',
                        border: `1px solid ${border}`, background: cardBg,
                        color: textPrimary, fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px' }}>Time</label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: '8px',
                        border: `1px solid ${border}`, background: cardBg,
                        color: textPrimary, fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {scheduleDate && scheduleTime && (
                  <div style={{ 
                    marginTop: '12px', padding: '10px 14px', borderRadius: '6px',
                    background: '#0891B215', border: '1px solid #0891B2',
                    fontSize: '13px', color: '#0891B2'
                  }}>
                    ⏰ Scheduled for: {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString('en-US', { 
                      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                      hour: 'numeric', minute: '2-digit'
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ 
              padding: '16px 24px', borderTop: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <button
                onClick={() => setShowPublishModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                }}
              >
                Cancel
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                {scheduleDate && scheduleTime && (
                  <button
                    onClick={() => { 
                      setShowPublishModal(false); 
                      alert(`Scheduled for ${scheduleDate} at ${scheduleTime}`); 
                    }}
                    disabled={selectedNetworks.length === 0}
                    style={{
                      padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                      background: selectedNetworks.length > 0 ? '#8B5CF6' : (darkMode ? '#334155' : '#E2E8F0'),
                      color: selectedNetworks.length > 0 ? 'white' : textMuted,
                      border: 'none', fontWeight: '600'
                    }}
                  >
                    📅 Schedule
                  </button>
                )}
                <button
                  onClick={handlePublish}
                  disabled={selectedNetworks.length === 0 || publishing}
                  style={{
                    padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                    background: selectedNetworks.length > 0 ? '#0A66C2' : (darkMode ? '#334155' : '#E2E8F0'),
                    color: selectedNetworks.length > 0 ? 'white' : textMuted,
                    border: 'none', fontWeight: '600',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    opacity: publishing ? 0.7 : 1
                  }}
                >
                  {publishing ? (
                    <>⏳ Publishing...</>
                  ) : (
                    <>📤 Publish Now</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STYLE MODAL */}
      {showStyleModal && selectedChapter && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowStyleModal(false)}>
          <div style={{
            background: cardBg, borderRadius: '16px', width: isMobile ? '95%' : '600px', maxHeight: '90vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ 
              padding: '20px 24px', borderBottom: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>Apply Style or Template</h2>
                <p style={{ fontSize: '14px', color: textMuted }}>{selectedChapter.chapter.title}</p>
              </div>
              <button 
                onClick={() => setShowStyleModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textMuted }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>
                🎨 Writing Styles
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                {writingStyles.map(style => (
                  <button
                    key={style.id}
                    style={{
                      padding: '16px', borderRadius: '10px', cursor: 'pointer',
                      background: darkMode ? '#334155' : '#F8FAFC',
                      border: `1px solid ${border}`, textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{style.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: textPrimary }}>{style.name}</div>
                  </button>
                ))}
              </div>

              <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>
                📄 Document Templates
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {documentTemplates.map(template => (
                  <button
                    key={template.id}
                    style={{
                      padding: '16px', borderRadius: '10px', cursor: 'pointer',
                      background: darkMode ? '#334155' : '#F8FAFC',
                      border: `1px solid ${border}`, textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{template.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: textPrimary }}>{template.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ 
              padding: '16px 24px', borderTop: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <button
                onClick={() => setShowStyleModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowStyleModal(false); alert('Style applied!'); }}
                style={{
                  padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                  color: 'white', border: 'none', fontWeight: '600'
                }}
              >
                ✓ Apply Style
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERATE MODAL */}
      {showGenerateModal && selectedChapter && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowGenerateModal(false)}>
          <div style={{
            background: cardBg, borderRadius: '16px', width: isMobile ? '95%' : '600px', maxHeight: '90vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ 
              padding: '20px 24px', borderBottom: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>Generate Content</h2>
                <p style={{ fontSize: '14px', color: textMuted }}>{selectedChapter.chapter.title}</p>
              </div>
              <button 
                onClick={() => setShowGenerateModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textMuted }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              {/* Language indicator */}
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px',
                padding: '10px 14px', borderRadius: '8px', background: darkMode ? '#0F172A' : '#F8FAFC',
                border: `1px solid ${border}`
              }}>
                <span>🌐</span>
                <span style={{ fontSize: '14px', color: textMuted }}>Content will be generated in:</span>
                <span style={{ fontWeight: '600' }}>{languages.find(l => l.code === contentLanguage)?.flag} {languages.find(l => l.code === contentLanguage)?.name}</span>
              </div>

              <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '16px' }}>
                Select Content Types (multiple allowed)
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {generateTypes.map(type => {
                  const isSelected = selectedGenerateTypes.includes(type.id);
                  return (
                    <div
                      key={type.id}
                      onClick={() => toggleGenerateType(type.id)}
                      style={{
                        padding: '20px', borderRadius: '12px', cursor: 'pointer',
                        border: `2px solid ${isSelected ? type.color : border}`,
                        background: isSelected ? `${type.color}15` : 'transparent',
                        display: 'flex', alignItems: 'center', gap: '16px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '12px',
                        background: `${type.color}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '28px'
                      }}>
                        {type.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{type.name}</div>
                        <div style={{ fontSize: '13px', color: textMuted, marginBottom: '6px' }}>{type.description}</div>
                        <div style={{ 
                          fontSize: '12px', fontWeight: '600', color: type.color,
                          display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
                          background: `${type.color}15`
                        }}>
                          {type.wordCount}
                        </div>
                      </div>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '6px',
                        border: `2px solid ${isSelected ? type.color : border}`,
                        background: isSelected ? type.color : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '14px'
                      }}>
                        {isSelected && '✓'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedGenerateTypes.length > 0 && (
                <div style={{ 
                  marginTop: '20px', padding: '16px', borderRadius: '10px',
                  background: darkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${border}`
                }}>
                  <div style={{ fontSize: '13px', color: textMuted, marginBottom: '8px' }}>
                    Selected {selectedGenerateTypes.length} format{selectedGenerateTypes.length > 1 ? 's' : ''}:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedGenerateTypes.map(id => {
                      const type = generateTypes.find(t => t.id === id);
                      return (
                        <span key={id} style={{
                          padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                          background: `${type.color}20`, color: type.color
                        }}>
                          {type.icon} {type.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ 
              padding: '16px 24px', borderTop: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <button
                onClick={() => setShowGenerateModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={selectedGenerateTypes.length === 0}
                style={{
                  padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                  background: selectedGenerateTypes.length > 0 ? 'linear-gradient(135deg, #5EEAD4, #0891B2)' : (darkMode ? '#334155' : '#E2E8F0'),
                  color: selectedGenerateTypes.length > 0 ? 'white' : textMuted,
                  border: 'none', fontWeight: '600',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                ✨ Generate {selectedGenerateTypes.length > 0 ? `${selectedGenerateTypes.length} Format${selectedGenerateTypes.length > 1 ? 's' : ''}` : 'Content'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT MODAL */}
      {showExportModal && generatedContent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => { if (!exportGenerating) setShowExportModal(false); }}>
          <div style={{
            background: cardBg, borderRadius: '16px', width: isMobile ? '95%' : '600px', maxHeight: '90vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ 
              padding: '20px 24px', borderBottom: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>📦 Export Content</h2>
                <p style={{ fontSize: '14px', color: textMuted }}>{generatedContent.chapter.title}</p>
              </div>
              <button 
                onClick={() => { if (!exportGenerating) setShowExportModal(false); }}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textMuted }}
              >×</button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              {!exportGenerating ? (
                <>
                  {/* Format Tabs */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '600', color: textMuted, marginBottom: '12px', textTransform: 'uppercase' }}>
                      Export Format
                    </h3>
                    <div style={{ display: 'flex', borderRadius: '10px', overflow: 'hidden', border: `1px solid ${border}` }}>
                      {[
                        { id: 'pdf', label: 'PDF', icon: '📄' },
                        { id: 'html', label: 'HTML', icon: '🌐' },
                        { id: 'docx', label: 'DOCX', icon: '📝' },
                        { id: 'markdown', label: 'Markdown', icon: '📋' },
                      ].map((format, i) => (
                        <button
                          key={format.id}
                          onClick={() => setExportFormat(format.id)}
                          style={{
                            flex: 1, padding: '14px 16px', cursor: 'pointer',
                            background: exportFormat === format.id 
                              ? 'linear-gradient(135deg, #0891B2, #5EEAD4)' 
                              : 'transparent',
                            color: exportFormat === format.id ? 'white' : textPrimary,
                            border: 'none',
                            borderRight: i < 3 ? `1px solid ${border}` : 'none',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                          }}
                        >
                          <span style={{ fontSize: '20px' }}>{format.icon}</span>
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>{format.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Format-Specific Settings */}
                  {exportFormat === 'pdf' && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: '600', color: textMuted, marginBottom: '12px', textTransform: 'uppercase' }}>
                        PDF Settings
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Include Cover Page */}
                        <button
                          onClick={() => setExportIncludeCover(!exportIncludeCover)}
                          style={{
                            padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                            background: 'transparent', border: `1px solid ${border}`,
                            display: 'flex', alignItems: 'center', gap: '12px', color: textPrimary
                          }}
                        >
                          <div style={{
                            width: '22px', height: '22px', borderRadius: '6px',
                            border: `2px solid ${exportIncludeCover ? '#0891B2' : border}`,
                            background: exportIncludeCover ? '#0891B2' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '12px'
                          }}>
                            {exportIncludeCover && '✓'}
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '500', fontSize: '14px' }}>Include Cover Page</div>
                            <div style={{ fontSize: '12px', color: textMuted }}>Add a professional title page</div>
                          </div>
                        </button>

                        {/* Include Table of Contents */}
                        <button
                          onClick={() => setExportIncludeTOC(!exportIncludeTOC)}
                          style={{
                            padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                            background: 'transparent', border: `1px solid ${border}`,
                            display: 'flex', alignItems: 'center', gap: '12px', color: textPrimary
                          }}
                        >
                          <div style={{
                            width: '22px', height: '22px', borderRadius: '6px',
                            border: `2px solid ${exportIncludeTOC ? '#0891B2' : border}`,
                            background: exportIncludeTOC ? '#0891B2' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '12px'
                          }}>
                            {exportIncludeTOC && '✓'}
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '500', fontSize: '14px' }}>Include Table of Contents</div>
                            <div style={{ fontSize: '12px', color: textMuted }}>Auto-generate TOC from headings</div>
                          </div>
                        </button>

                        {/* Page Size */}
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Page Size</div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            {[
                              { id: 'letter', label: 'Letter', desc: '8.5" × 11"' },
                              { id: 'a4', label: 'A4', desc: '210 × 297mm' },
                            ].map(size => (
                              <button
                                key={size.id}
                                onClick={() => setExportPageSize(size.id)}
                                style={{
                                  flex: 1, padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                                  border: `2px solid ${exportPageSize === size.id ? '#0891B2' : border}`,
                                  background: exportPageSize === size.id ? '#0891B220' : 'transparent',
                                  color: textPrimary, textAlign: 'center'
                                }}
                              >
                                <div style={{ fontWeight: '600', fontSize: '14px' }}>{size.label}</div>
                                <div style={{ fontSize: '11px', color: textMuted }}>{size.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {exportFormat === 'docx' && (
                    <div style={{
                      padding: '14px 16px', borderRadius: '10px', marginBottom: '24px',
                      background: darkMode ? '#0F172A' : '#FEF3C7', border: '1px solid #F59E0B'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span>⚠️</span>
                        <div style={{ fontSize: '13px', color: textMuted }}>
                          <strong style={{ color: '#D97706' }}>Word Export Note:</strong> Complex CSS styling will be simplified for Word compatibility. Tables and basic formatting will be preserved.
                        </div>
                      </div>
                    </div>
                  )}

                  {exportFormat === 'html' && (
                    <div style={{
                      padding: '14px 16px', borderRadius: '10px', marginBottom: '24px',
                      background: darkMode ? '#0F172A' : '#F0FDF4', border: '1px solid #10B981'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span>💡</span>
                        <div style={{ fontSize: '13px', color: '#10B981' }}>
                          HTML export includes embedded CSS for consistent styling across browsers. Perfect for web publishing or email newsletters.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* White-labeling (Premium) */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '600', color: textMuted, marginBottom: '12px', textTransform: 'uppercase' }}>
                      White-labeling
                    </h3>
                    <button
                      onClick={() => setExportRemoveWatermark(!exportRemoveWatermark)}
                      style={{
                        width: '100%', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                        background: exportRemoveWatermark ? '#8B5CF620' : 'transparent',
                        border: `2px solid ${exportRemoveWatermark ? '#8B5CF6' : border}`,
                        display: 'flex', alignItems: 'center', gap: '12px', color: textPrimary
                      }}
                    >
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '6px',
                        border: `2px solid ${exportRemoveWatermark ? '#8B5CF6' : border}`,
                        background: exportRemoveWatermark ? '#8B5CF6' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '12px'
                      }}>
                        {exportRemoveWatermark && '✓'}
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>Remove "Generated by AI" Watermark</div>
                        <div style={{ fontSize: '12px', color: textMuted }}>Present content as your own work</div>
                      </div>
                      <span style={{
                        padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700',
                        background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white'
                      }}>
                        PREMIUM
                      </span>
                    </button>
                  </div>

                  {/* Export Summary */}
                  <div style={{
                    padding: '16px', borderRadius: '10px',
                    background: darkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${border}`
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>Export Summary</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '12px', background: darkMode ? '#334155' : '#E2E8F0' }}>
                        📄 {exportFormat.toUpperCase()}
                      </span>
                      {exportFormat === 'pdf' && exportIncludeCover && (
                        <span style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '12px', background: darkMode ? '#334155' : '#E2E8F0' }}>
                          📖 Cover Page
                        </span>
                      )}
                      {exportFormat === 'pdf' && exportIncludeTOC && (
                        <span style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '12px', background: darkMode ? '#334155' : '#E2E8F0' }}>
                          📑 Table of Contents
                        </span>
                      )}
                      {exportFormat === 'pdf' && (
                        <span style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '12px', background: darkMode ? '#334155' : '#E2E8F0' }}>
                          📐 {exportPageSize === 'letter' ? 'Letter' : 'A4'}
                        </span>
                      )}
                      {exportRemoveWatermark && (
                        <span style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '12px', background: '#8B5CF620', color: '#8B5CF6' }}>
                          ✨ White-labeled
                        </span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* Export Progress */
                <div style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', 
                  justifyContent: 'center', height: '250px', gap: '24px'
                }}>
                  <div style={{ fontSize: '48px' }}>📦</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                      Preparing {exportFormat.toUpperCase()} Export...
                    </div>
                    <div style={{ fontSize: '14px', color: textMuted }}>
                      Compiling and formatting your content
                    </div>
                  </div>
                  <div style={{
                    width: '200px', height: '6px', borderRadius: '3px',
                    background: darkMode ? '#334155' : '#E2E8F0', overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '3px',
                      background: 'linear-gradient(90deg, #0891B2, #5EEAD4)',
                      animation: 'loading 1.5s ease-in-out infinite'
                    }} />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!exportGenerating && (
              <div style={{ 
                padding: '16px 24px', borderTop: `1px solid ${border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <button
                  onClick={() => { setShowExportModal(false); setGeneratedContent(null); }}
                  style={{
                    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                    background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setExportGenerating(true);
                    setTimeout(() => {
                      setExportGenerating(false);
                      setShowExportModal(false);
                      setGeneratedContent(null);
                      alert(`${exportFormat.toUpperCase()} export downloaded successfully!`);
                    }, 2500);
                  }}
                  style={{
                    padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                    color: 'white', border: 'none', fontWeight: '600',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  📥 Download Pack
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INFOGRAPHIC MODAL */}
      {showInfographicModal && selectedChapter && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => { if (!infographicGenerating) setShowInfographicModal(false); }}>
          <div style={{
            background: cardBg, borderRadius: '16px', width: isMobile ? '95%' : '750px', maxHeight: '90vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ 
              padding: '20px 24px', borderBottom: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>📊 Create Infographic</h2>
                <p style={{ fontSize: '14px', color: textMuted }}>{selectedChapter.chapter.title}</p>
              </div>
              <button 
                onClick={() => { if (!infographicGenerating) setShowInfographicModal(false); }}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textMuted }}
              >×</button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              {!infographicGenerating ? (
                <>
                  {/* Source Select */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>
                      📄 Source Data
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '10px' }}>
                      {infographicSources.map(source => (
                        <button
                          key={source.id}
                          onClick={() => setInfographicSource(source.id)}
                          style={{
                            padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                            border: `2px solid ${infographicSource === source.id ? '#8B5CF6' : border}`,
                            background: infographicSource === source.id ? '#8B5CF620' : 'transparent',
                            color: textPrimary, textAlign: 'left',
                            display: 'flex', alignItems: 'center', gap: '10px'
                          }}
                        >
                          <span style={{ fontSize: '18px' }}>{source.icon}</span>
                          <span style={{ fontSize: '13px', fontWeight: '500' }}>{source.label}</span>
                        </button>
                      ))}
                    </div>
                    
                    {/* Custom Text Area */}
                    {infographicSource === 'custom' && (
                      <div style={{ marginTop: '12px' }}>
                        <textarea
                          value={infographicCustomText}
                          onChange={(e) => setInfographicCustomText(e.target.value)}
                          placeholder="Enter your custom text for the infographic (max 500 characters)..."
                          maxLength={500}
                          style={{
                            width: '100%', height: '100px', padding: '12px', borderRadius: '10px',
                            border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                            color: textPrimary, fontSize: '14px', resize: 'none'
                          }}
                        />
                        <div style={{ fontSize: '12px', color: textMuted, textAlign: 'right', marginTop: '4px' }}>
                          {infographicCustomText.length}/500 characters
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Style Grid */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>
                      🎨 Visual Style
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '10px' }}>
                      {infographicStyles.map(style => {
                        const isSelected = selectedInfographicStyle === style.id;
                        return (
                          <div
                            key={style.id}
                            onClick={() => setSelectedInfographicStyle(style.id)}
                            style={{
                              padding: '16px', borderRadius: '12px', cursor: 'pointer',
                              border: `2px solid ${isSelected ? '#8B5CF6' : border}`,
                              background: isSelected ? '#8B5CF620' : 'transparent',
                              textAlign: 'center', transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{style.icon}</div>
                            <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>{style.name}</div>
                            <div style={{ fontSize: '11px', color: textMuted }}>{style.description}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Theme */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>
                      🎨 Color Theme
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {colorThemes.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => setInfographicColorTheme(theme.id)}
                          style={{
                            padding: '10px 16px', borderRadius: '10px', cursor: 'pointer',
                            border: `2px solid ${infographicColorTheme === theme.id ? theme.colors[0] : border}`,
                            background: infographicColorTheme === theme.id ? `${theme.colors[0]}20` : 'transparent',
                            display: 'flex', alignItems: 'center', gap: '10px', color: textPrimary
                          }}
                        >
                          <div style={{ display: 'flex', gap: '3px' }}>
                            {theme.colors.map((color, i) => (
                              <div key={i} style={{ width: '14px', height: '14px', borderRadius: '4px', background: color }} />
                            ))}
                          </div>
                          <span style={{ fontSize: '13px' }}>{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview Area */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>
                      👁️ Preview
                    </h3>
                    <div style={{
                      height: '180px', borderRadius: '12px', border: `2px dashed ${border}`,
                      background: darkMode ? '#0F172A' : '#F8FAFC',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {colorThemes.find(t => t.id === infographicColorTheme)?.colors.map((color, i) => (
                          <div key={i} style={{
                            width: i === 0 ? '60px' : '40px', height: '8px', borderRadius: '4px', background: color
                          }} />
                        ))}
                      </div>
                      <div style={{ 
                        width: '200px', height: '60px', borderRadius: '8px',
                        background: `linear-gradient(135deg, ${colorThemes.find(t => t.id === infographicColorTheme)?.colors[0]}, ${colorThemes.find(t => t.id === infographicColorTheme)?.colors[1]})`,
                        opacity: 0.3
                      }} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3].map(i => (
                          <div key={i} style={{
                            width: '50px', height: '50px', borderRadius: '8px',
                            background: colorThemes.find(t => t.id === infographicColorTheme)?.colors[i % 3],
                            opacity: 0.4
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '12px', color: textMuted }}>
                        {selectedInfographicStyle ? infographicStyles.find(s => s.id === selectedInfographicStyle)?.name : 'Select a style'} Layout Preview
                      </span>
                    </div>
                  </div>

                  {/* Validation Warning */}
                  {infographicSource === 'custom' && infographicCustomText.length > 400 && (
                    <div style={{
                      padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
                      background: '#FEF3C7', border: '1px solid #F59E0B',
                      display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                      <span>⚠️</span>
                      <span style={{ fontSize: '13px', color: '#92400E' }}>
                        Long text may result in smaller fonts. Consider summarizing for better readability.
                      </span>
                    </div>
                  )}
                </>
              ) : (
                /* Generation Progress */
                <div style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', 
                  justifyContent: 'center', height: '300px', gap: '24px'
                }}>
                  <div style={{ fontSize: '48px' }}>📊</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                      {infographicProgressStep}
                    </div>
                    <div style={{ fontSize: '14px', color: textMuted }}>Please wait...</div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ width: '100%', maxWidth: '300px' }}>
                    <div style={{ 
                      height: '8px', borderRadius: '4px', 
                      background: darkMode ? '#334155' : '#E2E8F0',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%', borderRadius: '4px',
                        background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)',
                        width: `${infographicProgress}%`,
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <div style={{ 
                      display: 'flex', justifyContent: 'space-between', 
                      marginTop: '12px', fontSize: '12px', color: textMuted 
                    }}>
                      <span style={{ color: infographicProgress >= 33 ? '#8B5CF6' : textMuted }}>✓ Drafting Layout</span>
                      <span style={{ color: infographicProgress >= 66 ? '#8B5CF6' : textMuted }}>✓ Selecting Icons</span>
                      <span style={{ color: infographicProgress >= 100 ? '#8B5CF6' : textMuted }}>✓ Rendering</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!infographicGenerating && (
              <div style={{ 
                padding: '16px 24px', borderTop: `1px solid ${border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <button
                  onClick={() => setShowInfographicModal(false)}
                  style={{
                    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                    background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setInfographicGenerating(true);
                    setInfographicProgress(0);
                    setInfographicProgressStep('Drafting Layout...');
                    setTimeout(() => { setInfographicProgress(33); setInfographicProgressStep('Selecting Icons...'); }, 1000);
                    setTimeout(() => { setInfographicProgress(66); setInfographicProgressStep('Rendering...'); }, 2000);
                    setTimeout(() => { 
                      setInfographicProgress(100); 
                      setInfographicProgressStep('Complete!');
                      setTimeout(() => {
                        setInfographicGenerating(false);
                        setShowInfographicModal(false);
                        alert('Infographic generated and inserted!');
                      }, 500);
                    }, 3000);
                  }}
                  disabled={!selectedInfographicStyle || (infographicSource === 'custom' && !infographicCustomText.trim())}
                  style={{
                    padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                    background: selectedInfographicStyle ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' : (darkMode ? '#334155' : '#E2E8F0'),
                    color: selectedInfographicStyle ? 'white' : textMuted,
                    border: 'none', fontWeight: '600',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  ✨ Generate Visual
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI IMAGE STUDIO */}
      {showImageModal && selectedChapter && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => { if (!imageGenerating) setShowImageModal(false); }}>
          <div style={{
            background: cardBg, borderRadius: '16px', width: isMobile ? '95%' : '800px', maxHeight: '90vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ 
              padding: '20px 24px', borderBottom: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>🎨 AI Image Studio</h2>
                <p style={{ fontSize: '14px', color: textMuted }}>{selectedChapter.chapter.title}</p>
              </div>
              <button 
                onClick={() => { if (!imageGenerating) setShowImageModal(false); }}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textMuted }}
              >×</button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              {!imageGenerating ? (
                <>
                  {/* Prompt Input */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>
                      ✍️ Image Prompt
                    </h3>
                    <textarea
                      value={imagePrompt || `A professional illustration representing "${selectedChapter.chapter.title}" with modern, clean design elements`}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Describe the image you want to generate..."
                      style={{
                        width: '100%', height: '100px', padding: '14px', borderRadius: '10px',
                        border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                        color: textPrimary, fontSize: '14px', resize: 'none', lineHeight: '1.5'
                      }}
                    />
                  </div>

                  {/* Aspect Ratio Selector */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>
                      📐 Aspect Ratio
                    </h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {aspectRatios.map(ratio => (
                        <button
                          key={ratio.id}
                          onClick={() => setImageAspectRatio(ratio.id)}
                          style={{
                            padding: '12px 20px', borderRadius: '10px', cursor: 'pointer',
                            border: `2px solid ${imageAspectRatio === ratio.id ? '#EC4899' : border}`,
                            background: imageAspectRatio === ratio.id ? '#EC489920' : 'transparent',
                            color: textPrimary, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: '6px', minWidth: '80px'
                          }}
                        >
                          <span style={{ fontSize: '20px' }}>{ratio.icon}</span>
                          <span style={{ fontWeight: '600', fontSize: '14px' }}>{ratio.label}</span>
                          <span style={{ fontSize: '11px', color: textMuted }}>{ratio.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Art Style Selector */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>
                      🎨 Art Style
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '10px' }}>
                      {artStyles.map(style => (
                        <button
                          key={style.id}
                          onClick={() => setImageArtStyle(style.id)}
                          style={{
                            padding: '16px', borderRadius: '12px', cursor: 'pointer',
                            border: `2px solid ${imageArtStyle === style.id ? '#EC4899' : border}`,
                            background: imageArtStyle === style.id ? '#EC489920' : 'transparent',
                            color: textPrimary, textAlign: 'center'
                          }}
                        >
                          <div style={{
                            width: '100%', height: '40px', borderRadius: '8px', marginBottom: '10px',
                            background: style.preview
                          }} />
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '16px' }}>{style.icon}</span>
                            <span style={{ fontWeight: '500', fontSize: '13px' }}>{style.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Negative Prompt Toggle */}
                  <div style={{ marginBottom: '24px' }}>
                    <button
                      onClick={() => setShowNegativePrompt(!showNegativePrompt)}
                      style={{
                        padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                        background: darkMode ? '#334155' : '#F1F5F9', border: 'none',
                        color: textPrimary, display: 'flex', alignItems: 'center', gap: '8px',
                        fontSize: '13px'
                      }}
                    >
                      <span>{showNegativePrompt ? '▼' : '▶'}</span>
                      ⚙️ Advanced: Negative Prompt
                    </button>
                    
                    {showNegativePrompt && (
                      <div style={{ marginTop: '12px' }}>
                        <textarea
                          value={negativePrompt}
                          onChange={(e) => setNegativePrompt(e.target.value)}
                          placeholder="What to avoid: text, blurry, distorted hands, watermarks..."
                          style={{
                            width: '100%', height: '60px', padding: '12px', borderRadius: '10px',
                            border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                            color: textPrimary, fontSize: '13px', resize: 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Image History Gallery */}
                  {imageHistory.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>
                        🖼️ Recent Generations
                      </h3>
                      <div style={{ 
                        display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px'
                      }}>
                        {imageHistory.map(img => (
                          <div
                            key={img.id}
                            style={{
                              flexShrink: 0, width: '120px', cursor: 'pointer',
                              borderRadius: '10px', overflow: 'hidden',
                              border: `2px solid ${border}`
                            }}
                          >
                            <div style={{
                              height: '80px',
                              background: `linear-gradient(135deg, ${
                                img.url === 'gradient-1' ? '#0891B2, #5EEAD4' :
                                img.url === 'gradient-2' ? '#8B5CF6, #EC4899' :
                                '#F59E0B, #EF4444'
                              })`
                            }} />
                            <div style={{ padding: '8px' }}>
                              <div style={{ fontSize: '11px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {img.prompt}
                              </div>
                              <div style={{ fontSize: '10px', color: textMuted }}>{img.style}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Generation Progress */
                <div style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', 
                  justifyContent: 'center', height: '300px', gap: '24px'
                }}>
                  <div style={{ 
                    width: '100px', height: '100px', borderRadius: '16px',
                    background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'pulse 2s infinite'
                  }}>
                    <span style={{ fontSize: '40px' }}>🎨</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                      Generating Image...
                    </div>
                    <div style={{ fontSize: '14px', color: textMuted }}>
                      Creating {artStyles.find(s => s.id === imageArtStyle)?.name} artwork
                    </div>
                  </div>
                  <div style={{
                    width: '200px', height: '6px', borderRadius: '3px',
                    background: darkMode ? '#334155' : '#E2E8F0', overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '3px',
                      background: 'linear-gradient(90deg, #EC4899, #8B5CF6)',
                      animation: 'loading 1.5s ease-in-out infinite'
                    }} />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!imageGenerating && (
              <div style={{ 
                padding: '16px 24px', borderTop: `1px solid ${border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <button
                  onClick={() => setShowImageModal(false)}
                  style={{
                    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                    background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setImageGenerating(true);
                    setTimeout(() => {
                      setImageGenerating(false);
                      setImageHistory(prev => [{
                        id: Date.now(),
                        url: `gradient-${(prev.length % 3) + 1}`,
                        prompt: imagePrompt || selectedChapter.chapter.title,
                        style: artStyles.find(s => s.id === imageArtStyle)?.name
                      }, ...prev]);
                      alert('Image generated and inserted!');
                      setShowImageModal(false);
                    }, 3000);
                  }}
                  style={{
                    padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #EC4899, #DB2777)',
                    color: 'white', border: 'none', fontWeight: '600',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  🖼️ Generate Image
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW PROJECT MODAL (with Voice-to-Concept) */}
      {showNewProjectModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowNewProjectModal(false)}>
          <div style={{
            background: cardBg, borderRadius: '16px', width: isMobile ? '95%' : '600px', maxHeight: '90vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            
            <div style={{ 
              padding: '20px 24px', borderBottom: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>✨ New Content Project</h2>
                <p style={{ fontSize: '14px', color: textMuted }}>Create a new book concept or content series</p>
              </div>
              <button 
                onClick={() => setShowNewProjectModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textMuted }}
              >×</button>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              {/* Project Title */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Project Title</label>
                <input
                  type="text"
                  placeholder="e.g., AI Marketing Guide for SMBs"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '8px',
                    border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                    color: textPrimary, fontSize: '14px'
                  }}
                />
              </div>

              {/* Voice-to-Concept Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  🎙️ Voice-to-Concept Input
                </label>
                <p style={{ fontSize: '13px', color: textMuted, marginBottom: '12px' }}>
                  Record a voice memo describing your book concept. AI will transcribe and create the chapter outline.
                </p>
                
                <div style={{ 
                  padding: '24px', borderRadius: '12px', textAlign: 'center',
                  background: darkMode ? '#0F172A' : '#F8FAFC', border: `2px dashed ${border}`
                }}>
                  {!isRecording && !voiceTranscript && (
                    <button
                      onClick={startRecording}
                      style={{
                        padding: '16px 32px', borderRadius: '50px',
                        background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                        color: 'white', border: 'none', cursor: 'pointer',
                        fontSize: '16px', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        margin: '0 auto'
                      }}
                    >
                      🎤 Start Recording
                    </button>
                  )}
                  
                  {isRecording && (
                    <div>
                      <div style={{ 
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: '#EF4444', margin: '0 auto 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'pulse 1.5s infinite'
                      }}>
                        <span style={{ fontSize: '32px' }}>🎙️</span>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#EF4444', marginBottom: '8px' }}>
                        Recording...
                      </div>
                      <div style={{ fontSize: '14px', color: textMuted, marginBottom: '16px' }}>
                        Speak your book concept (up to 60 seconds)
                      </div>
                      <button
                        onClick={stopRecording}
                        style={{
                          padding: '12px 24px', borderRadius: '8px',
                          background: darkMode ? '#334155' : '#E2E8F0',
                          color: textPrimary, border: 'none', cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        ⏹️ Stop Recording
                      </button>
                    </div>
                  )}
                  
                  {voiceTranscript && (
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ color: '#10B981' }}>✓</span>
                        <span style={{ fontWeight: '600' }}>Transcribed Successfully</span>
                        <button
                          onClick={() => setVoiceTranscript('')}
                          style={{
                            marginLeft: 'auto', padding: '4px 10px', borderRadius: '4px',
                            background: 'transparent', border: `1px solid ${border}`,
                            cursor: 'pointer', fontSize: '12px', color: textMuted
                          }}
                        >
                          Re-record
                        </button>
                      </div>
                      <div style={{ 
                        padding: '12px', borderRadius: '8px',
                        background: cardBg, border: `1px solid ${border}`,
                        fontSize: '13px', lineHeight: '1.6'
                      }}>
                        {voiceTranscript}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Or text input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Or type your concept
                </label>
                <textarea
                  placeholder="Describe your content concept, target audience, and key themes..."
                  rows={4}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: '8px',
                    border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                    color: textPrimary, fontSize: '14px', resize: 'vertical'
                  }}
                />
              </div>

              {/* Assign Owner */}
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  👤 Assign Project Owner
                </label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {teamMembers.map(member => (
                    <button
                      key={member.id}
                      style={{
                        padding: '10px 14px', borderRadius: '8px',
                        background: darkMode ? '#334155' : '#F8FAFC',
                        border: `1px solid ${border}`, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{member.avatar}</span>
                      <span style={{ fontSize: '13px', color: textPrimary }}>{member.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ 
              padding: '16px 24px', borderTop: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <button
                onClick={() => setShowNewProjectModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                }}
              >Cancel</button>
              <button
                onClick={() => { setShowNewProjectModal(false); alert('Project created! AI is generating chapter outline...'); }}
                style={{
                  padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                  color: 'white', border: 'none', fontWeight: '600'
                }}
              >
                ✨ Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSET GALLERY MODAL */}
      {showAssetGallery && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowAssetGallery(false)}>
          <div style={{
            background: cardBg, borderRadius: '16px', width: isMobile ? '95%' : '950px', maxHeight: '90vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{ 
              padding: '20px 24px', borderBottom: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>🖼️ Asset Gallery</h2>
                <p style={{ fontSize: '14px', color: textMuted }}>Browse and reuse your creative assets</p>
              </div>
              <button 
                onClick={() => setShowAssetGallery(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textMuted }}
              >×</button>
            </div>

            {/* Search Bar */}
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${border}` }}>
              <div style={{ position: 'relative' }}>
                <span style={{ 
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '16px', color: textMuted
                }}>🔍</span>
                <input
                  type="text"
                  value={assetSearchQuery}
                  onChange={(e) => setAssetSearchQuery(e.target.value)}
                  placeholder="Search assets, proposals, templates..."
                  style={{
                    width: '100%', padding: '12px 16px 12px 44px', borderRadius: '10px',
                    border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                    color: textPrimary, fontSize: '14px', outline: 'none'
                  }}
                />
                {assetSearchQuery && (
                  <button
                    onClick={() => setAssetSearchQuery('')}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: darkMode ? '#334155' : '#E2E8F0', border: 'none',
                      borderRadius: '50%', width: '20px', height: '20px',
                      cursor: 'pointer', fontSize: '12px', color: textMuted,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >×</button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ 
              padding: '0 24px', borderBottom: `1px solid ${border}`, 
              display: 'flex', gap: '0', overflowX: 'auto'
            }}>
              {[
                { id: 'all', label: 'All Assets', icon: '📁', count: assetGallery.length },
                { id: 'images', label: 'Images', icon: '🖼️', count: assetGallery.filter(a => a.type === 'image').length },
                { id: 'infographics', label: 'Infographics', icon: '📊', count: assetGallery.filter(a => a.type === 'infographic').length },
                { id: 'proposals', label: 'Proposals', icon: '📋', count: galleryProposalTemplates.length },
                { id: 'templates', label: 'Templates', icon: '📝', count: galleryDocumentTemplates.length },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAssetGalleryTab(tab.id)}
                  style={{
                    padding: '14px 20px', cursor: 'pointer',
                    background: 'transparent', border: 'none',
                    borderBottom: assetGalleryTab === tab.id ? '3px solid #0891B2' : '3px solid transparent',
                    color: assetGalleryTab === tab.id ? '#0891B2' : textMuted,
                    fontWeight: assetGalleryTab === tab.id ? '600' : '500',
                    fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
                    whiteSpace: 'nowrap', transition: 'all 0.2s'
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: '10px', fontSize: '11px',
                    background: assetGalleryTab === tab.id ? '#0891B220' : (darkMode ? '#334155' : '#E2E8F0'),
                    color: assetGalleryTab === tab.id ? '#0891B2' : textMuted
                  }}>{tab.count}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              
              {/* Images/Infographics/All Tab */}
              {(assetGalleryTab === 'all' || assetGalleryTab === 'images' || assetGalleryTab === 'infographics') && (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '16px' }}>
                  {assetGallery
                    .filter(asset => {
                      if (assetGalleryTab === 'images') return asset.type === 'image';
                      if (assetGalleryTab === 'infographics') return asset.type === 'infographic';
                      return true;
                    })
                    .filter(asset => 
                      assetSearchQuery === '' || 
                      asset.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                      asset.project.toLowerCase().includes(assetSearchQuery.toLowerCase())
                    )
                    .map(asset => (
                      <div
                        key={asset.id}
                        style={{
                          borderRadius: '12px', overflow: 'hidden',
                          border: `1px solid ${border}`, background: darkMode ? '#0F172A' : '#F8FAFC'
                        }}
                      >
                        <div style={{ 
                          height: '140px', 
                          background: asset.type === 'image' 
                            ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' 
                            : 'linear-gradient(135deg, #0891B2, #10B981)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '48px'
                        }}>
                          {asset.thumbnail}
                        </div>
                        <div style={{ padding: '14px' }}>
                          <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{asset.name}</div>
                          <div style={{ fontSize: '12px', color: textMuted, marginBottom: '10px' }}>
                            {asset.project} • {asset.date}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{
                              flex: 1, padding: '8px', borderRadius: '6px',
                              background: darkMode ? '#334155' : '#E2E8F0',
                              border: 'none', cursor: 'pointer', fontSize: '12px', color: textPrimary
                            }}>
                              👁️ Preview
                            </button>
                            <button style={{
                              flex: 1, padding: '8px', borderRadius: '6px',
                              background: '#0891B2', color: 'white',
                              border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500'
                            }}>
                              ➕ Use
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Proposals Tab */}
              {assetGalleryTab === 'proposals' && (
                <div>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '14px', color: textMuted }}>
                      Pre-built proposal templates to speed up your sales process
                    </p>
                    <button style={{
                      padding: '8px 16px', borderRadius: '8px',
                      background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                      color: 'white', border: 'none', cursor: 'pointer',
                      fontSize: '13px', fontWeight: '600'
                    }}>
                      + New Template
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px' }}>
                    {galleryProposalTemplates
                      .filter(template => 
                        assetSearchQuery === '' || 
                        template.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                        template.description.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                        template.category.toLowerCase().includes(assetSearchQuery.toLowerCase())
                      )
                      .map(template => (
                        <div
                          key={template.id}
                          style={{
                            padding: '20px', borderRadius: '12px',
                            border: `1px solid ${border}`, background: darkMode ? '#0F172A' : '#F8FAFC',
                            display: 'flex', gap: '16px', alignItems: 'flex-start'
                          }}
                        >
                          <div style={{
                            width: '56px', height: '56px', borderRadius: '12px',
                            background: `${template.color}20`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '28px', flexShrink: 0
                          }}>
                            {template.thumbnail}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontWeight: '600', fontSize: '15px' }}>{template.name}</span>
                              <span style={{
                                padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600',
                                background: `${template.color}20`, color: template.color
                              }}>{template.category}</span>
                            </div>
                            <p style={{ fontSize: '13px', color: textMuted, marginBottom: '12px' }}>
                              {template.description}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '12px', color: textMuted }}>
                                Used {template.uses} times
                              </span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{
                                  padding: '6px 12px', borderRadius: '6px',
                                  background: darkMode ? '#334155' : '#E2E8F0',
                                  border: 'none', cursor: 'pointer', fontSize: '12px', color: textPrimary
                                }}>
                                  👁️ Preview
                                </button>
                                <button style={{
                                  padding: '6px 12px', borderRadius: '6px',
                                  background: template.color, color: 'white',
                                  border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500'
                                }}>
                                  Use Template
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Templates Tab */}
              {assetGalleryTab === 'templates' && (
                <div>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <p style={{ fontSize: '14px', color: textMuted }}>
                      Content templates for consistent, high-quality output
                    </p>
                    <button style={{
                      padding: '8px 16px', borderRadius: '8px',
                      background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                      color: 'white', border: 'none', cursor: 'pointer',
                      fontSize: '13px', fontWeight: '600'
                    }}>
                      + Create Template
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '14px' }}>
                    {galleryDocumentTemplates
                      .filter(template => 
                        assetSearchQuery === '' || 
                        template.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                        template.description.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                        template.category.toLowerCase().includes(assetSearchQuery.toLowerCase())
                      )
                      .map(template => (
                        <div
                          key={template.id}
                          style={{
                            padding: '16px', borderRadius: '12px',
                            border: `1px solid ${border}`, background: darkMode ? '#0F172A' : '#F8FAFC',
                            display: 'flex', gap: '14px', alignItems: 'center'
                          }}
                        >
                          <div style={{
                            width: '48px', height: '48px', borderRadius: '10px',
                            background: `${template.color}20`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '24px', flexShrink: 0
                          }}>
                            {template.thumbnail}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                              <span style={{ fontWeight: '600', fontSize: '14px' }}>{template.name}</span>
                              <span style={{
                                padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: '600',
                                background: `${template.color}20`, color: template.color
                              }}>{template.category}</span>
                            </div>
                            <p style={{ fontSize: '12px', color: textMuted, marginBottom: '0' }}>
                              {template.description}
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '11px', color: textMuted }}>{template.uses} uses</span>
                            <button style={{
                              padding: '6px 12px', borderRadius: '6px',
                              background: template.color, color: 'white',
                              border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '500'
                            }}>
                              Use
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {((assetGalleryTab === 'all' || assetGalleryTab === 'images' || assetGalleryTab === 'infographics') && 
                assetGallery
                  .filter(asset => {
                    if (assetGalleryTab === 'images') return asset.type === 'image';
                    if (assetGalleryTab === 'infographics') return asset.type === 'infographic';
                    return true;
                  })
                  .filter(asset => 
                    assetSearchQuery === '' || 
                    asset.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                    asset.project.toLowerCase().includes(assetSearchQuery.toLowerCase())
                  ).length === 0
              ) && (
                <div style={{ 
                  textAlign: 'center', padding: '60px 20px',
                  color: textMuted
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No assets found</div>
                  <div style={{ fontSize: '14px' }}>Try adjusting your search or filter</div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ 
              padding: '16px 24px', borderTop: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', color: textMuted }}>
                {assetGalleryTab === 'all' && `${assetGallery.length} assets`}
                {assetGalleryTab === 'images' && `${assetGallery.filter(a => a.type === 'image').length} images`}
                {assetGalleryTab === 'infographics' && `${assetGallery.filter(a => a.type === 'infographic').length} infographics`}
                {assetGalleryTab === 'proposals' && `${galleryProposalTemplates.length} proposal templates`}
                {assetGalleryTab === 'templates' && `${galleryDocumentTemplates.length} document templates`}
                {assetSearchQuery && ` • Filtered by "${assetSearchQuery}"`}
              </span>
              <button
                onClick={() => { setShowAssetGallery(false); setAssetSearchQuery(''); }}
                style={{
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                }}
              >Close</button>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT APPROVAL / SHARE MODAL */}
      {showShareModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowShareModal(null)}>
          <div style={{
            background: cardBg, borderRadius: '16px', width: isMobile ? '95%' : '500px',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            
            <div style={{ 
              padding: '20px 24px', borderBottom: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>🔗 Share for Client Approval</h2>
                <p style={{ fontSize: '14px', color: textMuted }}>{showShareModal.title || 'Generate a review link'}</p>
              </div>
              <button 
                onClick={() => setShowShareModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textMuted }}
              >×</button>
            </div>

            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', color: textMuted, marginBottom: '20px' }}>
                Generate a secure, read-only link for clients to review and approve content before publishing.
              </p>

              {/* Link Preview */}
              <div style={{ 
                padding: '14px 16px', borderRadius: '10px',
                background: darkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${border}`,
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '12px', color: textMuted, marginBottom: '6px' }}>Review Link</div>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  <code style={{ 
                    flex: 1, padding: '10px 12px', borderRadius: '6px',
                    background: cardBg, border: `1px solid ${border}`,
                    fontSize: '13px', color: '#0891B2', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    https://nd-wizard.app/review/abc123xyz
                  </code>
                  <button
                    onClick={() => alert('Link copied to clipboard!')}
                    style={{
                      padding: '10px 14px', borderRadius: '6px',
                      background: '#0891B2', color: 'white',
                      border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px'
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '8px',
                  background: darkMode ? '#334155' : '#F8FAFC', cursor: 'pointer'
                }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                  <div>
                    <div style={{ fontWeight: '500' }}>Allow Comments</div>
                    <div style={{ fontSize: '12px', color: textMuted }}>Clients can leave feedback</div>
                  </div>
                </label>
                
                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '8px',
                  background: darkMode ? '#334155' : '#F8FAFC', cursor: 'pointer'
                }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                  <div>
                    <div style={{ fontWeight: '500' }}>Require Approval</div>
                    <div style={{ fontSize: '12px', color: textMuted }}>Show approve/reject buttons</div>
                  </div>
                </label>
                
                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '8px',
                  background: darkMode ? '#334155' : '#F8FAFC', cursor: 'pointer'
                }}>
                  <input type="checkbox" style={{ width: '18px', height: '18px' }} />
                  <div>
                    <div style={{ fontWeight: '500' }}>Password Protect</div>
                    <div style={{ fontSize: '12px', color: textMuted }}>Require password to view</div>
                  </div>
                </label>

                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '8px',
                  background: darkMode ? '#334155' : '#F8FAFC'
                }}>
                  <span style={{ fontSize: '18px' }}>⏰</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500' }}>Link Expires</div>
                    <div style={{ fontSize: '12px', color: textMuted }}>Set expiration date</div>
                  </div>
                  <select style={{
                    padding: '6px 10px', borderRadius: '6px',
                    border: `1px solid ${border}`, background: cardBg,
                    color: textPrimary, fontSize: '13px'
                  }}>
                    <option>7 days</option>
                    <option>14 days</option>
                    <option>30 days</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>

              <div style={{ 
                marginTop: '20px', padding: '12px', borderRadius: '8px',
                background: '#10B98115', border: '1px solid #10B981'
              }}>
                <div style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🔒 Link is read-only. Clients cannot edit content but can leave comments and approve.
                </div>
              </div>
            </div>

            <div style={{ 
              padding: '16px 24px', borderTop: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <button
                onClick={() => setShowShareModal(null)}
                style={{
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                }}
              >Cancel</button>
              <button
                onClick={() => { setShowShareModal(null); alert('Share link sent to client!'); }}
                style={{
                  padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                  color: 'white', border: 'none', fontWeight: '600'
                }}
              >
                ✉️ Send to Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PROPOSAL MODAL */}
      {showProposalModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => { setShowProposalModal(false); setProposalStep(1); }}>
          <div style={{
            background: cardBg, borderRadius: '16px', width: isMobile ? '95%' : '900px', maxHeight: '90vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ 
              padding: '20px 24px', borderBottom: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>Create New Proposal</h2>
                <p style={{ fontSize: '14px', color: textMuted }}>Step {proposalStep} of 4</p>
              </div>
              <button 
                onClick={() => { setShowProposalModal(false); setProposalStep(1); }}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: textMuted }}
              >
                ×
              </button>
            </div>

            {/* Progress Bar */}
            <div style={{ padding: '0 24px', marginTop: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4].map(step => (
                  <div key={step} style={{ 
                    flex: 1, height: '4px', borderRadius: '2px',
                    background: step <= proposalStep ? '#0891B2' : (darkMode ? '#334155' : '#E2E8F0')
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: textMuted }}>
                <span>Template</span>
                <span>Customer</span>
                <span>Items & Pricing</span>
                <span>Generate</span>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              
              {/* Step 1: Select Template */}
              {proposalStep === 1 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Select a Proposal Template</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {proposalTemplates.map(template => (
                      <div
                        key={template.id}
                        onClick={() => setProposalData({ ...proposalData, template: template.id })}
                        style={{
                          padding: '20px', borderRadius: '12px', cursor: 'pointer',
                          border: `2px solid ${proposalData.template === template.id ? '#0891B2' : border}`,
                          background: proposalData.template === template.id ? (darkMode ? '#0891B220' : '#0891B210') : 'transparent',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>{template.icon}</div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{template.name}</div>
                        <div style={{ fontSize: '13px', color: textMuted }}>{template.description}</div>
                        {proposalData.template === template.id && (
                          <div style={{ marginTop: '12px', color: '#0891B2', fontSize: '13px', fontWeight: '600' }}>✓ Selected</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Select Customer */}
              {proposalStep === 2 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Select or Add Customer</h3>
                  
                  {/* Toggle */}
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <button
                      onClick={() => setProposalData({ ...proposalData, isNewCustomer: false })}
                      style={{
                        padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
                        background: !proposalData.isNewCustomer ? '#0891B2' : 'transparent',
                        color: !proposalData.isNewCustomer ? 'white' : textPrimary,
                        border: `1px solid ${!proposalData.isNewCustomer ? '#0891B2' : border}`
                      }}
                    >
                      Existing Customer
                    </button>
                    <button
                      onClick={() => setProposalData({ ...proposalData, isNewCustomer: true, customer: '' })}
                      style={{
                        padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
                        background: proposalData.isNewCustomer ? '#0891B2' : 'transparent',
                        color: proposalData.isNewCustomer ? 'white' : textPrimary,
                        border: `1px solid ${proposalData.isNewCustomer ? '#0891B2' : border}`
                      }}
                    >
                      + New Customer
                    </button>
                  </div>

                  {!proposalData.isNewCustomer ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {existingCustomers.map(customer => (
                        <div
                          key={customer.id}
                          onClick={() => setProposalData({ ...proposalData, customer: customer.id })}
                          style={{
                            padding: '16px 20px', borderRadius: '10px', cursor: 'pointer',
                            border: `2px solid ${proposalData.customer === customer.id ? '#0891B2' : border}`,
                            background: proposalData.customer === customer.id ? (darkMode ? '#0891B220' : '#0891B210') : 'transparent',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '600', marginBottom: '2px' }}>{customer.company}</div>
                            <div style={{ fontSize: '13px', color: textMuted }}>{customer.email}</div>
                          </div>
                          {proposalData.customer === customer.id && (
                            <span style={{ color: '#0891B2', fontWeight: '600' }}>✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Company Name *</label>
                        <input
                          type="text"
                          value={proposalData.newCustomerCompany}
                          onChange={e => setProposalData({ ...proposalData, newCustomerCompany: e.target.value })}
                          placeholder="Enter company name"
                          style={{
                            width: '100%', padding: '12px 14px', borderRadius: '8px',
                            border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                            color: textPrimary, fontSize: '14px'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Contact Name *</label>
                        <input
                          type="text"
                          value={proposalData.newCustomerName}
                          onChange={e => setProposalData({ ...proposalData, newCustomerName: e.target.value })}
                          placeholder="Enter contact name"
                          style={{
                            width: '100%', padding: '12px 14px', borderRadius: '8px',
                            border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                            color: textPrimary, fontSize: '14px'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
                        <input
                          type="email"
                          value={proposalData.newCustomerEmail}
                          onChange={e => setProposalData({ ...proposalData, newCustomerEmail: e.target.value })}
                          placeholder="Enter email address"
                          style={{
                            width: '100%', padding: '12px 14px', borderRadius: '8px',
                            border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                            color: textPrimary, fontSize: '14px'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Items & Pricing */}
              {proposalStep === 3 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Select Services & Set Pricing</h3>
                  
                  {/* Service Bundles */}
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>📦 Quick-Start Bundles</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {serviceBundles.map(bundle => {
                        const bundleTotal = bundle.items.reduce((sum, itemId) => {
                          const item = availableItems.find(i => i.id === itemId);
                          return sum + (item?.basePrice || 0);
                        }, 0);
                        const discountedTotal = bundleTotal * (1 - bundle.discount / 100);
                        
                        return (
                          <div
                            key={bundle.id}
                            style={{
                              padding: '14px 16px', borderRadius: '10px',
                              background: darkMode ? '#334155' : '#F8FAFC',
                              border: `1px solid ${border}`,
                              display: 'flex', alignItems: 'center', gap: '12px'
                            }}
                          >
                            <span style={{ fontSize: '28px' }}>{bundle.icon}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '600', fontSize: '14px' }}>{bundle.name}</div>
                              <div style={{ fontSize: '11px', color: textMuted }}>{bundle.description}</div>
                              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                                <span style={{ textDecoration: 'line-through', color: textMuted }}>${bundleTotal.toLocaleString()}</span>
                                <span style={{ color: '#10B981', fontWeight: '600', marginLeft: '8px' }}>${discountedTotal.toLocaleString()}</span>
                                <span style={{ background: '#10B98120', color: '#10B981', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', marginLeft: '6px' }}>-{bundle.discount}%</span>
                              </div>
                            </div>
                            <button
                              onClick={() => applyBundle(bundle)}
                              style={{
                                padding: '6px 12px', background: '#0891B2', color: 'white',
                                border: 'none', borderRadius: '6px', cursor: 'pointer',
                                fontSize: '12px', fontWeight: '600'
                              }}
                            >
                              + Add
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
                    {/* Available Items */}
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>Available Services</h4>
                      <div style={{ 
                        maxHeight: '400px', overflowY: 'auto', 
                        border: `1px solid ${border}`, borderRadius: '10px'
                      }}>
                        {availableItems.map(item => {
                          const isAdded = proposalData.items.find(i => i.id === item.id);
                          return (
                            <div
                              key={item.id}
                              onClick={() => !isAdded && addItemToProposal(item)}
                              style={{
                                padding: '12px 16px', borderBottom: `1px solid ${border}`,
                                cursor: isAdded ? 'default' : 'pointer',
                                opacity: isAdded ? 0.5 : 1,
                                background: isAdded ? (darkMode ? '#334155' : '#F1F5F9') : 'transparent'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.name}</div>
                                  <div style={{ fontSize: '12px', color: textMuted }}>{item.category}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontWeight: '600', color: '#0891B2' }}>${item.basePrice.toLocaleString()}</div>
                                  {isAdded && <div style={{ fontSize: '11px', color: '#10B981' }}>✓ Added</div>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selected Items with Pricing */}
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: textMuted, marginBottom: '12px' }}>
                        Selected Items ({proposalData.items.length})
                      </h4>
                      
                      {proposalData.items.length === 0 ? (
                        <div style={{ 
                          padding: '40px', textAlign: 'center', color: textMuted,
                          border: `2px dashed ${border}`, borderRadius: '10px'
                        }}>
                          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
                          <div>Click on services to add them</div>
                        </div>
                      ) : (
                        <div style={{ border: `1px solid ${border}`, borderRadius: '10px', overflow: 'hidden' }}>
                          {/* Header */}
                          <div style={{ 
                            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                            padding: '10px 12px', background: darkMode ? '#0F172A' : '#F8FAFC',
                            fontSize: '12px', fontWeight: '600', color: textMuted, gap: '8px'
                          }}>
                            <span>Service</span>
                            <span>Qty</span>
                            <span>Unit Price</span>
                            <span>Discount %</span>
                            <span>Total</span>
                            <span></span>
                          </div>
                          
                          {/* Items */}
                          {proposalData.items.map(item => (
                            <div key={item.id} style={{ 
                              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                              padding: '12px', borderTop: `1px solid ${border}`, alignItems: 'center', gap: '8px'
                            }}>
                              <div style={{ fontSize: '13px', fontWeight: '500' }}>{item.name}</div>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={e => updateItemField(item.id, 'quantity', e.target.value)}
                                style={{
                                  width: '100%', padding: '8px', borderRadius: '6px',
                                  border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                                  color: textPrimary, fontSize: '13px'
                                }}
                              />
                              <input
                                type="number"
                                min="0"
                                value={item.unitPrice}
                                onChange={e => updateItemField(item.id, 'unitPrice', e.target.value)}
                                style={{
                                  width: '100%', padding: '8px', borderRadius: '6px',
                                  border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                                  color: textPrimary, fontSize: '13px'
                                }}
                              />
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.discount}
                                onChange={e => updateItemField(item.id, 'discount', e.target.value)}
                                style={{
                                  width: '100%', padding: '8px', borderRadius: '6px',
                                  border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                                  color: textPrimary, fontSize: '13px'
                                }}
                              />
                              <div style={{ fontWeight: '600', color: '#10B981' }}>
                                ${calculateItemTotal(item).toLocaleString()}
                              </div>
                              <button
                                onClick={() => removeItemFromProposal(item.id)}
                                style={{ 
                                  background: 'transparent', border: 'none', 
                                  cursor: 'pointer', color: '#EF4444', fontSize: '18px'
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          
                          {/* Total */}
                          <div style={{ 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '16px', borderTop: `2px solid ${border}`,
                            background: darkMode ? '#0F172A' : '#F8FAFC'
                          }}>
                            <span style={{ fontWeight: '600' }}>Grand Total</span>
                            <span style={{ fontSize: '20px', fontWeight: '700', color: '#0891B2' }}>
                              ${calculateGrandTotal().toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Business Process & Generate */}
              {proposalStep === 4 && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Describe Customer's Business Process</h3>
                  <p style={{ color: textMuted, marginBottom: '16px', fontSize: '14px' }}>
                    Provide details about the customer's current challenges, goals, and business processes. 
                    Our AI will use this to generate a personalized proposal that addresses their specific needs.
                  </p>
                  
                  <textarea
                    value={proposalData.businessProcess}
                    onChange={e => setProposalData({ ...proposalData, businessProcess: e.target.value })}
                    placeholder="Example: The customer is a mid-sized e-commerce company struggling with brand awareness and customer acquisition. They currently rely on organic social media but want to expand into paid advertising and content marketing. Their main goal is to increase website traffic by 50% and improve conversion rates. They have a small marketing team of 3 people and need help with strategy and execution..."
                    style={{
                      width: '100%', minHeight: '150px', padding: '16px', borderRadius: '10px',
                      border: `1px solid ${border}`, background: darkMode ? '#0F172A' : 'white',
                      color: textPrimary, fontSize: '14px', lineHeight: '1.6', resize: 'vertical'
                    }}
                  />
                  <div style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginTop: '8px', fontSize: '13px', color: textMuted 
                  }}>
                    <span>{proposalData.businessProcess.length} characters (minimum 50 required)</span>
                    {proposalData.businessProcess.length >= 50 && (
                      <span style={{ color: '#10B981' }}>✓ Ready to generate</span>
                    )}
                  </div>

                  {/* Proposal Preview with Dynamic Variables */}
                  <div style={{ 
                    marginTop: '24px', padding: '20px', borderRadius: '10px',
                    background: darkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${border}`
                  }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      📄 Proposal Preview
                      <span style={{ fontSize: '11px', fontWeight: '400', color: textMuted }}>(Dynamic variables highlighted)</span>
                    </h4>
                    
                    <div style={{ 
                      padding: '16px', borderRadius: '8px', fontSize: '13px', lineHeight: '1.8',
                      background: cardBg, border: `1px solid ${border}`
                    }}>
                      <p style={{ marginBottom: '12px' }}>
                        Dear <span style={{ background: '#0891B230', color: '#0891B2', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>{'{{customer_name}}'}</span>,
                      </p>
                      <p style={{ marginBottom: '12px' }}>
                        Thank you for considering <span style={{ background: '#8B5CF630', color: '#8B5CF6', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>{'{{company_name}}'}</span> for your marketing needs. Based on our discussions, we are pleased to present this proposal for <span style={{ background: '#0891B230', color: '#0891B2', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>{'{{project_name}}'}</span>.
                      </p>
                      <p style={{ marginBottom: '12px' }}>
                        <strong>Total Investment:</strong> <span style={{ background: '#10B98130', color: '#10B981', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>{'{{total_amount}}'}</span>
                      </p>
                      <p style={{ marginBottom: '12px' }}>
                        <strong>Services Included:</strong> <span style={{ background: '#F59E0B30', color: '#F59E0B', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>{'{{services_list}}'}</span>
                      </p>
                      <p>
                        This proposal is valid until <span style={{ background: '#EC489930', color: '#EC4899', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>{'{{expiry_date}}'}</span>.
                      </p>
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: textMuted }}>Variables used:</span>
                      {['customer_name', 'company_name', 'project_name', 'total_amount', 'services_list', 'expiry_date'].map(v => (
                        <span key={v} style={{ 
                          padding: '2px 8px', borderRadius: '4px', fontSize: '10px',
                          background: darkMode ? '#334155' : '#E2E8F0', color: textMuted
                        }}>
                          {`{{${v}}}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{ 
                    marginTop: '20px', padding: '20px', borderRadius: '10px',
                    background: darkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${border}`
                  }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Proposal Summary</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '14px' }}>
                      <div>
                        <span style={{ color: textMuted }}>Template:</span>
                        <span style={{ marginLeft: '8px', fontWeight: '500' }}>
                          {proposalTemplates.find(t => t.id === proposalData.template)?.name || '-'}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: textMuted }}>Customer:</span>
                        <span style={{ marginLeft: '8px', fontWeight: '500' }}>
                          {proposalData.isNewCustomer 
                            ? proposalData.newCustomerCompany 
                            : existingCustomers.find(c => c.id === proposalData.customer)?.company || '-'}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: textMuted }}>Items:</span>
                        <span style={{ marginLeft: '8px', fontWeight: '500' }}>{proposalData.items.length} services</span>
                      </div>
                      <div>
                        <span style={{ color: textMuted }}>Total Value:</span>
                        <span style={{ marginLeft: '8px', fontWeight: '700', color: '#0891B2' }}>
                          ${calculateGrandTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* E-Signature Option */}
                  <div style={{ 
                    marginTop: '20px', padding: '16px 20px', borderRadius: '10px',
                    background: darkMode ? '#4F46E520' : '#4F46E510', border: '1px solid #4F46E5',
                    display: 'flex', alignItems: 'center', gap: '16px'
                  }}>
                    <input 
                      type="checkbox" 
                      id="sendForSignature"
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="sendForSignature" style={{ flex: 1, cursor: 'pointer' }}>
                      <div style={{ fontWeight: '600', marginBottom: '2px' }}>✍️ Send for E-Signature after generation</div>
                      <div style={{ fontSize: '12px', color: textMuted }}>
                        Automatically send the proposal to the customer via DocuSign for electronic signature
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ 
              padding: '16px 24px', borderTop: `1px solid ${border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <button
                onClick={() => proposalStep > 1 ? setProposalStep(proposalStep - 1) : setShowProposalModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                  background: 'transparent', border: `1px solid ${border}`, color: textPrimary
                }}
              >
                {proposalStep > 1 ? '← Back' : 'Cancel'}
              </button>
              
              {proposalStep < 4 ? (
                <button
                  onClick={() => setProposalStep(proposalStep + 1)}
                  disabled={
                    (proposalStep === 1 && !canProceedStep1) ||
                    (proposalStep === 2 && !canProceedStep2) ||
                    (proposalStep === 3 && !canProceedStep3)
                  }
                  style={{
                    padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #0891B2, #5EEAD4)',
                    color: 'white', border: 'none', fontWeight: '600',
                    opacity: (proposalStep === 1 && !canProceedStep1) ||
                             (proposalStep === 2 && !canProceedStep2) ||
                             (proposalStep === 3 && !canProceedStep3) ? 0.5 : 1
                  }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleGenerateProposal}
                  disabled={!canGenerate || generating}
                  style={{
                    padding: '10px 24px', borderRadius: '8px', cursor: 'pointer',
                    background: canGenerate ? 'linear-gradient(135deg, #10B981, #5EEAD4)' : (darkMode ? '#334155' : '#E2E8F0'),
                    color: canGenerate ? 'white' : textMuted,
                    border: 'none', fontWeight: '600',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  {generating ? (
                    <>
                      <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                      Generating...
                    </>
                  ) : (
                    <>✨ Generate Proposal</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
