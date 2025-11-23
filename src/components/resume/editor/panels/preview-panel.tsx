'use client';

import { Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ResumePreview } from "../preview/resume-preview";
import CoverLetter from "@/components/cover-letter/cover-letter";
import { ResumeContextMenu } from "../preview/resume-context-menu";

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
  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden">
      <div className={cn(
        "flex-1 min-h-0 overflow-y-auto overflow-x-hidden",
        resume.is_base_resume
          ? "bg-purple-50/30"
          : "bg-pink-50/60 shadow-sm shadow-pink-200/20"
      )}>
        <div className="p-4 flex justify-center">
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
      </div>
    </div>
  );
} 