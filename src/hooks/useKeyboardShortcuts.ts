import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const metaMatch = shortcut.meta ? event.metaKey : true;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [handleKeyPress, enabled]);

  return shortcuts;
}

// Common keyboard shortcuts
export const commonShortcuts = {
  search: (action: () => void): KeyboardShortcut => ({
    key: 'k',
    ctrl: true,
    description: 'Search',
    action,
  }),
  escape: (action: () => void): KeyboardShortcut => ({
    key: 'Escape',
    description: 'Close',
    action,
  }),
  save: (action: () => void): KeyboardShortcut => ({
    key: 's',
    ctrl: true,
    description: 'Save',
    action,
  }),
  newItem: (action: () => void): KeyboardShortcut => ({
    key: 'n',
    ctrl: true,
    description: 'New item',
    action,
  }),
  delete: (action: () => void): KeyboardShortcut => ({
    key: 'Delete',
    description: 'Delete',
    action,
  }),
  edit: (action: () => void): KeyboardShortcut => ({
    key: 'e',
    ctrl: true,
    description: 'Edit',
    action,
  }),
  help: (action: () => void): KeyboardShortcut => ({
    key: '?',
    shift: true,
    description: 'Show help',
    action,
  }),
  nextItem: (action: () => void): KeyboardShortcut => ({
    key: 'ArrowDown',
    description: 'Next item',
    action,
  }),
  previousItem: (action: () => void): KeyboardShortcut => ({
    key: 'ArrowUp',
    description: 'Previous item',
    action,
  }),
};
