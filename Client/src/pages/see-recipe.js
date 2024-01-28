import React from "react";
import { useSearchParams } from 'react-router-dom'

let pTitle="BLANK"

const Results = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  pTitle = searchParams.get('title')
 

  return <div></div>
}

class ListItem extends React.Component {
  render(){
    return (
      <li>{this.props.text}</li>
    )
  }
}

class RecRecipe extends React.Component {
  render() {
    return (
      <div className="seeRecipeSearchItem">
        <a href={`/see-recipe?title=${this.props.title}`}>
          <div>
            <img className="fakeImg" src={this.props.data.image}/>
            <h3>{this.props.title}</h3>  
          </div>
        </a>
      </div>
    );
  }
}

class Recipe extends React.Component {
  getList(arr=[]) {
    var list = []
    arr.forEach(i => list.push(<ListItem key={i} text={i} />))
    return list
  }	 
  
  remove = async() => {
	const res = await fetch('http://127.0.0.1:3300/remove', {
    method: "POST",
    body: JSON.stringify({
      title: this.props.title
    }),
    headers: { Accept: "application/json", "Content-Type": "application/json" }
	});

	document.location.href = '/'
  }

  render() {
    return (
      <div className="recipe">
        <h1>{this.props.title}</h1>
	
        <a href={`/add?edit=${this.props.title}`}>Edit</a>
        <a href='#' onClick={() => this.remove()}>Remove</a>
            
        <h2>Ingredients</h2>
        <ol className="see-recipe-list">{this.getList(this.props.ingredients)}</ol>

        <h2>Instructions</h2>
        <ol className="see-recipe-list">{this.getList(this.props.instructions)}</ol>

      	<h2>Tags</h2>
        <ol className="see-recipe-list">{this.getList(this.props.tags)}</ol>

      </div>
    )
  }
}

class SeeRecipe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recRecipes: []
    }
  }

   componentDidMount (){ 
    if (this.first) return; this.first = true;

    this.GetRecipe(pTitle);
  }

  GetRecipe = async (title) => {
    console.log(`Getting recipe ${title}...`)

    const res = await fetch(`http://127.0.0.1:3300/get-recipe-by-title?title=${title}`, {
      method: "GET",
      headers: { Accept: "application/json", "Content-Type": "application/json" }
    })

    const data = await res.json();

    this.state.recipe = <Recipe key={data.title} title={data.title} ingredients={data.ingredientsList} instructions={data.instructionsList} tags={data.tagsList}/>;    
    await this.setState(this.state);

    var list = pTitle.split(" ")
    list = list.concat(data.tagsList)
    list.toString();
    list = list.join(" ")
    
    await this.search(list);
    console.log(`Got recipe ${title}.`);
    console.log(data)
  }

  search = async(search) => {
    console.log(`Searching for ${search}...`);

    const res = await fetch(`http://127.0.0.1:3300/search?search=${search}`, {
        method: "GET",
        headers: { Accept: "application/json", "Content-Type": "application/json" }
    })
  
    const data = await res.json();

    for (var r in data){
        this.state.recRecipes.push(<RecRecipe key={data[r].title} title={data[r].title} data={data[r]}/>);
    }


    this.setState(this.state);
    console.log(`Got searches ${search}.`)
    console.log(data)
  }

 render() {
    return (
      <div className="see-recipe-main">
        <Results />
        {this.state.recipe}
        <div className="seeRecipeSearchList">{this.state.recRecipes}</div>    
      </div>
    );
  }
}

export default SeeRecipe;
