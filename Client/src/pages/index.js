import React from "react";

class Recipe extends React.Component {
  render() {
    return (
      <li>
        <a href={`/see-recipe?title=${this.props.title}`}>
          <div className="recipeListItem">
            <img className="BLOCK" src={this.props.image}/>
            <h3>{this.props.title}</h3>
          </div>
        </a>
      </li>
    );
  }
}

class RecipeListRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: []
    }
  }

  componentDidMount (){ 
    if (this.first) return; this.first = true;

    this.getContent(this.props.tag);
  }

  getContent = async(tag) => {
    console.log(`Getting recipes for tag ${tag}...`)

    const res = await fetch(`http://127.0.0.1:3300/get-recipes-by-tag?tag=${tag}`, {
      method: "GET",
      headers: { Accept: "application/json", "Content-Type": "application/json" }
    })

    const data = await res.json();

    for (var r in data){
      this.state.recipes.push(<Recipe key={data[r].title} title={data[r].title} image={data[r].image}/>);
    }
    
    this.setState(this.state);
    console.log(`Got recipes for tag ${tag}.`);
    console.log(data);
  }

  render () {
    return (
      <div className='recipe-list-row'>
        <h1>{this.props.tag}</h1>
        <div className='recipe-list-row-row'>
          <ul>
            {this.state.recipes}
          </ul>
        </div>
      </div>
    );
  }
}

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.recpieJsonList = []
    
    this.state = {
      
    }
  }

  componentDidMount (){ 
    if (this.first) return; this.first = true;
  }

  render() {
    return (
      <div className="main">
          <main>
            <RecipeListRow tag='bread'/>
            <RecipeListRow tag='breakfest'/>
            <RecipeListRow tag='lunch'/>
          </main>
      </div>
    );
  }
}

export default Index;  
