import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { calculateSTI, getBadge } from '../utils/scoring';
import Layout from '../components/Layout';
import QuizModal from '../components/QuizModal';
import { Shield, PlayCircle, Zap, CheckCircle, Smartphone, Download } from 'lucide-react';

const UserHome = () => {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const distributorId = searchParams.get('distributorId') || 'unknown_dist';

  useEffect(() => {
    const initUser = async () => {
      try {
        const userCredential = await signInAnonymously(auth);
        const uid = userCredential.user.uid;
        const userRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          const newProfile = {
            uid,
            distributorId,
            currentSTI: 20,
            quizScore: 0,
            streak: 1,
            badges: ['First Scan'],
            lastActive: serverTimestamp()
          };
          await setDoc(userRef, newProfile);
          setUserData(newProfile);
        }
      } catch (error) {
        console.error("Auth Error", error);
      }
      setLoading(false);
    };

    initUser();
  }, []);

  const handleQuizComplete = async (score) => {
    if (!userData) return;
    
    const newStreak = score > 0 ? (userData.streak || 0) + 1 : userData.streak;
    const newSTI = calculateSTI(score > 0 ? 100 : userData.quizScore, newStreak, userData.lastActive);
    
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, {
      quizScore: score > 0 ? 100 : userData.quizScore,
      streak: newStreak,
      currentSTI: newSTI,
      lastActive: serverTimestamp()
    });

    setUserData(prev => ({ ...prev, currentSTI: newSTI, streak: newStreak }));
  };

  if (loading) return <div className="min-h-screen bg-background-dark text-white flex items-center justify-center">Loading SafeHP...</div>;

  const badge = getBadge(userData?.currentSTI || 0);

  return (
    <Layout>
      <div className="flex flex-col gap-10 animate-in fade-in duration-500 pb-20">
        
        {/* Hero Text */}
        <div className="flex flex-col gap-4 py-6">
            <h1 className="text-3xl md:text-6xl font-black leading-tight bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                Safety at Your Fingertips
            </h1>
            <p className="text-text-muted text-lg max-w-2xl">
                Watch today's lesson, maintain your streak, and boost your household Safety Trust Index.
            </p>
        </div>

        {/* --- SECTION 1: STATS (Linked to Button) --- */}
        <div id="stats" className="scroll-mt-32">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Score Card */}
                <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-border-dark bg-card-dark p-8 group transition-all hover:border-border-dark/80">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="text-text-muted text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Shield size={14}/> Safety Trust Index
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-7xl md:text-8xl font-black ${badge.color}`}>{userData.currentSTI}</span>
                                <span className="text-2xl text-text-muted font-medium">/100</span>
                            </div>
                            <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full ${badge.bg} ${badge.border} border w-fit`}>
                                <span className={`text-sm font-bold ${badge.color}`}>{badge.label} Status</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 min-w-[220px]">
                             <div className="p-5 rounded-xl bg-background-dark border border-border-dark shadow-inner">
                                <div className="text-text-muted text-xs uppercase font-bold mb-1">Learning Streak</div>
                                <div className="flex items-center gap-2 text-2xl font-bold text-white">
                                    <Zap className="text-yellow-400 fill-yellow-400" /> {userData.streak} Days
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Task Card */}
                <div className="rounded-2xl border border-border-dark bg-card-dark p-6 flex flex-col hover:border-primary/30 transition-all shadow-xl shadow-black/20 group cursor-pointer" onClick={() => setIsQuizOpen(true)}>
                    <div className="text-primary bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <PlayCircle size={24} fill="currentColor" className="text-primary"/>
                    </div>
                    <h2 className="text-white text-xl font-bold mb-2">Daily Challenge</h2>
                    <p className="text-text-muted text-sm mb-6 flex-grow">
                        Watch "Leak Detection 101" and take the quiz to earn +10 points today.
                    </p>
                    <button className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                        Start Task
                    </button>
                </div>
            </div>
        </div>

        {/* --- SECTION 2: FEATURES (Linked to Button) --- */}
        <div id="features" className="scroll-mt-32">
            <h3 className="text-2xl font-bold text-white mb-6">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-xl border border-border-dark bg-card-dark flex items-center gap-4 hover:bg-card-dark/80 transition-colors">
                    <div className="bg-green-500/10 p-3 rounded-full">
                        <CheckCircle className="text-green-500" size={24} />
                    </div>
                    <div>
                        <div className="text-white font-bold text-lg">Cylinder Verified</div>
                        <div className="text-text-muted text-sm font-mono mt-1">ID: {auth.currentUser?.uid.substring(0,8).toUpperCase()}...</div>
                    </div>
                </div>
                 <div className="p-6 rounded-xl border border-border-dark bg-card-dark flex items-center gap-4 hover:bg-card-dark/80 transition-colors">
                    <div className="bg-purple-500/10 p-3 rounded-full">
                        <Smartphone className="text-purple-500" size={24} />
                    </div>
                    <div className="flex-1">
                        <div className="text-white font-bold text-lg">Download Report</div>
                        <div className="text-text-muted text-sm mt-1">Get your full safety history</div>
                    </div>
                    <button className="text-white bg-border-dark hover:bg-white hover:text-background-dark p-2 rounded-lg transition-all">
                        <Download size={20} />
                    </button>
                </div>
            </div>
        </div>
      </div>

      <QuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
        onComplete={handleQuizComplete}
      />
    </Layout>
  );
};

export default UserHome;