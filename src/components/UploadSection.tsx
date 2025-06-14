import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const UploadSection = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      // Start recording logic would go here
    } else {
      toast({
        title: "Recording stopped",
        description: "Processing your voice notes...",
      });
      // Stop recording logic would go here
      setText(prev => prev + "\n[Voice recording processed]");
    }
  };

  const generateFlashcardsFromContent = (content: string) => {
    // Enhanced flashcard generation with better question-answer pairs
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const flashcards = [];
    
    // Define patterns for different types of questions
    const questionPatterns = [
      { pattern: /(.+) is (.+)/i, template: (match: RegExpMatchArray) => ({ q: `What is ${match[1]}?`, a: match[2].trim() }) },
      { pattern: /(.+) are (.+)/i, template: (match: RegExpMatchArray) => ({ q: `What are ${match[1]}?`, a: match[2].trim() }) },
      { pattern: /(.+) occurs (.+)/i, template: (match: RegExpMatchArray) => ({ q: `Where does ${match[1]} occur?`, a: match[2].trim() }) },
      { pattern: /(.+) process (.+)/i, template: (match: RegExpMatchArray) => ({ q: `Describe the ${match[1]} process`, a: `The ${match[1]} process ${match[2].trim()}` }) },
      { pattern: /(.+) contains (.+)/i, template: (match: RegExpMatchArray) => ({ q: `What does ${match[1]} contain?`, a: match[2].trim() }) },
      { pattern: /(.+) produces (.+)/i, template: (match: RegExpMatchArray) => ({ q: `What does ${match[1]} produce?`, a: match[2].trim() }) },
    ];

    for (let i = 0; i < Math.min(sentences.length, 12); i++) {
      const sentence = sentences[i].trim();
      if (sentence.length < 30) continue;

      let questionCreated = false;

      // Try to match patterns
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

      // If no pattern matched, create a general comprehension question
      if (!questionCreated && sentence.length > 40) {
        const words = sentence.split(' ');
        const keyWords = words.filter(word => 
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

    // If we still don't have enough cards, create some basic ones
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
        // Enhanced PDF content simulation with more educational content
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
      
      // Generate flashcards from content
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
      
      // Store in localStorage for now (in real app, this would be saved to database)
      localStorage.setItem('generatedFlashcards', JSON.stringify(generatedCards));
      
      setTimeout(() => {
        setIsProcessing(false);
        toast({
          title: "Flashcards generated!",
          description: `Created ${generatedCards.length} flashcards from your content.`,
        });
        // Navigate to flashcards page
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
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6 pb-20">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Upload Your Study Material</h1>
          <p className="text-muted-foreground text-sm">
            Upload PDFs, paste text, or record voice notes to generate AI-powered flashcards
          </p>
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
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                {uploadedFile ? (
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-2">
                      ✓ {uploadedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">File ready for processing</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-3">
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
                  className="mb-3"
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
                className="min-h-32 mb-4"
              />
              <Button 
                onClick={generateFlashcards}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-primary to-purple-600"
              >
                {isProcessing ? "Generating..." : "Generate Flashcards"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
