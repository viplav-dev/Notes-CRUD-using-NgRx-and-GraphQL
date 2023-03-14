import { Note } from "../models/notes.model";
import { User } from "../models/user.model";

import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    passwordConfirm: { type: GraphQLString },
  }),
});

const NoteType = new GraphQLObjectType({
  name: "Note",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    timestamp: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    notes: {
      type: new GraphQLList(NoteType),
      resolve(parent, args) {
        return Note.find();
      },
    },
    note: {
      type: NoteType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Note.findById(args.id);
      },
    },
    notesByUser: {
      type: new GraphQLList(NoteType),
      args: { userId: { type: GraphQLID } },
      resolve(parent, args) {
        return Note.find({ userId: args.userId });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addNote: {
      type: NoteType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const note = new Note({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });
        return note.save();
      },
    },
    deleteNote: {
      type: NoteType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Note.findByIdAndDelete(args.id);
      },
    },
    updateNote: {
      type: NoteType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Note.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
            },
          },
          { new: true }
        );
      },
    },
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        passwordConfirm: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parents, args) {
        const user = new User({
          name: args.name,
          email: args.email,
          password: args.password,
          passwordConfirm: args.passwordConfirm,
        });
        return user.save();
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parents, args) {
        Note.find({ userId: args.id }).then((notes: any[]) => {
          notes.forEach((note) => {
            note.deleteOne();
          });
        });
        return User.findByIdAndDelete(args.id);
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve(parents, args) {
        return User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              email: args.email,
            },
          },
          { new: true }
        );
      },
    },
    updatePassword: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        passwordConfirm: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parents, args) {
        return User.findById(args.id)
          .select("+password")
          .then((user) => {
            if (
              user &&
              user.correctPassword(args.passwordConfirm, user.password)
            ) {
              user.password = args.password;
              user.passwordConfirm = args.passwordConfirm;
              return user.save();
            }
          });
      },
    },
  },
});

export const Schema = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
