import React, {Component} from 'react';

import { graphql, compose } from 'react-apollo';

import { getAuthorsQuery, addBookMutation, getBooksQuery } from '../queries/queries';

class AddBook extends Component {

    constructor(props){
        super(props);

        this.state = {
            name: '',
            genre: '',
            authorId: '',
            error: false
        };
    }

    getAuthors(){
        const data = this.props.getAuthorsQuery;

        if(!data.loading) {
            return data.authors.map(author => {
                return (
                    <option key={author.id} value={author.id}>{author.name}</option>
                )
            });
        } else {
            return <option>Загружаем авторов...</option>
        }
    }

    submitForm(e){
        e.preventDefault();

        for(let key in this.state) {
            if(this.state[key].length === 0){
                this.setState({
                    error: true
                });

                setTimeout(() => {
                    this.setState({
                        error: false
                    })
                }, 2000);

                return;
            } else {
                this.setState({
                    error: false
                })
            }
        }
        
        this.props.addBookMutation({
            variables: {
                name: this.state.name,
                genre: this.state.genre,
                authorId: this.state.authorId
            },
            refetchQueries: [{query: getBooksQuery}]
        });
    }

    showError(){
        if(this.state.error){
            return (<p style={{color: '#DB0000'}}>Все поля обязательны для заполнения</p>);
        }
    }

    render(){
        return (
            <form id="add-book" onSubmit={this.submitForm.bind(this)}>

                {this.showError()}

                <div className="field">
                    <label>Наименование книги: </label>
                    <input type="text" onChange={(e) => this.setState({name: e.target.value})}/>
                </div>

                <div className="field">
                    <label>Жанр: </label>
                    <input type="text" onChange={(e) => this.setState({genre: e.target.value})}/>
                </div>

                <div className="field">
                    <label>Автор: </label>
                    <select onChange={(e) => this.setState({authorId: e.target.value})}>
                        <option>Выберите автора</option>
                        {this.getAuthors()}
                    </select>
                </div>

                <button>+</button>
            </form>
        );
    }
}
export default compose(
    graphql(getAuthorsQuery, {name: "getAuthorsQuery"}),
    graphql(addBookMutation, {name: "addBookMutation"})
)(AddBook);