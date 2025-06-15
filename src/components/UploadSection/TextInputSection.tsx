
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface TextInputSectionProps {
  text: string;
  setText: (t: string) => void;
  isProcessing: boolean;
}

const TextInputSection: React.FC<TextInputSectionProps> = ({
  text,
  setText,
  isProcessing,
  children,
}) => (
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
        disabled={isProcessing}
      />
      {children}
    </CardContent>
  </Card>
);

export default TextInputSection;
