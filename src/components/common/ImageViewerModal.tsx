"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Download,
  Maximize,
  Minimize,
} from "lucide-react";
import { TooltipProvider } from "./TooltipProvider";

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileAlt?: string;
  title?: string;
  description?: string;
  fileType?: 'image' | 'pdf';
}

export default function ImageViewerModal({
  isOpen,
  onClose,
  fileUrl,
  fileAlt = "File",
  title = "File Viewer",
  description = "View and interact with the file",
  fileType,
}: ImageViewerModalProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Auto-detect file type if not provided
  const detectedFileType = fileType || (fileUrl.toLowerCase().includes('.pdf') ? 'pdf' : 'image');
  const isPdf = detectedFileType === 'pdf';

  // Reset transformations when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setIsFullscreen(false);
    }
  }, [isOpen]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.25));
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileAlt || (isPdf ? "document.pdf" : "image");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      // Optionally handle error
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1 && !isPdf) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1 && !isPdf) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isPdf) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${
          isFullscreen
            ? "max-w-[100vw] max-h-[100vh] w-full h-full p-0 rounded-none"
            : "max-w-6xl max-h-[90vh] w-full"
        } overflow-hidden flex flex-col`}
      >
        <DialogHeader className={`flex-shrink-0 ${isFullscreen ? "p-4" : ""}`}>
          <div className="flex md:flex-row flex-col items-center justify-between">
            <DialogTitle className="text-lg w-full text-left font-semibold">
              {title}
              <DialogDescription className="!text-sm text-left mb-0 text-muted-foreground">
                {description}
              </DialogDescription>
            </DialogTitle>

            <div className="flex items-center gap-1">
              {!isPdf && (
                <>
                  <TooltipProvider
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleZoomOut}
                        disabled={scale <= 0.25}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                    }
                    content="Zoom Out"
                  />
                  <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <TooltipProvider
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleZoomIn}
                        disabled={scale >= 5}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    }
                    content={"Zoom In"}
                  />

                  <TooltipProvider
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRotateLeft}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    }
                    content={"Rotate Left"}
                  />

                  <TooltipProvider
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRotateRight}
                      >
                        <RotateCw className="w-4 h-4" />
                      </Button>
                    }
                    content={"Rotate Right"}
                  />
                </>
              )}

              <TooltipProvider
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </Button>
                }
                content={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              />

              <TooltipProvider
                trigger={
                  <Button variant="ghost" size="icon" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                  </Button>
                }
                content={"Download"}
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                title="Reset"
                className="text-xs px-2"
                disabled={isPdf}
              >
                Reset
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div
          className="flex-1 flex items-center justify-center bg-black/5 relative overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            cursor: !isPdf && scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
        >
          {isPdf ? (
            <iframe
              src={fileUrl}
              title={fileAlt}
              className="w-full h-full border-0"
              style={{ minHeight: '600px' }}
            />
          ) : (
            <div
              className="relative transition-transform duration-200 ease-out"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
              }}
            >
              <img
                src={fileUrl}
                alt={fileAlt}
                width={800}
                height={600}
                className="h-full max-w-full max-h-full object-contain select-none"
              />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div
          className={`hidden md:block flex-shrink-0 bg-gray-50 border-t px-4 py-2 text-xs text-muted-foreground ${
            isFullscreen ? "block" : "hidden md:block"
          }`}
        >
          <div className="flex items-center justify-center gap-6">
            {isPdf ? (
              <>
                <span>PDF Document</span>
                <span>Use browser controls to navigate</span>
                <span>ESC: Close</span>
              </>
            ) : (
              <>
                <span>Mouse wheel: Zoom</span>
                <span>Click & drag: Pan (when zoomed)</span>
                <span>ESC: Close</span>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
