import React, { createContext, useContext, useState } from 'react';

export type Note = {
  id: string;
  title: string;
  body?: string;
  imageUri?: string;
  location?: { latitude: number; longitude: number };
  createdAt: number;
};

type NotesContextType = {
  notes: Note[];
  addNote: (n: Omit<Note, 'id' | 'createdAt'>) => Note;
  updateNote: (id: string, patch: Partial<Note>) => Note | undefined;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Przykładowa notatka',
      body: 'To jest przykładowy opis.',
      createdAt: Date.now(),
    },
  ]);

  const addNote = (n: Omit<Note, 'id' | 'createdAt'>) => {
    const note: Note = { ...n, id: Date.now().toString(), createdAt: Date.now() };
    setNotes((s) => [note, ...s]);
    return note;
  };

  const updateNote = (id: string, patch: Partial<Note>) => {
    let updated: Note | undefined;
    setNotes((s) => s.map((note) => (note.id === id ? (updated = { ...note, ...patch }) : note)));
    return updated;
  };

  const deleteNote = (id: string) => setNotes((s) => s.filter((n) => n.id !== id));

  const getNote = (id: string) => notes.find((n) => n.id === id);

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, getNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
};