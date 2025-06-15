
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface VoiceRecordingSectionProps {
  isRecording: boolean;
  toggleRecording: () => void;
}

const VoiceRecordingSection: React.FC<VoiceRecordingSectionProps> = ({
  isRecording,
  toggleRecording
}) => (
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
);

export default VoiceRecordingSection;
