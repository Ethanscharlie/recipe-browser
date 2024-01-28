import React from "react";
import { useSearchParams } from 'react-router-dom'

let search = ""

const Results = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    search = searchParams.get('search')
  
    return <div></div>
}

class Recipe extends React.Component {
  render() {
    return (
      <div className="searchItem">
        <a href={`/see-recipe?title=${this.props.title}`}>
          <div>
            <h2>{this.props.title}</h2>
            <p>{this.props.data.instructionsList}</p>
            <div className="searchImg">
              <img className="fakeImg" src={this.props.image}/>
            </div>
          </div>
        </a>
      </div>
    );
  }
}

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        recipes: []
    }
  }


  componentDidMount (){ 
    if (this.first) return; this.first = true;
    this.search();
  }

  search = async() => {
    console.log(`Searching for ${search}...`);

    const res = await fetch(`http://127.0.0.1:3300/search?search=${search}`, {
        method: "GET",
        headers: { Accept: "application/json", "Content-Type": "application/json" }
    })
  
    const data = await res.json();

    for (var r in data){
        this.state.recipes.push(<Recipe key={data[r].title} title={data[r].title} image={data[r].image} data={data[r]}/>);
    }

    console.log(`Finished search for ${search}`);
    console.log(this.state.recipes);
    this.setState(this.state);
  }

  render() {
    return (
      <div className="main">
          <main>
            <Results/>
            <div className="searchList">{this.state.recipes}</div>     
          </main>
      </div>
    );
  }
}

export default Search;  
