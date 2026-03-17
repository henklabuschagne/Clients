import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  storageKey?: string;
}

export function OnboardingTour({ 
  steps, 
  onComplete, 
  storageKey = 'onboarding-completed' 
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(storageKey);
    if (!hasCompletedOnboarding) {
      setIsVisible(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isVisible) return;

    const updatePosition = () => {
      const step = steps[currentStep];
      const target = document.querySelector(step.target);
      
      if (target) {
        const rect = target.getBoundingClientRect();
        const placement = step.placement || 'bottom';
        
        let top = 0;
        let left = 0;

        switch (placement) {
          case 'top':
            top = rect.top - 200;
            left = rect.left + rect.width / 2 - 150;
            break;
          case 'bottom':
            top = rect.bottom + 10;
            left = rect.left + rect.width / 2 - 150;
            break;
          case 'left':
            top = rect.top + rect.height / 2 - 100;
            left = rect.left - 310;
            break;
          case 'right':
            top = rect.top + rect.height / 2 - 100;
            left = rect.right + 10;
            break;
        }

        setPosition({ top, left });

        // Highlight target element
        target.classList.add('onboarding-highlight');
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      
      // Remove highlight from all elements
      document.querySelectorAll('.onboarding-highlight').forEach(el => {
        el.classList.remove('onboarding-highlight');
      });
    };
  }, [currentStep, isVisible, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[100]" onClick={handleSkip} />

      {/* Tour Card */}
      <Card
        className="fixed z-[101] w-80 shadow-2xl"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.content}</p>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 ml-2"
              aria-label="Skip tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {currentStep + 1} of {steps.length}
            </div>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button onClick={handlePrevious} variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              <Button onClick={handleNext} size="sm">
                {currentStep < steps.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  'Finish'
                )}
              </Button>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom styles */}
      <style>{`
        .onboarding-highlight {
          position: relative;
          z-index: 101;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}

// Predefined tour steps for the application
export const mainAppTourSteps: TourStep[] = [
  {
    target: '[data-tour="client-list"]',
    title: 'Welcome to Client Management!',
    content: 'This is your client list. Search and select any client to view their details.',
    placement: 'right',
  },
  {
    target: '[data-tour="client-header"]',
    title: 'Client Information',
    content: 'View client details and copy the Finnivo installation link from here.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="sections"]',
    title: 'Expandable Sections',
    content: 'All client information is organized into collapsible sections. Click to expand or collapse.',
    placement: 'top',
  },
  {
    target: '[data-tour="pin-button"]',
    title: 'Pin Important Sections',
    content: 'Pin frequently used sections to keep them at the top for quick access.',
    placement: 'left',
  },
  {
    target: '[data-tour="keyboard-shortcuts"]',
    title: 'Keyboard Shortcuts',
    content: 'Use keyboard shortcuts for faster navigation. Press ? to see all available shortcuts.',
    placement: 'top',
  },
];
