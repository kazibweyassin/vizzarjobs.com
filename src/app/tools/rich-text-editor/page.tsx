"use client";

import { useState } from 'react';
import { RichTextEditor } from '~/components/RichTextEditor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { FileText, Eye, Code, Download } from 'lucide-react';

export default function RichTextEditorDemo() {
  const [content, setContent] = useState(`
    <h1>Welcome to VizzarJobs</h1>
    <p>We're transforming the way <strong>tech professionals</strong> find their dream jobs with <em>AI-powered matching</em>.</p>
    
    <h2>Our Features</h2>
    <ul>
      <li>AI-powered job matching</li>
      <li>Real-time market insights</li>
      <li>Smart resume analysis</li>
      <li>Professional networking</li>
    </ul>
    
    <blockquote>
      <p>"The future of tech recruitment is here."</p>
    </blockquote>
    
    <h3>Get Started Today</h3>
    <p>Join thousands of professionals who have found their perfect match:</p>
    <ol>
      <li>Create your profile</li>
      <li>Upload your resume</li>
      <li>Get matched with opportunities</li>
      <li>Land your dream job</li>
    </ol>
    
    <p>Ready to start? <a href="/signup">Sign up now</a>!</p>
  `);
  
  const [previewMode, setPreviewMode] = useState<'editor' | 'preview' | 'html'>('editor');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Rich Text Editor
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Create beautifully formatted content for job descriptions, company profiles, and more
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <FileText className="w-4 h-4 mr-1" />
              Professional Formatting
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Code className="w-4 h-4 mr-1" />
              HTML Output
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Eye className="w-4 h-4 mr-1" />
              Live Preview
            </Badge>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={previewMode === 'editor' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('editor')}
              className="mr-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              Editor
            </Button>
            <Button
              variant={previewMode === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('preview')}
              className="mr-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant={previewMode === 'html' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('html')}
            >
              <Code className="w-4 h-4 mr-2" />
              HTML
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor/Preview */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {previewMode === 'editor' && <FileText className="w-5 h-5" />}
                {previewMode === 'preview' && <Eye className="w-5 h-5" />}
                {previewMode === 'html' && <Code className="w-5 h-5" />}
                {previewMode === 'editor' ? 'Rich Text Editor' : 
                 previewMode === 'preview' ? 'Live Preview' : 'HTML Source'}
              </CardTitle>
              <CardDescription>
                {previewMode === 'editor' && 'Create and format your content with professional tools'}
                {previewMode === 'preview' && 'See how your content will appear to users'}
                {previewMode === 'html' && 'View the generated HTML markup'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {previewMode === 'editor' && (
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Start typing your content here..."
                  height={400}
                />
              )}
              
              {previewMode === 'preview' && (
                <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              )}
              
              {previewMode === 'html' && (
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    <code>{content}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features & Usage */}
          <div className="space-y-6">
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Editor Features</CardTitle>
                <CardDescription>
                  Professional formatting tools for all your content needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Text Formatting</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Bold, Italic, Underline</li>
                      <li>• Strikethrough, Code</li>
                      <li>• Text colors & styles</li>
                      <li>• Font families</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Structure</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Headings (H1-H3)</li>
                      <li>• Bullet & numbered lists</li>
                      <li>• Blockquotes</li>
                      <li>• Text alignment</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Media</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Image insertion</li>
                      <li>• Link creation</li>
                      <li>• Responsive images</li>
                      <li>• External links</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Editing</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Undo/Redo</li>
                      <li>• Keyboard shortcuts</li>
                      <li>• Auto-save</li>
                      <li>• HTML export</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Examples */}
            <Card>
              <CardHeader>
                <CardTitle>Perfect For</CardTitle>
                <CardDescription>
                  Use cases where professional formatting matters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Job Descriptions</h4>
                      <p className="text-sm text-gray-600">Create detailed, well-formatted job postings with requirements, benefits, and company culture.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Company Profiles</h4>
                      <p className="text-sm text-gray-600">Showcase your company with rich descriptions, mission statements, and team information.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Career Resources</h4>
                      <p className="text-sm text-gray-600">Write comprehensive guides, tutorials, and industry insights with professional formatting.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Blog Posts</h4>
                      <p className="text-sm text-gray-600">Create engaging content with proper headings, lists, quotes, and media integration.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    const blob = new Blob([content], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'content.html';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download HTML
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigator.clipboard.writeText(content)}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Copy HTML
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setContent('')}
                >
                  Clear Content
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
