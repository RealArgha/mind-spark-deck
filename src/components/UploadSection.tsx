
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
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Flashcards generated!",
        description: "Your study materials are ready for review.",
      });
      // Navigate to flashcards page
      navigate('/flashcards');
    }, 2000);
  };

  return (
    <div className="p-4 space-y-6">
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
