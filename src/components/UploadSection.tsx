
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UploadSection = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        toast({
          title: "PDF uploaded!",
          description: "We'll process your PDF and generate flashcards shortly.",
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
    }
  };

  const generateFlashcards = async () => {
    if (!text.trim()) {
      toast({
        title: "No content to process",
        description: "Please enter some text or upload a file first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Flashcards generated!",
        description: "Your study materials are ready for review.",
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Your Study Material</h1>
        <p className="text-muted-foreground">
          Upload PDFs, paste text, or record voice notes to generate AI-powered flashcards
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
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
                <Button variant="outline" className="cursor-pointer">
                  Choose File
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Voice Recording */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
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
                className="mb-4"
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
      </div>

      {/* Text Input */}
      <Card>
        <CardHeader>
          <CardTitle>Or Paste Your Text</CardTitle>
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
  );
};

export default UploadSection;
