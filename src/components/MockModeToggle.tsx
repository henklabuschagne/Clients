import { FlaskConical } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

export function MockModeToggle() {
  // The new architecture always uses the centralized appStore with mock data.
  // This component is kept for UI consistency but the toggle is no longer needed.
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors">
          <FlaskConical className="w-3.5 h-3.5 text-brand-warning" />
          <span className="text-xs text-brand-warning">Mock</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-md border border-amber-200">
            <FlaskConical className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-900">
              <div className="font-medium mb-1">Mock Mode Active</div>
              <ul className="list-disc list-inside space-y-0.5 text-amber-700">
                <li>All data is simulated via appStore</li>
                <li>No backend connection required</li>
                <li>Full CRUD operations supported</li>
                <li>Data persists in localStorage</li>
              </ul>
            </div>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Use the DevApiPanel (bottom-right) to inspect store state and API calls.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}