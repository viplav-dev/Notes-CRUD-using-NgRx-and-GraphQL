import { NoteState } from './store/notes/notes.state';

export interface AppState {
  readonly diary: NoteState;
}
