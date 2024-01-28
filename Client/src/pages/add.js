import React from "react";
import axios from 'axios';
import $ from 'jquery'
import { useSearchParams } from 'react-router-dom'

let edit = null

const Results = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  edit = searchParams.get('edit')

  return <div></div>
}


class Ingredient extends React.Component {
    render() {
      return (
        <li className="dynamicListItem">
            <div>
                <button className="upButton" type="button" onClick={(e) => moveUp(e.currentTarget.parentNode.parentNode)}>&#8593;</button>
                <br/>
                <button className="downButton" type="button" onClick={(e) => moveDown(e.currentTarget.parentNode.parentNode)}>&#8595;</button>
            </div>

            <input type="text" defaultValue={this.props.def} required/>
            <button type="button" className="minusButton" onClick={(e) => e.currentTarget.parentNode.remove()}>-</button>
        </li>
      );
    }
}

class Instruction extends React.Component {
    render() { 
      return (
        <li className="dynamicListItem">
            <div>
                <button className="upButton" type="button" onClick={(e) => moveUp(e.currentTarget.parentNode.parentNode)}>&#8593;</button>
                <br/>
                <button className="downButton" type="button" onClick={(e) => moveDown(e.currentTarget.parentNode.parentNode)}>&#8595;</button>
            </div>

            <input type="text" defaultValue={this.props.def} required/>
            <button type="button" className="minusButton" onClick={(e) => e.currentTarget.parentNode.remove()}>-</button>
        </li>
      );
    }
}
  
class Tag extends React.Component {
    render() {
      return (
        <li className="dynamicListItem">
            <div>
                <button className="upButton" type="button" onClick={(e) => moveUp(e.currentTarget.parentNode.parentNode)}>&#8593;</button>
                <br/>
                <button className="downButton" type="button" onClick={(e) => moveDown(e.currentTarget.parentNode.parentNode)}>&#8595;</button>
            </div>

            <input type="text" defaultValue={this.props.def} required/>
            <button type="button" className="minusButton" onClick={(e) => e.currentTarget.parentNode.remove()}>-</button>
        </li>
      );
    }
}

class ImageInput extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {imageLink: ''}
    }

    showImage() {
        const link = document.getElementById('image-input-input').value
        console.log(link);
        this.state.imageLink = document.getElementById('image-input-input').value
        this.setState(this.state)
    }

    render() {
        return (
            <div id='image-input'>
                
                <label><h2>Image</h2></label>
                <input type='text' id='image-input-input'></input>
                <button type="button" onClick={() => this.showImage()}>Submit</button>
                
                <br/>

                <img src={this.state.imageLink}/>
            </div>
        )
    }
}

class Add extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            ingredientsList: [],
            instructionsList: [],
            tagsList: [],
            recipe: {}
        }
        
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.first) return; this.first = true;

 	if (edit != null) {
	  this.FillRecipe(edit);
        }
        else {
          this.addIngredientListItem();
          this.addInstructionListItem();
          this.addTagListItem();
	}
    }

    FillRecipe = async (title) => {
      console.log(`Filling recipe ${title}...`);

      const res = await fetch(`http://127.0.0.1:3300/get-recipe-by-title?title=${title}`, {
        method: "GET",
        headers: { Accept: "application/json", "Content-Type": "application/json" }
      })

      const data = await res.json();

      this.state.recipe = data;
      await this.setState(this.state);
  
      document.getElementById('title-input').defaultValue = this.state.recipe.title
      for (var i of this.state.recipe.ingredientsList) {this.addIngredientListItem(i)}
      for (var i of this.state.recipe.instructionsList) {this.addInstructionListItem(i)}
      for (var i of this.state.recipe.tagsList) {this.addTagListItem(i)}   

      console.log(`Filled recipe ${title}`);
      console.log(data);
    }

    handleSubmit = async (event) => {
	    event.preventDefault();
        console.log('Submitting...');

        this.formData = {
            title: "",
            ingredientsList: [], 
            instructionsList: [],
            tagsList: [],
            image: ""
        }

        for (var i of document.getElementById('submit-button').parentNode) {
            if (i.type == 'text') {
                var potentialListId = i.parentNode.parentNode.id;

                if (potentialListId === 'ingredients-list') {
                    this.formData.ingredientsList.push(i.value)
                }
                else if (potentialListId === 'instructions-list') {
                    this.formData.instructionsList.push(i.value)
                }
                else if (potentialListId === 'tags-list') {
                    this.formData.tagsList.push(i.value)
                }
                else if (i.id === 'title-input') {
                    this.formData.title = i.value;
                }
            }
        }

        if (!document.getElementById('image-input-input').value == "") {
            this.formData.image = document.getElementById('image-input-input').value
        }

        if (edit != null) {    
            console.log(edit)
            const rres = await fetch('http://127.0.0.1:3300/remove', {
                method: "POST",
                    body: JSON.stringify({
                        title: edit
                    }),
                  headers: { Accept: "application/json", "Content-Type": "application/json" }
            });
        }

        const res = await fetch('http://127.0.0.1:3300/save', {
            method: "POST",
            body: JSON.stringify({
                formData: this.formData
            }),
            headers: { Accept: "application/json", "Content-Type": "application/json" }
        });

        console.log(`Submitted recipe`);
        console.log(this.formData);
	    document.location.href=`/see-recipe?title=${this.formData.title}`;
    }

    addIngredientListItem(def='') {
        this.state.ingredientsList.push(<Ingredient key={Math.random()} def={def}/>);
        this.setState(this.state);
    }

    addInstructionListItem(def='') {
        this.state.instructionsList.push(<Instruction key={Math.random()} def={def}/>);
        this.setState(this.state);
    }

    addTagListItem(def='') {
        this.state.tagsList.push(<Tag key={Math.random()} def={def}/>);
        this.setState(this.state);
    }

    render() {
        return (
            <div className="add-main">
		    <Results/>
	
                <main>
                    <form id="addForm" onSubmit={this.handleSubmit}>
                        <label><h2>Title</h2></label>
                        <input id='title-input' type="text" style={{fontSize:'large'}} required/>

                        <br/>

                        <ImageInput/>

                        <br/>

                        <label><h2>Ingredients</h2></label>
                        <ol id="ingredients-list">{this.state.ingredientsList}</ol>
                        <button type="button" onClick={() => this.addIngredientListItem()}>Add Item +</button>

                        <br/>

                        <label><h2>Instructions</h2></label>
                        <ol id="instructions-list">{this.state.instructionsList}</ol>
                        <button type="button" onClick={() => this.addInstructionListItem()}>Add Item +</button>

                        <br/>

                        <label><h2>Tags</h2></label>
                        <ol id="tags-list">{this.state.tagsList}</ol>
                        <button type="button" onClick={() => this.addTagListItem()}>Add Item +</button>
                        
                        <br/>

                        <input id='submit-button'  type="submit" value="Submit"/> 
                        {/* onClick={() => this.handleSubmit()} */}
                    </form>

            
                </main>
            </div>
        );
    }
}

export default Add;  

function moveUp(li) {
    var list = li.parentNode;
    var itemIndex = $(li).index();

    if (itemIndex != 0) {
        list.insertBefore(li, list.children[itemIndex-1]);
    }
}

function moveDown(li) {
    var list = li.parentNode;
    var itemIndex = $(li).index();

    if (itemIndex < list.children.length-1) {
        list.insertBefore(li, list.children[itemIndex+2]);
    }
    
}
