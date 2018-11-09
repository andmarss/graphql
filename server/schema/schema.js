const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/author');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve({authorId}, args) {
                // return authors.find(author => author.id === authorId);
                return Author.findById(authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList( BookType ),
            resolve(parent, args){
                // return books.filter(book => parent.id === book.authorId)
                return Book.find({ authorId: parent.id });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: {type: GraphQLID }},
            resolve(parent, {id}){
                // code to get data from db / other source
                // return books.find((book) => book.id === id);
                return Book.findById(id);
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, {id}){
                // return authors.find((author) => author.id === id);
                return Author.findById(id);
            }
        },
        books: {
            type: new GraphQLList( BookType ),
            resolve(){
                // return books;
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList( AuthorType ),
            resolve(){
                // return authors;
                return Author.find({});
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type:  new GraphQLNonNull( GraphQLString ) },
                age: { type:  new GraphQLNonNull( GraphQLInt ) },
            },
            resolve(parent, {name, age}){
                let author = new Author({
                    name,
                    age
                });

                return author.save();
            }
        },

        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull( GraphQLString ) },
                genre: { type:  new GraphQLNonNull( GraphQLString ) },
                authorId: { type: new GraphQLNonNull( GraphQLID ) }
            },
            resolve(parent, {name, genre, authorId}){
                let book = new Book({
                    name,
                    genre,
                    authorId
                });

                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});