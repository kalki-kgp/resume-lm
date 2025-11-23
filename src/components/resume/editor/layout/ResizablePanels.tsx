import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ReactNode, useRef, useState, useEffect } from "react";

interface ResizablePanelsProps {
  isBaseResume: boolean;
  editorPanel: ReactNode;
  previewPanel: (width: number) => ReactNode;
  templateSelectorPanel: ReactNode;
}

export function ResizablePanels({
  isBaseResume,
  editorPanel,
  previewPanel,
  templateSelectorPanel
}: ResizablePanelsProps) {
  const [previewSize, setPreviewSize] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPercentageRef = useRef(50); // Store last percentage

  // Add function to calculate pixel width
  const updatePixelWidth = () => {
    const containerWidth = containerRef.current?.clientWidth || 0;
    const pixelWidth = Math.floor((containerWidth * lastPercentageRef.current) / 100);
    setPreviewSize(pixelWidth);
  };

  useEffect(() => {
    // Handle window resize
    const handleResize = () => updatePixelWidth();
    window.addEventListener('resize', handleResize);

    // Initial calculation
    updatePixelWidth();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="h-full relative">
      <ResizablePanelGroup
        direction="horizontal"
        className={cn(
          "relative h-full rounded-lg  ",
          isBaseResume
            ? "border-purple-200/40"
            : "border-pink-300/50"
        )}
      >
        {/* Editor Panel */}
        <ResizablePanel defaultSize={35} minSize={25} maxSize={60}>
          {editorPanel}
        </ResizablePanel>

        {/* Resize Handle */}
        <ResizableHandle 
          withHandle 
          className={cn(
            isBaseResume
              ? "bg-purple-100/50 hover:bg-purple-200/50"
              : "bg-pink-200/50 hover:bg-pink-300/50 shadow-sm shadow-pink-200/20"
          )}
        />

        {/* Preview Panel */}
        <ResizablePanel 
          defaultSize={50} 
          minSize={30} 
          maxSize={60}
          onResize={(size) => {
            lastPercentageRef.current = size; // Store current percentage
            updatePixelWidth();
          }}
          className={cn(
            "shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)] relative",
            isBaseResume
              ? "shadow-purple-200/50"
              : "shadow-pink-200/50"
          )}
        >
          {previewPanel(previewSize)}
        </ResizablePanel>

        {/* Resize Handle */}
        <ResizableHandle 
          withHandle 
          className={cn(
            isBaseResume
              ? "bg-purple-100/50 hover:bg-purple-200/50"
              : "bg-pink-200/50 hover:bg-pink-300/50 shadow-sm shadow-pink-200/20"
          )}
        />

        {/* Template Selector Panel */}
        <ResizablePanel defaultSize={15} minSize={10} maxSize={30}>
          {templateSelectorPanel}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}