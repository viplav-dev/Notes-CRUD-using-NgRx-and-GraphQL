"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const notes_model_1 = require("../models/notes.model");
const user_model_1 = require("../models/user.model");
const graphql_1 = require("graphql");
const UserType = new graphql_1.GraphQLObjectType({
    name: "User",
    fields: () => ({
        _id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
        passwordConfirm: { type: graphql_1.GraphQLString },
    }),
});
const NoteType = new graphql_1.GraphQLObjectType({
    name: "Note",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        userId: { type: graphql_1.GraphQLID },
        title: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
        timestamp: { type: graphql_1.GraphQLString },
    }),
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    fields: {
        notes: {
            type: new graphql_1.GraphQLList(NoteType),
            resolve(parent, args) {
                return notes_model_1.Note.find();
            },
        },
        note: {
            type: NoteType,
            args: { id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve(parent, args) {
                return notes_model_1.Note.findById(args.id);
            },
        },
        notesByUser: {
            type: new graphql_1.GraphQLList(NoteType),
            args: { userId: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return notes_model_1.Note.find({ userId: args.userId });
            },
        },
        users: {
            type: new graphql_1.GraphQLList(UserType),
            resolve(parent, args) {
                return user_model_1.User.find();
            },
        },
        user: {
            type: UserType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return user_model_1.User.findById(args.id);
            },
        },
    },
});
const mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        addNote: {
            type: NoteType,
            args: {
                title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                description: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                userId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            resolve(parent, args) {
                const note = new notes_model_1.Note({
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
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            resolve(parent, args) {
                return notes_model_1.Note.findByIdAndDelete(args.id);
            },
        },
        updateNote: {
            type: NoteType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                description: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve(parent, args) {
                return notes_model_1.Note.findByIdAndUpdate(args.id, {
                    $set: {
                        title: args.title,
                        description: args.description,
                    },
                }, { new: true });
            },
        },
        addUser: {
            type: UserType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                passwordConfirm: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve(parents, args) {
                const user = new user_model_1.User({
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
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            resolve(parents, args) {
                notes_model_1.Note.find({ userId: args.id }).then((notes) => {
                    notes.forEach((note) => {
                        note.deleteOne();
                    });
                });
                return user_model_1.User.findByIdAndDelete(args.id);
            },
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                name: { type: graphql_1.GraphQLString },
                email: { type: graphql_1.GraphQLString },
            },
            resolve(parents, args) {
                return user_model_1.User.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        email: args.email,
                    },
                }, { new: true });
            },
        },
        updatePassword: {
            type: UserType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                passwordConfirm: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve(parents, args) {
                return user_model_1.User.findById(args.id)
                    .select("+password")
                    .then((user) => {
                    if (user &&
                        user.correctPassword(args.passwordConfirm, user.password)) {
                        user.password = args.password;
                        user.passwordConfirm = args.passwordConfirm;
                        return user.save();
                    }
                });
            },
        },
    },
});
exports.Schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: mutation,
});
