import React, { useState } from 'react';
import { X, Play, CheckCircle, AlertCircle } from 'lucide-react';

const QuizModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState('video'); // video | quiz | result
  const [selectedOption, setSelectedOption] = useState(null);

  if (!isOpen) return null;

  const handleQuizSubmit = () => {
    // Correct answer is index 1 (Smell)
    const isCorrect = selectedOption === 1;
    onComplete(isCorrect ? 100 : 0); // Send score back to parent
    setStep('result');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card-dark border border-border-dark w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-white z-10">
          <X size={24} />
        </button>

        {/* STEP 1: VIDEO */}
        {step === 'video' && (
          <div className="flex flex-col">
            <div className="relative aspect-video bg-black">
              {/* Using a placeholder image for prototype, in real app this is an iframe */}
              <img 
                src="https://images.unsplash.com/photo-1585241645928-8b788e0a4306?q=80&w=1000&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <button 
                    onClick={() => setStep('quiz')}
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all animate-pulse"
                 >
                    <Play fill="currentColor" size={16} /> Skip Video & Start Quiz
                 </button>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">Lesson: Detecting Leaks</h2>
              <p className="text-text-muted text-sm">Watch how to safely identify a gas leak using the soap water method.</p>
            </div>
          </div>
        )}

        {/* STEP 2: QUIZ */}
        {step === 'quiz' && (
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Quick Safety Quiz</h2>
            <p className="text-text-muted mb-4 font-medium">What is the first sign of an LPG leak?</p>
            
            <div className="space-y-3 mb-6">
              {['Hissing Sound', 'Rotten Egg Smell', 'Smoke', 'High Temperature'].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedOption === idx 
                    ? 'border-primary bg-primary/10 text-white' 
                    : 'border-border-dark hover:border-slate-500 text-text-muted'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button 
              disabled={selectedOption === null}
              onClick={handleQuizSubmit}
              className="w-full bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold"
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* STEP 3: RESULT */}
        {step === 'result' && (
          <div className="p-8 text-center flex flex-col items-center">
            {selectedOption === 1 ? (
              <>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="text-green-500" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Correct!</h2>
                <p className="text-text-muted mb-6">You earned +10 points and extended your streak.</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="text-red-500" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Incorrect</h2>
                <p className="text-text-muted mb-6">The correct answer was "Rotten Egg Smell".</p>
              </>
            )}
            <button onClick={onClose} className="bg-white text-background-dark font-bold px-8 py-2 rounded-lg">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;