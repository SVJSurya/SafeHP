import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { calculateSTI, getBadge } from '../utils/scoring';
import Layout from '../components/Layout';
import QuizModal from '../components/QuizModal';
import { Shield, PlayCircle, RotateCw, CheckCircle, Smartphone, Download, AlertTriangle } from 'lucide-react';

const UserHome = () => {
  const [searchParams] = useSearchParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // 1. GET IDENTIFIERS FROM URL (QR PAYLOAD)
  const qrUserId = searchParams.get('userId'); 
  const distId = searchParams.get('distributorId') || 'Agency_Default';
  
  useEffect(() => {
    const initUser = async () => {
      try {
        // Ensure we have a session, but we might not use this UID for storage
        const userCredential = await signInAnonymously(auth);
        
        // 2. CRITICAL LOGIC CHANGE:
        // If the QR provided a specific 'userId' (e.g. "Anita"), use that as the Doc ID.
        // If not, fall back to the Device ID (auth.uid).
        const targetDocId = qrUserId || userCredential.user.uid;

        const userRef = doc(db, 'users', targetDocId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          // Create new profile for this specific QR ID
          const newProfile = {
            uid: targetDocId, // Store the QR ID as the UID
            distributorId: distId,
            name: qrUserId ? "Household Profile" : "New User", // Differentiate UI
            currentSTI: 0,
            attempts: 0,
            isCertified: false,
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
  }, [qrUserId]); // Re-run if QR ID changes

  const handleQuizComplete = async (quizScore) => {
    if (!userData) return;

    // Use the same target ID logic
    const targetDocId = userData.uid; // This is already set correctly from init
    
    const newAttempts = (userData.attempts || 0) + 1;
    const passed = quizScore >= 70;
    
    let updates = {
      attempts: newAttempts,
      lastActive: serverTimestamp()
    };

    let newSTI = userData.currentSTI;

    if (passed) {
      newSTI = calculateSTI(quizScore, newAttempts);
      updates.currentSTI = newSTI;
      updates.isCertified = true;
    }

    const userRef = doc(db, 'users', targetDocId);
    await updateDoc(userRef, updates);

    setUserData(prev => ({ 
      ...prev, 
      attempts: newAttempts, 
      currentSTI: newSTI, 
      isCertified: passed || prev.isCertified 
    }));
    
    setIsQuizOpen(false);
    if(passed) alert(`Certified! Score: ${newSTI}`);
    else alert(`Score: ${quizScore}. You need 70 to pass. Try again!`);
  };

  if (loading) return <div className="min-h-screen bg-background-dark text-white flex items-center justify-center">Loading Profile...</div>;

  const badge = getBadge(userData?.currentSTI || 0);

  return (
    <Layout>
      <div className="flex flex-col gap-10 animate-in fade-in duration-500 pb-20">
        
        {/* Header */}
        <div className="flex flex-col gap-4 py-6 border-b border-border-dark">
            <h1 className="text-3xl md:text-5xl font-black text-white">
                {/* 3. Dynamic Title based on Profile */}
                {qrUserId ? `${qrUserId}'s Safety Profile` : "Household Safety Profile"}
            </h1>
            <div className="flex items-center gap-4 text-text-muted">
                <span className="bg-card-dark px-3 py-1 rounded text-xs border border-border-dark">ID: {userData?.uid}</span>
                <span className="bg-card-dark px-3 py-1 rounded text-xs border border-border-dark">Distributor: {userData?.distributorId}</span>
            </div>
        </div>

        {/* --- MAIN DASHBOARD --- */}
        <div id="stats" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* STI Score Card */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-border-dark bg-card-dark p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                
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

                    {/* ATTEMPTS METRIC */}
                    <div className="flex flex-col gap-4 min-w-[200px]">
                         <div className="p-5 rounded-xl bg-background-dark border border-border-dark shadow-inner">
                            <div className="text-text-muted text-xs uppercase font-bold mb-1">Certification Attempts</div>
                            <div className="flex items-center gap-2 text-3xl font-bold text-white">
                                <RotateCw className={userData.attempts > 1 ? "text-orange-400" : "text-green-400"} size={24} /> 
                                {userData.attempts}
                            </div>
                            <div className="text-[10px] text-text-muted mt-1">Fewer attempts = Higher STI Score</div>
                         </div>
                    </div>
                </div>
            </div>

            {/* ACTION CARD */}
            <div className="rounded-2xl border border-border-dark bg-card-dark p-6 flex flex-col hover:border-primary/30 transition-all shadow-xl shadow-black/20">
                {userData.isCertified ? (
                   <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={32} className="text-green-500" />
                      </div>
                      <h2 className="text-white text-xl font-bold mb-2">Profile Certified!</h2>
                      <p className="text-text-muted text-sm mb-4">This profile has cleared the safety assessment.</p>
                      <button 
                        onClick={() => setIsQuizOpen(true)}
                        className="text-sm text-text-muted underline hover:text-white"
                      >
                        Retake to Improve Score
                      </button>
                   </div>
                ) : (
                   <>
                    <div className="text-primary bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <PlayCircle size={24} fill="currentColor" className="text-primary"/>
                    </div>
                    <h2 className="text-white text-xl font-bold mb-2">Action Required</h2>
                    <p className="text-text-muted text-sm mb-6 flex-grow">
                        Certify <strong>{qrUserId || "this household"}</strong> by taking the safety assessment.
                    </p>
                    <button 
                        onClick={() => setIsQuizOpen(true)}
                        className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 animate-pulse"
                    >
                        Start Assessment
                    </button>
                   </>
                )}
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