
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ArrowLeft, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  const questions: Question[] = [
    {
      id: '1',
      question: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
      correctAnswer: 1,
      explanation: 'The mitochondria is known as the powerhouse of the cell because it produces ATP (energy) through cellular respiration.'
    },
    {
      id: '2',
      question: 'Which process do plants use to make their own food?',
      options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'],
      correctAnswer: 1,
      explanation: 'Photosynthesis is the process by which plants convert light energy, CO₂, and water into glucose and oxygen.'
    },
    {
      id: '3',
      question: 'What is the basic unit of heredity?',
      options: ['Chromosome', 'DNA', 'Gene', 'Protein'],
      correctAnswer: 2,
      explanation: 'A gene is the basic unit of heredity that contains the instructions for building proteins and determining traits.'
    },
    {
      id: '4',
      question: 'Which type of cell division produces gametes?',
      options: ['Mitosis', 'Meiosis', 'Binary fission', 'Cytokinesis'],
      correctAnswer: 1,
      explanation: 'Meiosis is the type of cell division that produces gametes (sex cells) with half the chromosome number.'
    }
  ];

  const isQuizComplete = currentQuestion >= questions.length;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    setAnsweredQuestions(prev => {
      const newAnswered = [...prev];
      newAnswered[currentQuestion] = isCorrect;
      return newAnswered;
    });

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (isQuizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-purple-50/20">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold text-primary mb-4">{percentage}%</div>
              <p className="text-lg text-muted-foreground mb-6">
                You scored {score} out of {questions.length} questions correctly!
              </p>
              <div className="space-y-3">
                <Link to="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
                    Back to Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setCurrentQuestion(0);
                    setScore(0);
                    setAnsweredQuestions([]);
                    setSelectedAnswer(null);
                    setShowResult(false);
                  }}
                >
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-purple-50/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link to="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>Score: {score}/{currentQuestion}</span>
            </div>
            <Progress value={progress} className="mb-4" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentQ.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full p-4 text-left border rounded-lg transition-colors ${
                      selectedAnswer === index
                        ? showResult
                          ? index === currentQ.correctAnswer
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-red-500 bg-red-50 text-red-700'
                          : 'border-primary bg-primary/5'
                        : showResult && index === currentQ.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && index === currentQ.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {showResult && selectedAnswer === index && index !== currentQ.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {showResult && (
                <div className="p-4 bg-secondary/50 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2">Explanation:</h4>
                  <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
                </div>
              )}

              <div className="flex justify-end">
                {!showResult ? (
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-gradient-to-r from-primary to-purple-600"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
