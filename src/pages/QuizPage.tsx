
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Trophy, Plus, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  name: string;
  questions: Question[];
  createdAt: number;
  source: string;
}

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  useEffect(() => {
    // Load custom quizzes
    const customQuizzes = JSON.parse(localStorage.getItem('customQuizzes') || '[]');
    
    // Load flashcard sets and convert to quizzes
    const flashcardSets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
    const flashcardQuizzes = flashcardSets.map(set => ({
      id: `flashcard-${set.id}`,
      name: `${set.name} (from flashcards)`,
      questions: generateQuestionsFromFlashcards(set.cards),
      createdAt: set.createdAt,
      source: 'Generated from flashcards'
    }));

    const allQuizzes = [...customQuizzes, ...flashcardQuizzes];
    setAvailableQuizzes(allQuizzes);

    // Auto-select first quiz if available
    if (allQuizzes.length > 0 && !selectedQuizId) {
      setSelectedQuizId(allQuizzes[0].id);
      setQuestions(allQuizzes[0].questions);
    }
  }, [selectedQuizId]);

  const generateQuestionsFromFlashcards = (flashcards: any[]): Question[] => {
    return flashcards.slice(0, 6).map((card, index) => {
      // Generate better wrong answers based on content
      const wrongAnswers = [
        generateWrongAnswer(card.back, 'opposite'),
        generateWrongAnswer(card.back, 'similar'),
        generateWrongAnswer(card.back, 'unrelated')
      ];
      
      const allOptions = [card.back, ...wrongAnswers].sort(() => Math.random() - 0.5);
      const correctIndex = allOptions.indexOf(card.back);

      return {
        id: `q-${card.id || index}`,
        question: card.front,
        options: allOptions,
        correctAnswer: correctIndex,
        explanation: card.back
      };
    });
  };

  const generateWrongAnswer = (correctAnswer: string, type: 'opposite' | 'similar' | 'unrelated'): string => {
    const templates = {
      opposite: [
        "This is the reverse process of what actually occurs",
        "This describes the opposite mechanism",
        "This is not how the process works"
      ],
      similar: [
        "This is a related but incorrect concept",
        "This describes a similar but different process",
        "This is partially correct but not the complete answer"
      ],
      unrelated: [
        "This is completely unrelated to the question",
        "This describes a different biological concept",
        "This is not relevant to the topic"
      ]
    };
    
    return templates[type][Math.floor(Math.random() * templates[type].length)];
  };

  const selectQuiz = (quizId: string) => {
    const selectedQuiz = availableQuizzes.find(q => q.id === quizId);
    if (selectedQuiz) {
      setSelectedQuizId(quizId);
      setQuestions(selectedQuiz.questions);
      setCurrentQuestion(0);
      setScore(0);
      setAnsweredQuestions([]);
      setSelectedAnswer(null);
      setShowResult(false);
    }
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

  // Show quiz selection if no quiz selected or multiple available
  if (!selectedQuizId || (availableQuizzes.length > 1 && questions.length === 0)) {
    return (
      <div className="h-screen bg-gradient-to-br from-background to-purple-50/20 flex flex-col">
        <MobileHeader title="Quiz Mode" showBack />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Choose a Quiz</h2>
              <p className="text-sm text-muted-foreground">Select from your custom quizzes or generated ones</p>
            </div>
            <Link to="/create-quiz">
              <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </Link>
          </div>
          
          {availableQuizzes.length === 0 ? (
            <Card className="text-center p-6">
              <CardContent>
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No Quizzes Available</h3>
                <p className="text-muted-foreground mb-4">
                  Create custom quizzes or generate flashcards to get started.
                </p>
                <div className="space-y-2">
                  <Link to="/create-quiz">
                    <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
                      Create Custom Quiz
                    </Button>
                  </Link>
                  <Link to="/upload">
                    <Button variant="outline" className="w-full">
                      Generate from Content
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {availableQuizzes.map((quiz) => (
                <Card key={quiz.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => selectQuiz(quiz.id)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{quiz.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {quiz.questions.length} questions • {quiz.source}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isQuizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="h-screen bg-gradient-to-br from-background to-purple-50/20 flex flex-col">
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
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => {
                    setSelectedQuizId(null);
                    setQuestions([]);
                  }}
                >
                  Choose Different Quiz
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
    <div className="h-screen bg-gradient-to-br from-background to-purple-50/20 flex flex-col">
      <MobileHeader title="Quiz Mode" showBack />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
  );
};

export default QuizPage;
