import React, {Component} from 'react';

import { graphql } from 'react-apollo';

import { getBookQuery } from '../queries/queries';

class BookDetails extends Component {

    displayBookDetails(){
        const { book } = this.props.data;

        if(book) {
            return (
                <div>
                    <h3>Название: {book.name}</h3>
                    <p>Жанр: {book.genre}</p>
                    <p>Автор: {book.author.name}</p>
                    {book.author.books && book.author.books.length > 0 && (
                        <div>
                            <p>Книги автора:</p>
                            <ul className="other-books">
                                {
                                    book.author.books.map(item => {
                                        return (<li key={item.id}>{item.name}</li>);
                                    })
                                }
                            </ul>
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <p>Книга не выбрана</p>
            );
        }
    }

    render(){
        return (
            <div className="book-details">
                {this.displayBookDetails()}
            </div>
        );
    }
}

export default graphql(getBookQuery, {
    options: (props) => {
        return {
            variables: {
                id: props.bookId
            }
        }
    }
})(BookDetails);