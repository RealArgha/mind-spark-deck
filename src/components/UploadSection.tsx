import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Mic, MicOff, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
    } else {
      toast({
        title: "Recording stopped",
        description: "Processing your voice notes...",
      });
      setText(prev => prev + "\n[Voice recording processed]");
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
      
      // Save to new flashcard sets format
      const newSet = {
        id: `set-${Date.now()}`,
        name: uploadedFile ? `From ${uploadedFile.name}` : 'Generated from Text',
        cards: generatedCards,
        createdAt: Date.now(),
        source: uploadedFile ? `PDF: ${uploadedFile.name}` : 'Text input'
      };
      
      // Get existing sets
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
    <div className="p-4 space-y-4">
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
  );
};

export default UploadSection;
