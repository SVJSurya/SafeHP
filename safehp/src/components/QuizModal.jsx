import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const QUESTIONS = [
  { q: "What is the first sign of an LPG leak?", options: ["Hissing Sound", "Rotten Egg Smell", "Smoke", "Heat"], correct: 1 },
  { q: "Where should the LPG cylinder be placed?", options: ["Horizontal", "Upside Down", "Vertical & Ventilated", "Inside a Cabinet"], correct: 2 },
  { q: "What should you use to check for leaks?", options: ["Matchstick", "Lighter", "Soap Water Solution", "Flashlight"], correct: 2 },
  { q: "When leaving home for a long trip, what must you do?", options: ["Leave regulator on", "Turn off regulator", "Cover cylinder", "Nothing"], correct: 1 },
  { q: "What is the expiry limit of a standard LPG hose?", options: ["1 Year", "5 Years", "10 Years", "Lifetime"], correct: 1 },
  { q: "Color of the flame in a healthy burner?", options: ["Blue", "Yellow", "Red", "Orange"], correct: 0 },
  { q: "Who should repair a damaged cylinder?", options: ["Yourself", "Local Mechanic", "Authorized Distributor", "Neighbor"], correct: 2 },
  { q: "Is it safe to place the cylinder near a heat source?", options: ["Yes", "No", "Only in winter", "If covered"], correct: 1 },
  { q: "What is the emergency number for LPG leaks in India?", options: ["100", "1906", "108", "911"], correct: 1 },
  { q: "Why shouldn't you use a curtain near the stove?", options: ["Looks bad", "Fire Hazard", "Blocks air", "Gets dirty"], correct: 1 },
];

const QuizModal = ({ isOpen, onClose, onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const handleAnswer = (optionIndex) => {
    let newScore = score;
    if (optionIndex === QUESTIONS[currentQ].correct) {
      newScore += 10; // 10 points per question = 100 total
      setScore(newScore);
    }

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
      // Wait a moment for UI then close
      setTimeout(() => {
        onComplete(newScore);
        // Reset local state for next time (if failed)
        setTimeout(() => {
          setShowResult(false);
          setCurrentQ(0);
          setScore(0);
        }, 500);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-card-dark border border-border-dark w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
        
        {!showResult ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold text-primary">Question {currentQ + 1}/{QUESTIONS.length}</span>
              <button onClick={onClose}><X className="text-text-muted hover:text-white" /></button>
            </div>

            <h2 className="text-xl font-bold text-white mb-8">{QUESTIONS[currentQ].q}</h2>
            
            <div className="space-y-3">
              {QUESTIONS[currentQ].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full text-left p-4 rounded-xl border border-border-dark hover:bg-primary/20 hover:border-primary text-text-muted hover:text-white transition-all font-medium"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="text-primary" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed</h2>
            <p className="text-text-muted">Calculating your Safety Score...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;