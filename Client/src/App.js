import React from "react";

import {Link} from 'react-router-dom';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Index from "./pages/index";
import Add from "./pages/add";
import SeeRecipe from './pages/see-recipe';
import Search from './pages/search'

import './App.css';

class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch (event) {
    event.preventDefault();

    var search = document.getElementById('search-bar-input').value
    document.location.href = `/search?search=${search}`
  }

  render() {
    return (
      <nav>
        <h1 style={{fontSize: '50px'}}><a href='/'>Recipes</a></h1>
        <form onSubmit={this.handleSearch} id='search'>
          <input type='text' id='search-bar-input' placeholder="Search..."></input>
          
        </form>
        <div>
          {/* <button onclick="window.location.href='add.html';"> */}
          <button>
            <Link to="/add">Add +</Link>
          </button>
        </div>
      </nav>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="main">
        

        <Router>
        <Nav />
        <Routes>
            <Route exact path='/' element={<Index />} />
            <Route path='/add' element={<Add/>} />
            <Route path='/see-recipe' element={<SeeRecipe/>} />
            <Route path='/search' element={<Search/>} />
        </Routes>
        </Router>

         
      </div>
    );
  }
}

export default App;
