
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Load flashcards and generate quiz questions
    const storedCards = localStorage.getItem('generatedFlashcards');
    let flashcards: Flashcard[] = [];
    
    if (storedCards) {
      try {
        const parsedCards = JSON.parse(storedCards);
        if (Array.isArray(parsedCards) && parsedCards.length > 0) {
          flashcards = parsedCards;
        }
      } catch (error) {
        console.error('Error parsing stored flashcards:', error);
      }
    }
    
    // If no stored flashcards, use sample cards
    if (flashcards.length === 0) {
      flashcards = [
        {
          id: '1',
          front: 'What is the powerhouse of the cell?',
          back: 'The mitochondria is the powerhouse of the cell, responsible for producing ATP through cellular respiration.',
          difficulty: 'easy'
        },
        {
          id: '2',
          front: 'Define photosynthesis',
          back: 'Photosynthesis is the process by which plants convert light energy, carbon dioxide, and water into glucose and oxygen.',
          difficulty: 'medium'
        },
        {
          id: '3',
          front: 'What is DNA replication?',
          back: 'DNA replication is the process by which DNA makes a copy of itself during cell division, ensuring genetic information is passed to daughter cells.',
          difficulty: 'hard'
        },
        {
          id: '4',
          front: 'Explain the difference between mitosis and meiosis',
          back: 'Mitosis produces two identical diploid cells for growth and repair, while meiosis produces four genetically different haploid gametes for reproduction.',
          difficulty: 'hard'
        }
      ];
    }

    // Generate quiz questions from flashcards
    const generatedQuestions = flashcards.slice(0, 4).map((card, index) => {
      const wrongAnswers = generateWrongAnswers(card.back);
      const allOptions = [card.back, ...wrongAnswers].sort(() => Math.random() - 0.5);
      const correctIndex = allOptions.indexOf(card.back);

      return {
        id: card.id,
        question: card.front,
        options: allOptions,
        correctAnswer: correctIndex,
        explanation: card.back
      };
    });

    setQuestions(generatedQuestions);
  }, []);

  const generateWrongAnswers = (correctAnswer: string): string[] => {
    const wrongAnswers = [
      'This is an incorrect answer option',
      'Another wrong choice',
      'Definitely not the right answer'
    ];
    return wrongAnswers;
  };

  const isQuizComplete = currentQuestion >= questions.length;
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

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

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnsweredQuestions([]);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (questions.length === 0) {
    return (
      <div className="h-full bg-gradient-to-br from-background to-purple-50/20 flex flex-col">
        <MobileHeader title="Quiz Mode" showBack />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                No flashcards available for quiz. Please create some flashcards first.
              </p>
              <Link to="/upload">
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
                  Create Flashcards
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isQuizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="h-full bg-gradient-to-br from-background to-purple-50/20 flex flex-col">
        <MobileHeader title="Quiz Complete" showBack />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
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
                  onClick={resetQuiz}
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
    <div className="h-full bg-gradient-to-br from-background to-purple-50/20 flex flex-col">
      <MobileHeader title="Quiz Mode" showBack />
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>Score: {score}/{currentQuestion}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg leading-relaxed">{currentQ.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full p-4 text-left border rounded-lg transition-colors text-sm ${
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
                      <span className="leading-relaxed">{option}</span>
                      {showResult && index === currentQ.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                      {showResult && selectedAnswer === index && index !== currentQ.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {showResult && (
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Explanation:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                {!showResult ? (
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-gradient-to-r from-primary to-purple-600"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNextQuestion}
                    className="bg-gradient-to-r from-primary to-purple-600"
                  >
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
