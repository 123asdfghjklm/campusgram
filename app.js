import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Heart, Send, MoreHorizontal, 
  User, Play, Pause, Home, Calendar, Users, Settings, PlusSquare, 
  Image as ImageIcon, Music, Type, Sun, Moon, MessageCircle, 
  Share2, ArrowLeft, Hash, LogOut, Bell, Lock, Edit3, UserPlus, UserCheck, Ban, Trash2
} from 'lucide-react';

// --- Mock Data & Initial State ---

const CURRENT_USER = {
  id: 'me',
  username: 'student_life',
  avatar: 'https://i.pravatar.cc/150?u=me',
  name: 'Student User',
  bio: 'Just surviving high school one coffee at a time. ☕️',
  followers: 450,
  following: 380
};

const MOCK_USERS = {
  'alex_adventures': { id: 'u1', username: 'alex_adventures', name: 'Alex T', avatar: 'https://i.pravatar.cc/150?u=alex', bio: 'Travel & Photography 📸', followers: 1200, following: 500 },
  'foodie_jess': { id: 'u2', username: 'foodie_jess', name: 'Jessica M', avatar: 'https://i.pravatar.cc/150?u=jess', bio: 'Food lover! 🍕', followers: 890, following: 600 },
  'school_spirit': { id: 'u3', username: 'school_spirit', name: 'Tiger Mascot', avatar: 'https://i.pravatar.cc/150?u=school', bio: 'Go Tigers! 🐅', followers: 5000, following: 10 },
  'art_club': { id: 'u4', username: 'art_club', name: 'Art Club Official', avatar: 'https://i.pravatar.cc/150?u=art', bio: 'Creativity unleashed.', followers: 300, following: 0 },
  'jake_skates': { id: 'u5', username: 'jake_skates', name: 'Jake', avatar: 'https://i.pravatar.cc/150?u=jake', bio: 'Skate or die.', followers: 400, following: 400 },
  'sarah_m': { id: 'u6', username: 'sarah_m', name: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?u=sarah', bio: 'Band geek 🎷', followers: 200, following: 200 },
};

const INITIAL_STORIES = [
  { id: 1, username: 'alex_adventures', avatar: 'https://i.pravatar.cc/150?u=alex', items: [{ id: 's1-1', type: 'image', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1', duration: 5000, caption: 'Mountain vibes 🏔️' }] },
  { id: 2, username: 'foodie_jess', avatar: 'https://i.pravatar.cc/150?u=jess', items: [{ id: 's2-1', type: 'image', url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543', duration: 4000, caption: 'Morning fuel 🥑' }] },
];

const INITIAL_POSTS = [
  {
    id: 1,
    username: 'school_spirit',
    avatar: 'https://i.pravatar.cc/150?u=school',
    image: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=800&q=80',
    caption: 'Homecoming game was wild! 🏈🐅 #GoTigers',
    likes: 124,
    timestamp: '2h',
    isLiked: false,
    comments: [
        { id: 1, user: 'jake_skates', text: 'Best game of the year!' },
        { id: 2, user: 'sarah_m', text: 'Does anyone have pics of the band?' }
    ]
  },
  {
    id: 2,
    username: 'art_club',
    avatar: 'https://i.pravatar.cc/150?u=art',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80',
    caption: 'Great turnout at the gallery showcase tonight! 🎨',
    likes: 89,
    timestamp: '4h',
    isLiked: false,
    comments: []
  }
];

const INITIAL_CLUBS = [
  { 
      id: 1, name: 'Robotics Club', memberCount: 45, image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789', isJoined: false,
      threads: [
          { id: 't1', title: 'General Chat', messages: [{id: 1, user: 'alex_adventures', text: 'Meeting at 3PM tomorrow?', time: '2h ago'}] },
          { id: 't2', title: 'Competition Prep', messages: [{id: 1, user: 'tech_guru', text: 'We need more servos.', time: '5h ago'}] }
      ]
  },
  { 
      id: 2, name: 'Debate Team', memberCount: 28, image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b955', isJoined: true,
      threads: [
          { id: 't3', title: 'Topic Brainstorming', messages: [{id: 1, user: 'debater_1', text: 'Resolved: That this house believes...', time: '1d ago'}] }
      ]
  },
];

const INITIAL_EVENTS = [
  { id: 1, title: 'Science Fair', date: 'Oct 15', time: '3:00 PM', location: 'Gymnasium', isGoing: false },
  { id: 2, title: 'Fall Dance', date: 'Oct 22', time: '7:00 PM', location: 'Cafeteria', isGoing: true },
];

// --- Utility Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-4 py-2 rounded-xl font-medium transition-all duration-200 active:scale-95 flex items-center justify-center";
    const variants = {
        primary: "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 dark:shadow-none dark:bg-blue-500",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200",
        outline: "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800",
        ghost: "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
        danger: "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
    };
    return <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Avatar = ({ src, alt, size = "md", className = "" }) => {
    const sizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-16 h-16", xl: "w-24 h-24" };
    return <img src={src} alt={alt} className={`${sizes[size]} rounded-full object-cover border border-gray-100 dark:border-gray-700 ${className}`} />;
};

// --- Story Components (Restored) ---

const ProgressBar = ({ duration, isActive, isCompleted, onFinish, isPaused }) => {
  const [progress, setProgress] = useState(isCompleted ? 100 : 0);
  const requestRef = useRef();
  const startTimeRef = useRef();
  const pausedTimeRef = useRef();

  useEffect(() => {
    if (!isActive) { setProgress(isCompleted ? 100 : 0); return; }
    if (isCompleted) { setProgress(100); return; }
    setProgress(0);
    startTimeRef.current = Date.now();
    pausedTimeRef.current = null;
    const animate = () => {
      if (pausedTimeRef.current) return;
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const percentage = Math.min((elapsed / duration) * 100, 100);
      setProgress(percentage);
      if (percentage < 100) requestRef.current = requestAnimationFrame(animate);
      else onFinish();
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isActive, isCompleted, duration, onFinish]);

  useEffect(() => {
    if (!isActive || isCompleted) return;
    if (isPaused) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      pausedTimeRef.current = Date.now();
    } else {
      if (pausedTimeRef.current) {
        const pauseDuration = Date.now() - pausedTimeRef.current;
        startTimeRef.current += pauseDuration;
        pausedTimeRef.current = null;
        const animate = () => {
            if (pausedTimeRef.current) return;
            const now = Date.now();
            const elapsed = now - startTimeRef.current;
            const percentage = Math.min((elapsed / duration) * 100, 100);
            setProgress(percentage);
            if (percentage < 100) requestRef.current = requestAnimationFrame(animate);
            else onFinish();
        };
        requestRef.current = requestAnimationFrame(animate);
      }
    }
  }, [isPaused, isActive, isCompleted, duration, onFinish]);

  return (
    <div className="h-1 bg-white/30 rounded-full flex-1 mx-0.5 overflow-hidden">
      <div className="h-full bg-white transition-all duration-75 ease-linear" style={{ width: `${progress}%` }} />
    </div>
  );
};

const StoryViewer = ({ story, onClose, onNextStory, onPrevStory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const currentItem = story.items[currentIndex];

  useEffect(() => { setCurrentIndex(0); setIsPaused(false); }, [story.id]);

  const handleNext = useCallback(() => {
    if (currentIndex < story.items.length - 1) setCurrentIndex(prev => prev + 1);
    else onNextStory();
  }, [currentIndex, story.items.length, onNextStory]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    else onPrevStory();
  }, [currentIndex, onPrevStory]);

  if (!currentItem) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full h-full md:w-[400px] md:h-[90vh] md:rounded-3xl overflow-hidden bg-gray-900 shadow-2xl flex flex-col">
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex mb-3">
            {story.items.map((item, idx) => (
              <ProgressBar key={item.id} duration={item.duration} isActive={idx === currentIndex} isCompleted={idx < currentIndex} onFinish={handleNext} isPaused={isPaused} />
            ))}
          </div>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <Avatar src={story.avatar} size="sm" className="border-white/20" />
              <span className="font-semibold text-sm drop-shadow-md">{story.username}</span>
            </div>
            <button onClick={onClose}><X className="w-6 h-6 drop-shadow-md text-white" /></button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative cursor-pointer"
            onMouseDown={() => setIsPaused(true)} onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)} onTouchEnd={() => setIsPaused(false)}
            onMouseLeave={() => setIsPaused(false)}
        >
          {currentItem.type === 'image' ? (
            <img src={currentItem.url} alt="Story" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center p-8 text-center ${currentItem.background}`}>
              <p className="text-white text-2xl font-bold">{currentItem.content}</p>
            </div>
          )}
          
          {/* Navigation Tap Zones */}
          <div className="absolute inset-0 flex z-10">
            <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
            <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); /* Pause Zone */ }} />
            <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); handleNext(); }} />
          </div>
        </div>

        {/* Footer Overlay */}
         <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-8 bg-gradient-to-t from-black/80 to-transparent">
            {currentItem.caption && (
                <p className="text-white text-center mb-4 text-sm font-medium drop-shadow-md">{currentItem.caption}</p>
            )}
            <div className="flex items-center space-x-3">
                <input type="text" placeholder="Send message..." className="flex-1 bg-transparent border border-white/50 rounded-full px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:border-white text-sm backdrop-blur-sm" onFocus={() => setIsPaused(true)} onBlur={() => setIsPaused(false)} />
                <button className="p-2 text-white"><Heart /></button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Modals (Restored & Fixed) ---

const CreateModal = ({ onClose, onSubmit }) => {
  const [type, setType] = useState('post');
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in slide-in-from-bottom">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-white">Create New</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
            <button onClick={() => setType('post')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'post' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>Post</button>
            <button onClick={() => setType('story')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${type === 'story' ? 'bg-white dark:bg-gray-700 shadow-sm text-pink-600 dark:text-pink-400' : 'text-gray-500'}`}>Story</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
            <input 
              value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {type === 'post' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Caption</label>
              <textarea 
                value={caption} onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              />
            </div>
          )}
          <Button onClick={() => onSubmit({ type, url, caption })} className="w-full py-3">
            {type === 'post' ? 'Share Post' : 'Add to Story'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const CommentsModal = ({ post, onClose, onAddComment }) => {
    const [text, setText] = useState('');
    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
             <div className="bg-white dark:bg-gray-900 h-[70vh] md:h-[600px] rounded-t-3xl md:rounded-3xl w-full max-w-sm flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg dark:text-white">Comments</h3>
                    <button onClick={onClose}><X className="w-6 h-6 text-gray-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map(c => (
                            <div key={c.id} className="flex space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                                <div>
                                    <p className="text-sm dark:text-gray-200"><span className="font-bold mr-2 dark:text-white">{c.user}</span>{c.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-400 mt-10">No comments yet.</div>
                    )}
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 pb-safe">
                    <form onSubmit={(e) => { e.preventDefault(); onAddComment(post.id, text); setText(''); }} className="flex space-x-2">
                        <input value={text} onChange={e => setText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button disabled={!text.trim()} className="text-blue-600 font-bold text-sm disabled:opacity-50 px-2">Post</button>
                    </form>
                </div>
             </div>
        </div>
    );
};

const EditProfileModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: user.name, username: user.username, bio: user.bio, avatar: user.avatar });
    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold dark:text-white">Edit Profile</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                <div className="space-y-4">
                    <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label><input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label><textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none" /></div>
                    <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Avatar URL</label><input value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <Button onClick={() => onSave(formData)} className="w-full">Save Changes</Button>
                </div>
            </div>
        </div>
    );
};

const ThreadView = ({ club, thread, onClose, onSendMessage }) => {
    const [text, setText] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [thread.messages]);

    return (
        <div className="absolute inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col animate-in slide-in-from-right">
             <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center space-x-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0">
                <button onClick={onClose}><ChevronLeft className="w-6 h-6 dark:text-white" /></button>
                <div>
                    <h3 className="font-bold dark:text-white">#{thread.title}</h3>
                    <p className="text-xs text-gray-500">{club.name}</p>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {thread.messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.user === CURRENT_USER.username ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.user === CURRENT_USER.username ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                            <p className="text-sm font-bold text-xs opacity-70 mb-1">{msg.user}</p>
                            <p>{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1">{msg.time}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 pb-safe bg-white dark:bg-gray-900">
                <form onSubmit={(e) => { e.preventDefault(); if(text.trim()) { onSendMessage(thread.id, text); setText(''); } }} className="flex space-x-2">
                    <input value={text} onChange={e => setText(e.target.value)} placeholder="Message..." className="flex-1 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button disabled={!text.trim()} className="p-2 bg-blue-600 rounded-full text-white disabled:opacity-50"><Send size={18} /></button>
                </form>
            </div>
        </div>
    );
};

// --- Main Views ---

const SettingsView = ({ darkMode, setDarkMode, fontSize, setFontSize, blockedUsers, onUnblock, onBack }) => (
  <div className="pb-24 animate-in slide-in-from-right duration-300 bg-gray-50 dark:bg-black min-h-screen">
     <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 flex items-center space-x-4">
        <button onClick={onBack}><ArrowLeft className="w-6 h-6 dark:text-white" /></button>
        <h2 className="text-xl font-bold dark:text-white">Settings</h2>
    </div>
    <div className="p-4 space-y-6">
      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider ml-1">Appearance</h3>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-800 cursor-pointer" onClick={() => setDarkMode(!darkMode)}>
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
               {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
               <span className="font-medium">Dark Mode</span>
            </div>
            <div className={`w-12 h-7 rounded-full relative transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${darkMode ? 'left-6' : 'left-1'}`} />
            </div>
          </div>
          <div className="p-4 flex flex-col space-y-3">
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
               <Type className="w-5 h-5" />
               <span className="font-medium">Font Size</span>
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {['sm', 'md', 'lg'].map(size => (
                    <button key={size} onClick={() => setFontSize(size)} className={`flex-1 py-1 rounded-md text-xs font-bold uppercase transition-all ${fontSize === size ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-400'}`}>
                        {size}
                    </button>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider ml-1">Privacy</h3>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
           <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-800">
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200">
               <Bell className="w-5 h-5" />
               <span className="font-medium">Notifications</span>
            </div>
             <div className="w-11 h-6 bg-blue-500 rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" /></div>
          </div>
          <div className="p-4">
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 mb-4">
                <Ban className="w-5 h-5 text-red-500" />
                <span className="font-medium">Blocked Accounts</span>
            </div>
            {blockedUsers.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No blocked users.</p>
            ) : (
                <div className="space-y-3">
                    {blockedUsers.map(id => {
                        const user = Object.values(MOCK_USERS).find(u => u.id === id);
                        return (
                            <div key={id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                                <span className="text-sm font-medium dark:text-white">@{user ? user.username : 'Unknown'}</span>
                                <button onClick={() => onUnblock(id)} className="text-xs text-red-500 font-bold px-2">Unblock</button>
                            </div>
                        );
                    })}
                </div>
            )}
          </div>
        </div>
      </section>
    </div>
  </div>
);

const ClubDetailView = ({ club, onBack, onJoin, onOpenThread }) => (
    <div className="pb-24 animate-in slide-in-from-right duration-300 bg-white dark:bg-black min-h-screen">
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-4 flex items-center space-x-4">
            <button onClick={onBack}><ArrowLeft className="w-6 h-6 dark:text-white" /></button>
            <h2 className="text-xl font-bold dark:text-white">{club.name}</h2>
        </div>
        <div className="relative h-48 w-full">
            <img src={club.image} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <div className="text-white">
                    <p className="font-medium opacity-90">{club.memberCount} Members</p>
                </div>
            </div>
        </div>
        <div className="p-4">
             <Button 
                variant={club.isJoined ? "outline" : "primary"} 
                className="w-full mb-6"
                onClick={() => onJoin(club.id)}
            >
                {club.isJoined ? 'Leave Club' : 'Join to Access Threads'}
            </Button>

            <h3 className="font-bold text-lg mb-4 flex items-center dark:text-white"><Hash className="w-5 h-5 mr-2" /> Threads</h3>
            {club.threads.map(thread => (
                <button 
                    key={thread.id} 
                    onClick={() => club.isJoined && onOpenThread(thread)}
                    disabled={!club.isJoined}
                    className={`w-full text-left p-4 rounded-2xl mb-3 border border-gray-100 dark:border-gray-800 transition-all ${
                        club.isJoined 
                            ? 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800' 
                            : 'bg-gray-50/50 dark:bg-gray-900/30 opacity-60 cursor-not-allowed'
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <div className="font-bold text-gray-900 dark:text-white mb-1">#{thread.title}</div>
                        {!club.isJoined && <Lock size={16} className="text-gray-400" />}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                        {thread.messages[thread.messages.length-1]?.text || 'No messages'}
                    </div>
                </button>
            ))}
        </div>
    </div>
);

const ProfileView = ({ user, posts, isCurrentUser, onBack, onEdit, onFollow, isFollowing, onBlock, onMessage }) => (
  <div className="pb-24 animate-in slide-in-from-right bg-white dark:bg-black min-h-screen">
    {!isCurrentUser && (
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 border-b border-gray-100 dark:border-gray-800">
            <button onClick={onBack}><ArrowLeft className="w-6 h-6 dark:text-white" /></button>
        </div>
    )}
    <div className="p-6">
      <div className="flex flex-col items-center">
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 p-[3px] mb-4 shadow-xl shadow-blue-100 dark:shadow-none">
          <Avatar src={user.avatar} alt="Profile" size="xl" className="w-full h-full p-1 bg-white dark:bg-black" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white">{user.name}</h2>
        <p className="text-gray-500 text-sm mb-2">@{user.username}</p>
        <p className="text-gray-700 dark:text-gray-300 text-center mb-6 max-w-xs">{user.bio}</p>
        
        <div className="flex space-x-8 mb-8 text-center bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div><div className="font-bold text-xl text-gray-900 dark:text-white">{posts.length}</div><div className="text-xs text-gray-400 uppercase tracking-wide">Posts</div></div>
          <div><div className="font-bold text-xl text-gray-900 dark:text-white">{user.followers}</div><div className="text-xs text-gray-400 uppercase tracking-wide">Followers</div></div>
          <div><div className="font-bold text-xl text-gray-900 dark:text-white">{user.following}</div><div className="text-xs text-gray-400 uppercase tracking-wide">Following</div></div>
        </div>
        
        {isCurrentUser ? (
            <Button variant="secondary" className="w-full" onClick={onEdit}><Edit3 size={18} className="mr-2" /> Edit Profile</Button>
        ) : (
            <div className="flex w-full space-x-3">
                <Button 
                    variant={isFollowing ? "outline" : "primary"} 
                    className="flex-1" 
                    onClick={onFollow}
                >
                    {isFollowing ? <><UserCheck size={18} className="mr-2"/> Following</> : <><UserPlus size={18} className="mr-2"/> Follow</>}
                </Button>
                <Button variant="secondary" onClick={onMessage}><MessageCircle size={20} /></Button>
                <Button variant="danger" onClick={onBlock}><Ban size={20} /></Button>
            </div>
        )}
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-0.5 mt-0.5">
      {posts.map(post => (
        <div key={post.id} className="aspect-square bg-gray-100 dark:bg-gray-800 relative group overflow-hidden">
           <img src={post.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        </div>
      ))}
      {[1,2,3].map(i => (
         <div key={i} className="aspect-square bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-200 dark:text-gray-700">
            <ImageIcon size={24} />
         </div>
      ))}
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  // State
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('md');
  const [subView, setSubView] = useState(null); // 'settings', 'messages', 'club', 'profile-other'
  
  // Data
  const [currentUser, setCurrentUser] = useState(CURRENT_USER);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [stories, setStories] = useState(INITIAL_STORIES);
  const [clubs, setClubs] = useState(INITIAL_CLUBS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [following, setFollowing] = useState(['alex_adventures', 'foodie_jess']);
  const [viewedStories, setViewedStories] = useState(new Set()); // Track viewed story IDs
  
  // Selections
  const [selectedClub, setSelectedClub] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [commentPost, setCommentPost] = useState(null);

  // Styles
  const fontSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };

  // Handlers
  const handleLike = (id) => setPosts(posts.map(p => p.id === id ? {...p, likes: p.isLiked ? p.likes-1 : p.likes+1, isLiked: !p.isLiked} : p));
  const handleJoinClub = (id) => {
      const updatedClubs = clubs.map(c => c.id === id ? {...c, isJoined: !c.isJoined} : c);
      setClubs(updatedClubs);
      if(selectedClub && selectedClub.id === id) setSelectedClub(updatedClubs.find(c => c.id === id));
  };
  const handleBlock = (userId) => {
      setBlockedUsers([...blockedUsers, userId]);
      setPosts(posts.filter(p => p.username !== MOCK_USERS[userId]?.username));
      setSubView(null);
  };
  const handleThreadMessage = (threadId, text) => {
      const updatedClubs = clubs.map(c => {
          if (c.id === selectedClub.id) {
              return {
                  ...c,
                  threads: c.threads.map(t => 
                      t.id === threadId 
                      ? { ...t, messages: [...t.messages, { id: Date.now(), user: currentUser.username, text, time: 'Just now' }] }
                      : t
                  )
              };
          }
          return c;
      });
      setClubs(updatedClubs);
      setSelectedClub(updatedClubs.find(c => c.id === selectedClub.id));
      setActiveThread(updatedClubs.find(c => c.id === selectedClub.id).threads.find(t => t.id === threadId));
  };

  const handleAddComment = (postId, text) => {
      const newComment = { id: Date.now(), user: currentUser.username, text };
      setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p));
      setCommentPost(prev => ({ ...prev, comments: [...(prev.comments || []), newComment] }));
  };

  const handleViewUser = (username) => {
      if (username === currentUser.username) {
          setActiveTab('profile');
          setSubView(null);
      } else {
          const user = Object.values(MOCK_USERS).find(u => u.username === username);
          if (user && !blockedUsers.includes(user.id)) {
              setViewingUser(user);
              setSubView('profile-other');
          }
      }
  };

  const handleCreate = ({ type, url, caption }) => {
      if (type === 'post') {
          setPosts([{ id: Date.now(), username: currentUser.username, avatar: currentUser.avatar, image: url, caption, likes: 0, timestamp: 'Just now', isLiked: false, comments: [] }, ...posts]);
      } else {
          setStories(prev => {
              // Simple mock: check if "me" story exists, else create
              const myStoryIndex = prev.findIndex(s => s.username === currentUser.username);
              if (myStoryIndex > -1) {
                  const updated = [...prev];
                  updated[myStoryIndex].items.push({ id: Date.now(), type: 'image', url, duration: 5000, caption });
                  return updated;
              } else {
                  return [{ id: 'me', username: currentUser.username, avatar: currentUser.avatar, items: [{ id: Date.now(), type: 'image', url, duration: 5000, caption }] }, ...prev];
              }
          });
      }
      setShowCreateModal(false);
  };

  const handleStoryClick = (index) => {
    setActiveStoryIndex(index);
    // Mark story as viewed when opened
    setViewedStories(prev => new Set(prev).add(stories[index].id));
  };

  const renderContent = () => {
      if (activeThread) return <ThreadView club={selectedClub} thread={activeThread} onClose={() => setActiveThread(null)} onSendMessage={handleThreadMessage} />;
      if (subView === 'settings') return <SettingsView darkMode={darkMode} setDarkMode={setDarkMode} fontSize={fontSize} setFontSize={setFontSize} blockedUsers={blockedUsers} onUnblock={(id) => setBlockedUsers(blockedUsers.filter(b => b !== id))} onBack={() => setSubView(null)} />;
      if (subView === 'profile-other') return <ProfileView user={viewingUser} posts={posts.filter(p => p.username === viewingUser.username)} isCurrentUser={false} onBack={() => setSubView(null)} isFollowing={following.includes(viewingUser.username)} onFollow={() => following.includes(viewingUser.username) ? setFollowing(following.filter(f => f !== viewingUser.username)) : setFollowing([...following, viewingUser.username])} onBlock={() => handleBlock(viewingUser.id)} onMessage={() => alert(`Start DM with ${viewingUser.username}`)} />;
      if (subView === 'club') return <ClubDetailView club={selectedClub} onBack={() => setSubView(null)} onJoin={handleJoinClub} onOpenThread={setActiveThread} />;
      
      switch (activeTab) {
        case 'home': return (
            <div className="pb-32">
                <div className="py-6 overflow-x-auto scrollbar-hide flex space-x-4 px-4">
                    {stories.map((s, i) => (
                        <div key={s.id} onClick={() => handleStoryClick(i)} className="flex-shrink-0 flex flex-col items-center space-y-1 cursor-pointer">
                            <div className={`p-[3px] rounded-full ${viewedStories.has(s.id) ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'}`}>
                                <Avatar src={s.avatar} size="lg" className="border-2 border-white dark:border-black" />
                            </div>
                            <span className="text-xs dark:text-gray-300">{s.username}</span>
                        </div>
                    ))}
                </div>
                <div className="max-w-md mx-auto px-4">
                    {posts.map(p => (
                        <div key={p.id} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 overflow-hidden">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleViewUser(p.username)}>
                                    <Avatar src={p.avatar} size="md" />
                                    <div><span className="font-bold text-sm block dark:text-white">{p.username}</span><span className="text-xs text-gray-400">{p.timestamp} ago</span></div>
                                </div>
                                <MoreHorizontal className="text-gray-400" />
                            </div>
                            <img src={p.image} className="w-full aspect-square object-cover bg-gray-100" />
                            <div className="p-4">
                                <div className="flex space-x-4 mb-3">
                                    <button onClick={() => handleLike(p.id)}><Heart className={`w-7 h-7 ${p.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-900 dark:text-white'}`} /></button>
                                    <button onClick={() => setCommentPost(p)}><MessageCircle className="w-7 h-7 text-gray-900 dark:text-white" /></button>
                                    <Share2 className="w-7 h-7 text-gray-900 dark:text-white" />
                                </div>
                                <div className="font-bold text-sm mb-2 dark:text-white">{p.likes} likes</div>
                                <div className="text-sm dark:text-gray-200"><span onClick={() => handleViewUser(p.username)} className="font-bold mr-2 cursor-pointer">{p.username}</span>{p.caption}</div>
                                {p.comments && p.comments.length > 0 && <div onClick={() => setCommentPost(p)} className="text-gray-500 text-sm mt-2 cursor-pointer">View all {p.comments.length} comments</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
        case 'clubs': return (
            <div className="pb-24 p-4 grid gap-4">
                <h2 className="text-3xl font-bold mb-4 dark:text-white">Clubs</h2>
                {clubs.map(c => (
                    <div key={c.id} onClick={() => {setSelectedClub(c); setSubView('club');}} className="bg-white dark:bg-gray-900 p-4 rounded-3xl flex items-center space-x-4 cursor-pointer shadow-sm border border-gray-100 dark:border-gray-800">
                        <img src={c.image} className="w-20 h-20 rounded-2xl object-cover" />
                        <div><h3 className="font-bold text-lg dark:text-white">{c.name}</h3><p className="text-gray-500 text-sm">{c.memberCount} members</p></div>
                    </div>
                ))}
            </div>
        );
        case 'events': return (
            <div className="pb-24 p-4 space-y-6">
                <h2 className="text-3xl font-bold mb-4 dark:text-white">Events</h2>
                {events.map(e => (
                    <div key={e.id} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
                        <div className="bg-blue-600 h-24 relative"><div className="absolute top-3 right-4 bg-white px-3 py-1 rounded-xl text-center"><div className="text-xs text-gray-400">OCT</div><div className="text-xl font-bold">{e.date.split(' ')[1]}</div></div></div>
                        <div className="p-5"><h3 className="font-bold text-2xl mb-1 dark:text-white">{e.title}</h3><p className="text-gray-500 mb-6">{e.location}</p><Button variant={e.isGoing ? "primary" : "outline"} className="w-full" onClick={() => setEvents(events.map(ev => ev.id === e.id ? {...ev, isGoing: !ev.isGoing} : ev))}>{e.isGoing ? "Going" : "RSVP"}</Button></div>
                    </div>
                ))}
            </div>
        );
        case 'profile': return <ProfileView user={currentUser} posts={posts.filter(p => p.username === currentUser.username)} isCurrentUser={true} onEdit={() => setShowEditProfile(true)} />;
        default: return null;
      }
  };

  return (
    <div className={`${darkMode ? 'dark bg-black' : 'bg-gray-100'} min-h-screen flex justify-center font-sans transition-colors duration-300`}>
        <div className={`w-full max-w-md bg-white dark:bg-black shadow-2xl min-h-screen relative flex flex-col overflow-hidden ${fontSizes[fontSize]}`}>
            
            {!subView && !activeThread && (
                <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-30 px-5 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                    <h1 className="text-2xl font-bold tracking-tighter text-blue-600">CampusGram</h1>
                    <div className="flex space-x-5">
                        <button onClick={() => setSubView('settings')}><Settings className="dark:text-white" /></button>
                        <Send className="dark:text-white" />
                    </div>
                </div>
            )}

            <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-black">{renderContent()}</main>

            {!subView && !activeThread && (
                <div className="fixed bottom-0 w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 h-[88px] pb-6 flex items-center justify-around z-40">
                    {['home', 'clubs', 'add', 'events', 'profile'].map(tab => {
                        if (tab === 'add') return <button key={tab} onClick={() => setShowCreateModal(true)} className="-mt-10 bg-gradient-to-tr from-blue-600 to-purple-600 p-4 rounded-2xl shadow-xl border-4 border-white dark:border-gray-900 text-white transform hover:scale-105 transition-transform"><PlusSquare size={28} /></button>;
                        const Icon = { home: Home, clubs: Users, events: Calendar, profile: User }[tab];
                        return <button key={tab} onClick={() => setActiveTab(tab)} className={`p-3 rounded-2xl transition-colors ${activeTab === tab ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400'}`}><Icon size={26} strokeWidth={activeTab === tab ? 3 : 2} /></button>;
                    })}
                </div>
            )}

            {/* Overlays */}
            {activeStoryIndex !== null && (
                <StoryViewer 
                    story={stories[activeStoryIndex]} 
                    onClose={() => setActiveStoryIndex(null)}
                    onNextStory={() => activeStoryIndex < stories.length - 1 ? setActiveStoryIndex(prev => prev + 1) : setActiveStoryIndex(null)}
                    onPrevStory={() => activeStoryIndex > 0 ? setActiveStoryIndex(prev => prev - 1) : setActiveStoryIndex(null)}
                />
            )}
            {showCreateModal && <CreateModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreate} />}
            {commentPost && <CommentsModal post={commentPost} onClose={() => setCommentPost(null)} onAddComment={handleAddComment} />}
            {showEditProfile && <EditProfileModal user={currentUser} onClose={() => setShowEditProfile(false)} onSave={(data) => { setCurrentUser({...currentUser, ...data}); setShowEditProfile(false); }} />}
            
        </div>
    </div>
  );
}