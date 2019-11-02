import React from 'react';
import './App.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const request = require('request');

class App extends React.Component {
  state = {name: '', age: '', nameFind: '', person: null}

  presentError = text => {
    console.log('error', text);
    toast.error(text)
  }

  createPerson = () => {
    const {name, age} = this.state
    if (name === '') {
      return this.presentError('Введите имя')
    }
    if (age === '') {
      return this.presentError('Введите возраст')
    }
    const self = this

    request.get(`http://localhost:8080/createPerson?name=${name}&age=${age}`, (error, _, body) => {
      if (!!error) {
        return self.presentError(error)
      }
      const data = JSON.parse(body)
      if (!data) {
        return self.presentError('Unknown error')
      }
      if (!!data.error) {
        return self.presentError(data.error)
      }

      toast.success('Успешно создан!')
      self.setState({name: '', age: ''})
    })
  }

  findPerson = () => {
    const {nameFind} = this.state
    if (nameFind === '') {
      return this.presentError('Введите имя')
    }
    const self = this

    request.get(`http://localhost:8080/findPerson?name=${nameFind}`, (error, _, body) => {
      if (!!error) {
        return self.presentError(error)
      }
      const data = JSON.parse(body)
      if (!data) {
        return self.presentError('Unknown error')
      }
      if (!!data.error) {
        return self.presentError(data.error)
      }

      self.setState({nameFind: '', person: data})
    })
  }

  foundPersonView = () => {
    if (!this.state.person) {
      return null
    }
    const {person} = this.state
    return (
      <div className="foundContainer">
        Найден человек <br />
        Имя: {person.name} <br />
        Возраст: {person.age}
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        <form className="form" onSubmit={e => {
          e.preventDefault()
          this.createPerson()
        }}>
          <div className="title">Сохранить человека</div>
          <label>
            Имя:
          <input 
            type="text"
            value={this.state.name}
            onChange={e => this.setState({name: e.target.value})}
          />
          </label>
          <label>
            Возраст:
          <input 
            type="text"
            value={this.state.age}
            onChange={e => this.setState({age: e.target.value})}
          />
          </label>
          <button>Создать</button>
          </form>

        <hr style={{margin: '30px 10%', marginLeft: 0}}/>

        <form className="form" onSubmit={e => {
          e.preventDefault()
          this.findPerson()
        }}>
        <div className="title">Найти человека</div>
          <label>
            Имя:
          <input 
            type="text"
            value={this.state.nameFind}
            onChange={e => this.setState({nameFind: e.target.value})}
          />
          </label>
          <button>Найти</button>

          {this.foundPersonView()}

        </form>
        <ToastContainer position={toast.POSITION.TOP_LEFT} />
      </div>
    )
  }
}

export default App;
