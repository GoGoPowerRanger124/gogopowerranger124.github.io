import { useState, useCallback, useEffect } from 'react';
import { TimetableEntry, TimetableData } from '@/types/timetable';
import { TimeSlot } from '@/components/TimeSlot';
import { AddEntryDialog } from '@/components/AddEntryDialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Plus, 
  Download, 
  Upload, 
  Clock,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const STORAGE_KEY = 'digital-organizer-timetable';

const Index = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(9);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data: TimetableData = JSON.parse(saved);
        setEntries(data.entries);
      } catch (e) {
        console.error('Failed to load saved data');
      }
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    const data: TimetableData = {
      entries,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [entries]);

  const handleAddEntry = useCallback((hour: number) => {
    setSelectedHour(hour);
    setEditingEntry(null);
    setDialogOpen(true);
  }, []);

  const handleEditEntry = useCallback((entry: TimetableEntry) => {
    setEditingEntry(entry);
    setSelectedHour(entry.hour);
    setDialogOpen(true);
  }, []);

  const handleDeleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success('Entry deleted');
  }, []);

  const handleSaveEntry = useCallback(
    (entryData: Omit<TimetableEntry, 'id'> | TimetableEntry) => {
      if ('id' in entryData && entryData.id) {
        // Editing existing
        setEntries((prev) =>
          prev.map((e) => (e.id === entryData.id ? (entryData as TimetableEntry) : e))
        );
        toast.success('Entry updated');
      } else {
        // Adding new
        const newEntry: TimetableEntry = {
          ...entryData,
          id: crypto.randomUUID(),
        } as TimetableEntry;
        setEntries((prev) => [...prev, newEntry]);
        toast.success('Entry added');
      }
    },
    []
  );

  const handleExportJSON = useCallback(() => {
    const data: TimetableData = {
      entries,
      lastUpdated: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Timetable exported');
  }, [entries]);

  const handleImportJSON = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data: TimetableData = JSON.parse(event.target?.result as string);
          if (data.entries && Array.isArray(data.entries)) {
            setEntries(data.entries);
            toast.success('Timetable imported');
          } else {
            toast.error('Invalid file format');
          }
        } catch {
          toast.error('Failed to parse file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const handleClearAll = useCallback(() => {
    setEntries([]);
    toast.success('All entries cleared');
  }, []);

  const getEntriesForHour = useCallback(
    (hour: number) => entries.filter((e) => e.hour === hour),
    [entries]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Digital Organizer</h1>
                <p className="text-sm text-muted-foreground">
                  Plan your day, track your tasks
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImportJSON}
                className="hidden sm:flex"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJSON}
                className="hidden sm:flex"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="hidden sm:flex text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button onClick={() => handleAddEntry(new Date().getHours())}>
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-card shadow-soft border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Total Entries</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{entries.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-card shadow-soft border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">With Homework</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {entries.filter((e) => e.homework).length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card shadow-soft border border-border/50 hidden sm:block">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span className="w-2 h-2 rounded-full bg-entry-math" />
              <span className="text-xs font-medium uppercase tracking-wide">Math Classes</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {entries.filter((e) => e.color === 'math').length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card shadow-soft border border-border/50 hidden sm:block">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span className="w-2 h-2 rounded-full bg-entry-english" />
              <span className="text-xs font-medium uppercase tracking-wide">English Classes</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {entries.filter((e) => e.color === 'english').length}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="container mx-auto px-4 pb-4 flex gap-2 sm:hidden">
        <Button variant="outline" size="sm" onClick={handleImportJSON} className="flex-1">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportJSON} className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={handleClearAll} className="text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Timetable */}
      <main className="container mx-auto px-4 pb-8">
        <div className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
            <h2 className="font-semibold text-foreground">Daily Schedule</h2>
            <p className="text-sm text-muted-foreground">24-hour view • Hover to add entries</p>
          </div>
          <ScrollArea className="h-[calc(100vh-380px)] min-h-[400px]">
            <div>
              {HOURS.map((hour) => (
                <TimeSlot
                  key={hour}
                  hour={hour}
                  entries={getEntriesForHour(hour)}
                  onAddEntry={handleAddEntry}
                  onEditEntry={handleEditEntry}
                  onDeleteEntry={handleDeleteEntry}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <AddEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveEntry}
        initialHour={selectedHour}
        editEntry={editingEntry}
      />
    </div>
  );
};

export default Index;
