
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '@/components/MobileHeader';

interface QuizQuestionInput {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const CreateQuizPage = () => {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState<QuizQuestionInput[]>([
    { 
      id: '1', 
      question: '', 
      options: ['', '', '', ''], 
      correctAnswer: 0, 
      explanation: '' 
    }
  ]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const addQuestion = () => {
    const newQuestion: QuizQuestionInput = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: keyof QuizQuestionInput, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  const saveQuiz = () => {
    if (!quizName.trim()) {
      toast({
        title: "Quiz name required",
        description: "Please enter a name for your quiz.",
        variant: "destructive",
      });
      return;
    }

    const validQuestions = questions.filter(q => 
      q.question.trim() && 
      q.options.filter(opt => opt.trim()).length >= 2 &&
      q.explanation.trim()
    );
    
    if (validQuestions.length === 0) {
      toast({
        title: "No valid questions",
        description: "Please create at least one complete question.",
        variant: "destructive",
      });
      return;
    }

    const newQuiz = {
      id: `quiz-${Date.now()}`,
      name: quizName,
      questions: validQuestions.map(q => ({
        ...q,
        id: `q-${q.id}`
      })),
      createdAt: Date.now(),
      source: 'Custom created'
    };

    // Get existing quizzes
    const existingQuizzes = JSON.parse(localStorage.getItem('customQuizzes') || '[]');
    const updatedQuizzes = [...existingQuizzes, newQuiz];
    
    localStorage.setItem('customQuizzes', JSON.stringify(updatedQuizzes));

    toast({
      title: "Quiz created!",
      description: `Created "${quizName}" with ${validQuestions.length} questions.`,
    });

    navigate('/quiz');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background to-purple-50/20 flex flex-col">
      <MobileHeader title="Create Quiz" showBack />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter quiz name..."
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                  {questions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Question</label>
                  <Textarea
                    placeholder="Enter your question..."
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Answer Options</label>
                  <div className="space-y-2 mt-1">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                          className="mt-1"
                        />
                        <Input
                          placeholder={`Option ${optionIndex + 1}...`}
                          value={option}
                          onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select the radio button next to the correct answer
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Explanation</label>
                  <Textarea
                    placeholder="Explain why this answer is correct..."
                    value={question.explanation}
                    onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={addQuestion}
            variant="outline"
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
          <Button
            onClick={saveQuiz}
            className="flex-1 bg-gradient-to-r from-primary to-purple-600"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
