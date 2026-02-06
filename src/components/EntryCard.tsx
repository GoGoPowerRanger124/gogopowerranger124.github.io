import { TimetableEntry, formatTime } from '@/types/timetable';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EntryCardProps {
  entry: TimetableEntry;
  onEdit: (entry: TimetableEntry) => void;
  onDelete: (id: string) => void;
}

const colorClasses: Record<TimetableEntry['color'], string> = {
  math: 'border-l-entry-math bg-blue-50/50 dark:bg-blue-950/20',
  english: 'border-l-entry-english bg-pink-50/50 dark:bg-pink-950/20',
  science: 'border-l-entry-science bg-green-50/50 dark:bg-green-950/20',
  history: 'border-l-entry-history bg-orange-50/50 dark:bg-orange-950/20',
  default: 'border-l-entry-default bg-accent/50',
};

const dotClasses: Record<TimetableEntry['color'], string> = {
  math: 'bg-entry-math',
  english: 'bg-entry-english',
  science: 'bg-entry-science',
  history: 'bg-entry-history',
  default: 'bg-entry-default',
};

export function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-lg border-l-4 p-3 shadow-soft transition-all duration-200 hover:shadow-lifted animate-slide-up',
        colorClasses[entry.color]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('w-2 h-2 rounded-full', dotClasses[entry.color])} />
            <h4 className="font-semibold text-foreground truncate">{entry.subject}</h4>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            {formatTime(entry.hour, entry.minute)} - {formatTime(entry.endHour, entry.endMinute)}
          </p>
          {entry.homework && (
            <div className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
              <BookOpen className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{entry.homework}</span>
            </div>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(entry)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
