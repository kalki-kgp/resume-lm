'use client';

import { Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TEMPLATE_METADATA, TEMPLATE_ORDER, TemplateId } from "../preview/templates/template-config";
import { Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateSelectorPanelProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
}

export function TemplateSelectorPanel({
  resume,
  onResumeChange,
}: TemplateSelectorPanelProps) {
  const selectedTemplate = resume.template_id || 'default';

  const handleTemplateSelect = (templateId: TemplateId) => {
    onResumeChange('template_id', templateId);
  };

  return (
    <div className="h-full w-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <h3 className="font-semibold text-lg text-gray-800">Templates</h3>
        <p className="text-xs text-gray-600 mt-1">Choose a resume template</p>
      </div>

      {/* Template List */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {TEMPLATE_ORDER.map((templateId) => {
              const template = TEMPLATE_METADATA[templateId];
              const isSelected = selectedTemplate === templateId;

              return (
                <button
                  key={templateId}
                  onClick={() => handleTemplateSelect(templateId)}
                  className={cn(
                    "w-full group relative overflow-hidden rounded-lg border-2 transition-all duration-200",
                    "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  {/* Preview Image */}
                  <div className="aspect-[8.5/11] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                    <TemplatePreviewIcon templateId={templateId} />

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 shadow-md animate-in zoom-in-50 duration-200">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-3 text-left">
                    <h4 className={cn(
                      "font-semibold text-sm transition-colors",
                      isSelected ? "text-blue-700" : "text-gray-800"
                    )}>
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {template.description}
                    </p>
                  </div>

                  {/* Hover Overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    "pointer-events-none"
                  )} />
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// Template Preview Icons
function TemplatePreviewIcon({ templateId }: { templateId: TemplateId }) {
  const iconProps = {
    className: "w-full h-full p-4",
    viewBox: "0 0 100 130",
  };

  switch (templateId) {
    case 'default':
      return (
        <svg {...iconProps}>
          {/* Header */}
          <rect x="10" y="10" width="80" height="15" fill="#1f2937" rx="1" />
          <rect x="10" y="28" width="60" height="3" fill="#6b7280" rx="0.5" />

          {/* Section 1 */}
          <rect x="10" y="40" width="80" height="2" fill="#1f2937" rx="0.5" />
          <rect x="10" y="45" width="75" height="2" fill="#9ca3af" rx="0.5" />
          <rect x="10" y="49" width="70" height="2" fill="#9ca3af" rx="0.5" />

          {/* Section 2 */}
          <rect x="10" y="58" width="80" height="2" fill="#1f2937" rx="0.5" />
          <rect x="10" y="63" width="80" height="2" fill="#9ca3af" rx="0.5" />
          <rect x="10" y="67" width="75" height="2" fill="#9ca3af" rx="0.5" />
          <rect x="10" y="71" width="65" height="2" fill="#9ca3af" rx="0.5" />

          {/* Section 3 */}
          <rect x="10" y="80" width="80" height="2" fill="#1f2937" rx="0.5" />
          <rect x="10" y="85" width="70" height="2" fill="#9ca3af" rx="0.5" />
          <rect x="10" y="89" width="75" height="2" fill="#9ca3af" rx="0.5" />
        </svg>
      );

    case 'modern':
      return (
        <svg {...iconProps}>
          {/* Header with accent */}
          <rect x="10" y="10" width="80" height="18" fill="#3b82f6" rx="2" />
          <rect x="15" y="14" width="50" height="3" fill="white" rx="0.5" />
          <rect x="15" y="20" width="35" height="2" fill="#dbeafe" rx="0.5" />

          {/* Section with left border */}
          <rect x="10" y="35" width="3" height="12" fill="#3b82f6" rx="0.5" />
          <rect x="16" y="36" width="65" height="2" fill="#1f2937" rx="0.5" />
          <rect x="16" y="41" width="70" height="2" fill="#9ca3af" rx="0.5" />

          {/* Section 2 with left border */}
          <rect x="10" y="54" width="3" height="18" fill="#3b82f6" rx="0.5" />
          <rect x="16" y="55" width="60" height="2" fill="#1f2937" rx="0.5" />
          <rect x="16" y="60" width="75" height="2" fill="#9ca3af" rx="0.5" />
          <rect x="16" y="64" width="70" height="2" fill="#9ca3af" rx="0.5" />

          {/* Section 3 with left border */}
          <rect x="10" y="79" width="3" height="15" fill="#3b82f6" rx="0.5" />
          <rect x="16" y="80" width="55" height="2" fill="#1f2937" rx="0.5" />
          <rect x="16" y="85" width="65" height="2" fill="#9ca3af" rx="0.5" />
        </svg>
      );

    case 'classic':
      return (
        <svg {...iconProps}>
          {/* Header bar */}
          <rect x="10" y="10" width="80" height="12" fill="#1e40af" rx="1" />
          <rect x="30" y="13" width="40" height="2" fill="white" rx="0.5" />
          <rect x="35" y="17" width="30" height="1.5" fill="#dbeafe" rx="0.5" />

          {/* Sidebar */}
          <rect x="10" y="27" width="25" height="90" fill="#f3f4f6" rx="1" />
          <rect x="12" y="30" width="21" height="2" fill="#1e40af" rx="0.5" />
          <rect x="12" y="34" width="18" height="1.5" fill="#6b7280" rx="0.5" />
          <rect x="12" y="37" width="19" height="1.5" fill="#6b7280" rx="0.5" />

          <rect x="12" y="44" width="21" height="2" fill="#1e40af" rx="0.5" />
          <rect x="12" y="48" width="15" height="1.5" fill="#6b7280" rx="0.5" />
          <rect x="12" y="51" width="17" height="1.5" fill="#6b7280" rx="0.5" />

          {/* Main content */}
          <rect x="39" y="30" width="48" height="2" fill="#1e40af" rx="0.5" />
          <rect x="39" y="35" width="45" height="1.5" fill="#9ca3af" rx="0.5" />
          <rect x="39" y="38" width="43" height="1.5" fill="#9ca3af" rx="0.5" />

          <rect x="39" y="45" width="48" height="2" fill="#1e40af" rx="0.5" />
          <rect x="39" y="50" width="42" height="1.5" fill="#9ca3af" rx="0.5" />
          <rect x="39" y="53" width="46" height="1.5" fill="#9ca3af" rx="0.5" />
        </svg>
      );

    case 'minimalist':
      return (
        <svg {...iconProps}>
          {/* Minimalist header */}
          <rect x="15" y="15" width="70" height="3" fill="#000000" rx="0.5" />
          <line x1="15" y1="21" x2="85" y2="21" stroke="#000000" strokeWidth="0.5" />
          <rect x="15" y="24" width="50" height="1.5" fill="#666666" rx="0.5" />

          {/* Section 1 - minimal */}
          <rect x="15" y="35" width="30" height="2" fill="#000000" rx="0.5" />
          <rect x="15" y="40" width="70" height="1.5" fill="#999999" rx="0.5" />
          <rect x="15" y="43" width="65" height="1.5" fill="#999999" rx="0.5" />
          <rect x="15" y="46" width="60" height="1.5" fill="#999999" rx="0.5" />

          {/* Section 2 - minimal */}
          <rect x="15" y="56" width="30" height="2" fill="#000000" rx="0.5" />
          <rect x="15" y="61" width="68" height="1.5" fill="#999999" rx="0.5" />
          <rect x="15" y="64" width="72" height="1.5" fill="#999999" rx="0.5" />
          <rect x="15" y="67" width="58" height="1.5" fill="#999999" rx="0.5" />

          {/* Section 3 - minimal */}
          <rect x="15" y="77" width="30" height="2" fill="#000000" rx="0.5" />
          <rect x="15" y="82" width="65" height="1.5" fill="#999999" rx="0.5" />
          <rect x="15" y="85" width="70" height="1.5" fill="#999999" rx="0.5" />
        </svg>
      );

    default:
      return null;
  }
}

