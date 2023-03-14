import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, flatMap, map, Observable } from 'rxjs';
import { Note } from '../note.model';
import { Apollo, MutationResult } from 'apollo-angular';
import { GET_NOTES } from '../graphql/graphql.queries';

import { ApolloQueryResult } from '@apollo/client/core';
import {
  ADD_NOTE,
  DELETE_NOTE,
  UPDATE_NOTE,
} from '../graphql/graphql.mutations';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  showAdd$ = new BehaviorSubject<boolean>(false);
  showUpdate$ = new BehaviorSubject<boolean>(false);
  noteId$ = new BehaviorSubject<string>('');

  constructor(private apollo: Apollo) {}

  getNotes(): Observable<ApolloQueryResult<any[]>> {
    return this.apollo.watchQuery<any[]>({
      query: GET_NOTES,
    }).valueChanges;
  }
  deleteNotes(id: string): Observable<MutationResult<any>> {
    return this.apollo
      .mutate({ mutation: DELETE_NOTE, variables: { id } })
      .pipe(
        map((result: any) => {
          return result['data']['deleteNote']['id'];
        })
      );
  }
  addNotes(note: Partial<Note>): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_NOTE,
      variables: {
        title: note.title,
        description: note.description,
        userId: note.userId,
      },
    });
  }

  updateNote(note: Partial<Note>): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_NOTE,
      variables: {
        id: note.id,
        title: note.title,
        description: note.description,
      },
    });
  }
}
