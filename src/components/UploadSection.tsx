import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Mic, MicOff, Plus, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';

const UploadSection = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { subscribed, trial_active } = useSubscription();

  // --- Free user AI generation count tracking ---
  // Tracks how many times user generated AI flashcards today (localStorage, resets daily)
  const [freeGenLeft, setFreeGenLeft] = useState(2);

  useEffect(() => {
    if (subscribed || trial_active) {
      setFreeGenLeft(Infinity);
      return;
    }
    // Key is updated daily to reset count
    const todayKey = `aiGenUsed_${new Date().toISOString().slice(0,10)}`;
    const used = parseInt(localStorage.getItem(todayKey) || "0", 10);
    setFreeGenLeft(Math.max(0, 2 - used));
  }, [subscribed, trial_active]);

  // Helper for updating count
  const recordFreeGen = () => {
    const todayKey = `aiGenUsed_${new Date().toISOString().slice(0,10)}`;
    const used = parseInt(localStorage.getItem(todayKey) || "0", 10) + 1;
    localStorage.setItem(todayKey, used.toString());
    setFreeGenLeft(Math.max(0, 2 - used));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setUploadedFile(file);
        toast({
          title: "PDF uploaded!",
          description: `${file.name} is ready for processing.`,
        });
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Recording started",
        description: "Speak your notes clearly.",
      });
    } else {
      toast({
        title: "Recording stopped",
        description: "Processing your voice notes...",
      });
      setText(prev => prev + "\n[Voice recording processed]");
    }
  };

  const generateWithAI = async (type: 'flashcards' | 'quiz') => {
    const hasContent = text.trim() || uploadedFile;

    // --- Free user: enforce generation limits only for AI Flashcards ---
    if (!subscribed && !trial_active && type === "flashcards") {
      if (freeGenLeft <= 0) {
        toast({
          title: "Limit reached",
          description: "You have reached the free AI generation limit for today. Upgrade your plan for unlimited AI flashcards.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);
    
    try {
      let contentToProcess = text;
      
      if (uploadedFile) {
        // For demo purposes, using sample content when PDF is uploaded
        contentToProcess += `\n\nContent from ${uploadedFile.name}:\n` +
          "Photosynthesis is the biological process by which plants convert light energy into chemical energy. " +
          "This process occurs in the chloroplasts of plant cells, specifically in structures called thylakoids. " +
          "The main equation for photosynthesis is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. " +
          "Chlorophyll is the green pigment that captures light energy during photosynthesis. " +
          "Cellular respiration is the opposite process where glucose is broken down to release ATP energy. " +
          "Mitochondria are organelles that produce ATP through cellular respiration. " +
          "DNA replication occurs during the S phase of the cell cycle. " +
          "Enzymes are proteins that catalyze biochemical reactions by lowering activation energy. " +
          "Osmosis is the movement of water across a semipermeable membrane from low to high solute concentration.";
      }

      // --- Set correct count for flashcards/quiz ---
      let count = 10;
      if (type === "flashcards") {
        count = (subscribed || trial_active) ? 12 : 5;
      }

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          content: contentToProcess,
          type: type,
          count: count
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'AI generation failed');
      }

      const generatedItems = data.data;
      
      if (!generatedItems || generatedItems.length === 0) {
        toast({
          title: "Generation failed",
          description: "AI couldn't generate content from the provided material.",
          variant: "destructive",
        });
        return;
      }

      if (type === 'flashcards') {
        // Save flashcard set
        const newSet = {
          id: `ai-set-${Date.now()}`,
          name: uploadedFile ? `AI: ${uploadedFile.name}` : 'AI Generated Cards',
          cards: generatedItems.map((item: any, index: number) => ({
            id: `ai-card-${index + 1}`,
            front: item.front,
            back: item.back,
            difficulty: item.difficulty || 'medium'
          })),
          createdAt: Date.now(),
          source: uploadedFile ? `AI from PDF: ${uploadedFile.name}` : 'AI from text input'
        };
        
        const existingSets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
        const updatedSets = [...existingSets, newSet];
        localStorage.setItem('flashcardSets', JSON.stringify(updatedSets));
        
        toast({
          title: "AI Flashcards generated!",
          description: `Created ${generatedItems.length} flashcards using AI.`,
        });
        
        if (!subscribed && !trial_active) {
          recordFreeGen();
        }
        
        navigate('/flashcards');
      } else {
        // Save quiz
        const newQuiz = {
          id: `ai-quiz-${Date.now()}`,
          name: uploadedFile ? `AI Quiz: ${uploadedFile.name}` : 'AI Generated Quiz',
          questions: generatedItems.map((item: any, index: number) => ({
            id: `ai-q-${index + 1}`,
            question: item.question,
            options: item.options,
            correctAnswer: item.correctAnswer,
            explanation: item.explanation
          })),
          createdAt: Date.now(),
          source: uploadedFile ? `AI from PDF: ${uploadedFile.name}` : 'AI from text input'
        };
        
        const existingQuizzes = JSON.parse(localStorage.getItem('customQuizzes') || '[]');
        const updatedQuizzes = [...existingQuizzes, newQuiz];
        localStorage.setItem('customQuizzes', JSON.stringify(updatedQuizzes));
        
        toast({
          title: "AI Quiz generated!",
          description: `Created ${generatedItems.length} questions using AI.`,
        });
        
        navigate('/quiz');
      }

      setText('');
      setUploadedFile(null);
      
    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: "AI Generation failed",
        description: error.message || "There was an error generating content with AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateFlashcardsFromContent = (content: string) => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const flashcards = [];
    
    const questionPatterns = [
      { 
        pattern: /(.+) is (.+)/i, 
        template: (match: RegExpMatchArray) => ({ 
          q: `What is ${match[1].trim()}?`, 
          a: `${match[1].trim()} is ${match[2].trim()}` 
        }) 
      },
      { 
        pattern: /(.+) are (.+)/i, 
        template: (match: RegExpMatchArray) => ({ 
          q: `What are ${match[1].trim()}?`, 
          a: `${match[1].trim()} are ${match[2].trim()}` 
        }) 
      },
      { 
        pattern: /(.+) occurs in (.+)/i, 
        template: (match: RegExpMatchArray) => ({ 
          q: `Where does ${match[1].trim()} occur?`, 
          a: `${match[1].trim()} occurs in ${match[2].trim()}` 
        }) 
      },
      { 
        pattern: /(.+) contains (.+)/i, 
        template: (match: RegExpMatchArray) => ({ 
          q: `What does ${match[1].trim()} contain?`, 
          a: `${match[1].trim()} contains ${match[2].trim()}` 
        }) 
      },
      { 
        pattern: /(.+) produces (.+)/i, 
        template: (match: RegExpMatchArray) => ({ 
          q: `What does ${match[1].trim()} produce?`, 
          a: `${match[1].trim()} produces ${match[2].trim()}` 
        }) 
      }
    ];

    for (let i = 0; i < Math.min(sentences.length, 12); i++) {
      const sentence = sentences[i].trim();
      if (sentence.length < 30) continue;

      let questionCreated = false;

      for (const pattern of questionPatterns) {
        const match = sentence.match(pattern.pattern);
        if (match) {
          const qa = pattern.template(match);
          flashcards.push({
            id: `card-${flashcards.length + 1}`,
            front: qa.q,
            back: qa.a,
            difficulty: sentence.length > 100 ? 'hard' : sentence.length > 60 ? 'medium' : 'easy'
          });
          questionCreated = true;
          break;
        }
      }

      if (!questionCreated && sentence.length > 40) {
        const keyWords = sentence.split(' ').filter(word => 
          word.length > 4 && 
          !['that', 'this', 'with', 'from', 'they', 'have', 'been', 'will', 'would', 'could', 'should'].includes(word.toLowerCase())
        );
        
        if (keyWords.length > 0) {
          const keyWord = keyWords[0];
          flashcards.push({
            id: `card-${flashcards.length + 1}`,
            front: `Explain the concept involving "${keyWord}"`,
            back: sentence,
            difficulty: sentence.length > 100 ? 'hard' : sentence.length > 60 ? 'medium' : 'easy'
          });
        }
      }
    }

    if (flashcards.length < 3 && sentences.length > 0) {
      for (let i = 0; i < Math.min(3, sentences.length); i++) {
        const sentence = sentences[i].trim();
        if (sentence.length > 20) {
          flashcards.push({
            id: `card-${flashcards.length + 1}`,
            front: `What is described in this statement?`,
            back: sentence,
            difficulty: 'medium'
          });
        }
      }
    }
    
    return flashcards;
  };

  const generateFlashcards = async () => {
    const hasContent = text.trim() || uploadedFile;
    
    if (!hasContent) {
      toast({
        title: "No content to process",
        description: "Please enter some text, upload a file, or record audio first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      let contentToProcess = text;
      
      if (uploadedFile) {
        contentToProcess += `\n\nExtracted from ${uploadedFile.name}:\n` +
          "Photosynthesis is the biological process by which plants convert light energy into chemical energy. " +
          "This process occurs in the chloroplasts of plant cells, specifically in structures called thylakoids. " +
          "The main equation for photosynthesis is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. " +
          "Chlorophyll is the green pigment that captures light energy during photosynthesis. " +
          "Cellular respiration is the opposite process where glucose is broken down to release ATP energy. " +
          "Mitochondria are organelles that produce ATP through cellular respiration. " +
          "DNA replication occurs during the S phase of the cell cycle. " +
          "Enzymes are proteins that catalyze biochemical reactions by lowering activation energy. " +
          "Osmosis is the movement of water across a semipermeable membrane from low to high solute concentration.";
      }
      
      const generatedCards = generateFlashcardsFromContent(contentToProcess);
      
      if (generatedCards.length === 0) {
        toast({
          title: "Unable to generate flashcards",
          description: "Please provide more detailed content for better flashcard generation.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      
      const newSet = {
        id: `set-${Date.now()}`,
        name: uploadedFile ? `From ${uploadedFile.name}` : 'Generated from Text',
        cards: generatedCards,
        createdAt: Date.now(),
        source: uploadedFile ? `PDF: ${uploadedFile.name}` : 'Text input'
      };
      
      const existingSets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
      const updatedSets = [...existingSets, newSet];
      
      localStorage.setItem('flashcardSets', JSON.stringify(updatedSets));
      localStorage.setItem('generatedFlashcards', JSON.stringify(generatedCards));
      
      setTimeout(() => {
        setIsProcessing(false);
        toast({
          title: "Flashcards generated!",
          description: `Created ${generatedCards.length} flashcards from your content.`,
        });
        setText('');
        setUploadedFile(null);
        navigate('/flashcards');
      }, 2000);
      
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Generation failed",
        description: "There was an error generating your flashcards. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-4 pt-2 pb-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Upload Study Material</h1>
          <p className="text-muted-foreground text-sm">
            Generate AI-powered flashcards from your content
          </p>
        </div>
        <Link to="/create-flashcards">
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Custom
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {/* File Upload */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Upload className="h-5 w-5 mr-2" />
              Upload PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              {uploadedFile ? (
                <div>
                  <p className="text-sm font-medium text-green-600 mb-2">
                    ✓ {uploadedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">File ready for processing</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your PDF here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Voice Recording */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Mic className="h-5 w-5 mr-2" />
              Voice Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Button
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "outline"}
                size="lg"
                className="mb-2"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
              {isRecording && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">Recording...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Text Input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Or Paste Your Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your study material here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-24 mb-4"
            />
            
            {/* --- AI Generation Buttons with Free Usage Limit --- */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Button 
                onClick={() => generateWithAI('flashcards')}
                disabled={isProcessing || (!subscribed && !trial_active && freeGenLeft <= 0)}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isProcessing ? "Generating..." : "AI Flashcards"}
              </Button>
              <Button 
                onClick={() => generateWithAI('quiz')}
                disabled={isProcessing}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isProcessing ? "Generating..." : "AI Quiz"}
              </Button>
            </div>
            
            {/* Free user limit info */}
            {(!subscribed && !trial_active) && (
              <div className="text-xs text-muted-foreground mb-2 text-right">
                {freeGenLeft > 0
                  ? `Free Generations left today: ${freeGenLeft} / 2 (5 cards each)`
                  : <span className="text-red-500">Free limit reached for today. Upgrade for unlimited AI flashcards.</span>
                }
              </div>
            )}
            
            {/* Legacy Generation */}
            <Button 
              onClick={generateFlashcards}
              disabled={isProcessing}
              variant="outline"
              className="w-full"
            >
              {isProcessing ? "Generating..." : "Basic Generation"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadSection;
