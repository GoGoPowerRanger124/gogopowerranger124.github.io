import { useState, useEffect } from 'react';
import { TimetableEntry, getSubjectColor } from '@/types/timetable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: Omit<TimetableEntry, 'id'> | TimetableEntry) => void;
  initialHour?: number;
  editEntry?: TimetableEntry | null;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

export function AddEntryDialog({
  open,
  onOpenChange,
  onSave,
  initialHour = 9,
  editEntry,
}: AddEntryDialogProps) {
  const [subject, setSubject] = useState('');
  const [startHour, setStartHour] = useState(initialHour);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(initialHour + 1);
  const [endMinute, setEndMinute] = useState(0);
  const [homework, setHomework] = useState('');

  useEffect(() => {
    if (editEntry) {
      setSubject(editEntry.subject);
      setStartHour(editEntry.hour);
      setStartMinute(editEntry.minute);
      setEndHour(editEntry.endHour);
      setEndMinute(editEntry.endMinute);
      setHomework(editEntry.homework || '');
    } else {
      setSubject('');
      setStartHour(initialHour);
      setStartMinute(0);
      setEndHour(Math.min(initialHour + 1, 23));
      setEndMinute(0);
      setHomework('');
    }
  }, [editEntry, initialHour, open]);

  const formatHourLabel = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const handleSave = () => {
    if (!subject.trim()) return;

    const entry = {
      ...(editEntry ? { id: editEntry.id } : {}),
      subject: subject.trim(),
      hour: startHour,
      minute: startMinute,
      endHour,
      endMinute,
      homework: homework.trim() || undefined,
      color: getSubjectColor(subject),
    };

    onSave(entry as TimetableEntry);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editEntry ? 'Edit Entry' : 'Add New Entry'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g., Mathematics, English, Science..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <div className="flex gap-2">
                <Select
                  value={startHour.toString()}
                  onValueChange={(v) => setStartHour(parseInt(v))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOURS.map((h) => (
                      <SelectItem key={h} value={h.toString()}>
                        {formatHourLabel(h)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={startMinute.toString()}
                  onValueChange={(v) => setStartMinute(parseInt(v))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MINUTES.map((m) => (
                      <SelectItem key={m} value={m.toString()}>
                        :{m.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <div className="flex gap-2">
                <Select
                  value={endHour.toString()}
                  onValueChange={(v) => setEndHour(parseInt(v))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOURS.map((h) => (
                      <SelectItem key={h} value={h.toString()}>
                        {formatHourLabel(h)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={endMinute.toString()}
                  onValueChange={(v) => setEndMinute(parseInt(v))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MINUTES.map((m) => (
                      <SelectItem key={m} value={m.toString()}>
                        :{m.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="homework">Homework (optional)</Label>
            <Textarea
              id="homework"
              placeholder="Add homework or notes for this subject..."
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!subject.trim()}>
            {editEntry ? 'Save Changes' : 'Add Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
