import React, {Component} from 'react';

import { graphql } from 'react-apollo';

import { getBooksQuery } from '../queries/queries';

import BookDetails from './BookDetails';

class BookList extends Component {

    constructor(props){
        super(props);

        this.state = {
            selected: null
        }
    }

    getBooks(){
        const { data } = this.props;

        if(data.loading) {
            return <div>Загружаем книги...</div>;
        } else {
            return data.books.map( (book) => {
                return (
                    <li key={book.id} style={{marginBottom: '15px'}} onClick={(e)=>{this.setState({selected: book.id})}}>
                        {book.name} ({book.author.name})
                    </li>
                )
            });
        }
    }

    render(){
        return (
            <div>
                <ul id="book-list" style={{listStyle: 'none'}}>
                    <li style={{marginBottom: '15px'}}>Book name</li>
                    {this.getBooks()}
                </ul>
                <BookDetails bookId={this.state.selected}/>
            </div>
        );
    }
}

export default graphql(getBooksQuery)(BookList);