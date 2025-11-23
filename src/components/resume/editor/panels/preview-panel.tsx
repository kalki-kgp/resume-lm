'use client';

import { Resume } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ResumePreview } from "../preview/resume-preview";
import CoverLetter from "@/components/cover-letter/cover-letter";
import { ResumeContextMenu } from "../preview/resume-context-menu";
import { TemplateSelector } from "../preview/template-selector";
import { TemplateId } from "../preview/templates/template-config";

interface PreviewPanelProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  width: number;
  // percentWidth: number;
}

export function PreviewPanel({
  resume,
  onResumeChange,
  width
}: PreviewPanelProps) {
  const handleTemplateSelect = (templateId: TemplateId) => {
    onResumeChange('template_id', templateId);
  };

  return (
    <div className="relative h-full">
      <ScrollArea className={cn(
        " z-50     bg-red-500 h-full",
        resume.is_base_resume
          ? "bg-purple-50/30"
          : "bg-pink-50/60 shadow-sm shadow-pink-200/20"
      )}>
        <div className="">
        <ResumeContextMenu resume={resume}>
            <ResumePreview resume={resume} containerWidth={width} />
          </ResumeContextMenu>
        </div>

        <CoverLetter
          // resumeId={resume.id}
          // hasCoverLetter={resume.has_cover_letter}
          // coverLetterData={resume.cover_letter}
          containerWidth={width}
          // onCoverLetterChange={(data: Record<string, unknown>) => {
          //   if ('has_cover_letter' in data) {
          //     onResumeChange('has_cover_letter', data.has_cover_letter as boolean);
          //   }
          //   if ('cover_letter' in data) {
          //     onResumeChange('cover_letter', data.cover_letter as Record<string, unknown>);
          //   }
          // }}
        />
      </ScrollArea>

      {/* Template Selector */}
      <TemplateSelector
        selectedTemplate={resume.template_id || 'default'}
        onTemplateSelect={handleTemplateSelect}
        containerWidth={width}
      />
    </div>
  );
} 