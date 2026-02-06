import { TimetableEntry, formatHour } from '@/types/timetable';
import { EntryCard } from './EntryCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSlotProps {
  hour: number;
  entries: TimetableEntry[];
  onAddEntry: (hour: number) => void;
  onEditEntry: (entry: TimetableEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export function TimeSlot({ hour, entries, onAddEntry, onEditEntry, onDeleteEntry }: TimeSlotProps) {
  const isCurrentHour = new Date().getHours() === hour;

  return (
    <div
      className={cn(
        'group flex gap-4 py-3 px-4 border-b border-border/50 transition-colors duration-200',
        isCurrentHour && 'bg-accent/30'
      )}
    >
      <div className="w-20 flex-shrink-0 pt-1">
        <span
          className={cn(
            'text-sm font-mono',
            isCurrentHour ? 'text-primary font-semibold' : 'text-time-text'
          )}
        >
          {formatHour(hour)}
        </span>
        {isCurrentHour && (
          <div className="flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary font-medium">Now</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {entries.length > 0 ? (
          <div className="space-y-2">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={onEditEntry}
                onDelete={onDeleteEntry}
              />
            ))}
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full h-12 border border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-accent/50 opacity-0 group-hover:opacity-100 transition-all"
            onClick={() => onAddEntry(hour)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add entry
          </Button>
        )}
      </div>
    </div>
  );
}
