import { createReducer, on } from '@ngrx/store';
import {
  addNoteAction,
  deleteNoteAction,
  updateNoteAction,
} from './notes.actions';
import { NoteState } from './notes.state';

export const initialState: NoteState = {
  notes: [],
};

export const NoteReducer = createReducer(
  initialState,
  on(addNoteAction, (state, { note }) => {
    return {
      ...state,
      notes: [...state.notes, note],
    };
  }),
  on(deleteNoteAction, (state, { id }) => {
    return {
      ...state,
      notes: state.notes.filter((note) => note.id !== id),
    };
  }),
  on(updateNoteAction, (state, { note }) => {
    console.log(note);
    const notes = [...state.notes];
    const tempNotes = notes.filter((n) => n.id !== note.id);

    return {
      ...state,
      notes: [ ...tempNotes,note ],
    };
  })
);
