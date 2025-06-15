
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';

interface FileUploadSectionProps {
  uploadedFile: File | null;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ uploadedFile, handleFileUpload }) => (
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
);

export default FileUploadSection;
