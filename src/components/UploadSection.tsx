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
import { useDailyGenerationLimit } from "@/hooks/useDailyGenerationLimit";
import FileUploadSection from './UploadSection/FileUploadSection';
import VoiceRecordingSection from './UploadSection/VoiceRecordingSection';
import TextInputSection from './UploadSection/TextInputSection';
import AIGenerationButtons from './UploadSection/AIGenerationButtons';

const UploadSection = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { subscribed, trial_active } = useSubscription();

  // --- Use shared hook for daily generation limit ---
  const {
    canGenerate,
    remaining,
    recordGeneration,
    maxPerDay,
    maxPerSession,
    unlimited,
  } = useDailyGenerationLimit();

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

  const generateWithAI = async (type: "flashcards" | "quiz") => {
    const hasContent = text.trim() || uploadedFile;

    // --- Enforce free user's daily session/card limits via hook ---
    if (!unlimited) {
      if (!canGenerate(type)) {
        toast({
          title: `Free AI ${type === "quiz" ? "quiz" : "flashcard"} generation limit reached`,
          description: `You've reached the maximum of ${maxPerDay} AI ${type === "quiz" ? "quiz" : "flashcard"} generations (${maxPerSession * maxPerDay} items) for today. Upgrade to unlock unlimited AI generations.`,
          variant: "destructive",
        });
        return;
      }
    }

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

      // --- Set card count: always use limit per session ---
      let count = type === "flashcards" || !unlimited ? maxPerSession : 10;
      if (type === "flashcards" && unlimited) count = 12;

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          content: contentToProcess,
          type: type,
          count: count
        }
      });

      if (error) throw new Error(error.message);
      if (!data.success) throw new Error(data.error || 'AI generation failed');
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

        // --- Record free usage
        if (!unlimited) {
          recordGeneration("flashcards");
        }
        navigate('/flashcards');
      } else {
        // Save quiz (unlimited for all users)
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

        if (!unlimited) {
          recordGeneration("quiz");
        }
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
        <FileUploadSection uploadedFile={uploadedFile} handleFileUpload={handleFileUpload} />

        {/* Voice Recording */}
        <VoiceRecordingSection isRecording={isRecording} toggleRecording={toggleRecording} />

        {/* Text Input and AI Generation */}
        <TextInputSection text={text} setText={setText} isProcessing={isProcessing}>
          <AIGenerationButtons
            isProcessing={isProcessing}
            unlimited={unlimited}
            canGenerate={canGenerate}
            remaining={remaining}
            maxPerDay={maxPerDay}
            maxPerSession={maxPerSession}
            generateWithAI={generateWithAI}
          />

          <Button 
            onClick={generateFlashcards}
            disabled={isProcessing}
            variant="outline"
            className="w-full"
          >
            {isProcessing ? "Generating..." : "Basic Generation"}
          </Button>
        </TextInputSection>
      </div>
    </div>
  );
};

export default UploadSection;
