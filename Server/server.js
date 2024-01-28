const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require('fs')
const path = require('path');
const stringSimilarity = require("string-similarity");
const { json } = require("body-parser");
const request = require("request")

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/save", async (req, res) => {
  try {    
    console.log(JSON.stringify(req.body.formData))
    fs.writeFile(path.join(__dirname, '..', 'recipes', `${req.body.formData.title}.json`), JSON.stringify(req.body.formData), function (err) {
      if (err) throw err
      console.log('It\'s saved!');
      res.status(200).send('It\'s saved!')
    });

    if ('image' in req.body.formData) {
      request(req.body.formData.image).pipe(fs.createWriteStream(path.join('..', 'recipes-img', `${req.body.formData.title}.webp`)))
        .on('close', () => console.log('Image downloaded.'));
    }

  } catch (err) {
    res.status(500).send(err);
    console.log(err)
  }
});

app.post("/remove", async (req, res) => {
  if (req.body.title == null) {res.status(400).send('null')}

  try {
    // JSON File
    fs.unlink(path.join(__dirname, '..', 'recipes', `${req.body.title}.json`), function (err) {
      if (err) throw err
      console.log('It\'s removed!');
      
    });

    // Image
    if (fs.existsSync(path.join(__dirname, '..', 'recipes-img', `${req.body.title}.webp`))) {
      fs.unlink(path.join(__dirname, '..', 'recipes-img', `${req.body.title}.webp`), function (err) {
        if (err) throw err
        console.log('Picture removed!');
      });
    }

    res.status(200).send('Removed');

  } catch (err) {
    res.status(500).send(err)
    console.log(err)
  }
});

app.get('/search', async (req, res) =>  {
  console.log(`Searching ${req.query.search}...`)

  fs.readdir(path.join('..', 'recipes'), function (err, files) {
    if (err) {
      console.log(err);
      return;
    }

    let JSONfiles = []

    for (f in files) {
      var data = fs.readFileSync(path.join('..', 'recipes', files[f]));

      var searchedItems = req.query.search.split(" ");
      var tagItems = JSON.parse(data).tagsList;
      
      for (s in searchedItems) {
        var titleItems = JSON.parse(data).title.split(" ")
        titleItems = titleItems.concat(tagItems);

        console.log(JSONfiles.map(i => i.title))
        
        for (t in titleItems) {
          console.log(`${titleItems[t].toLowerCase()}, ${searchedItems[s].toLowerCase()}: ${stringSimilarity.compareTwoStrings(titleItems[t].toLowerCase(), searchedItems[s].toLowerCase())} acc`)
          if (stringSimilarity.compareTwoStrings(titleItems[t].toLowerCase(), searchedItems[s].toLowerCase()) >= 0.5) {             
            if (JSONfiles.map(i => i.title).includes(JSON.parse(data).title) == false) {
              JSONfiles.push(JSON.parse(data));
            }
          }
        }
      }
    }
    
    if (JSONfiles.length > 0) {
      res.status(200).send(JSONfiles);
    }
    else {
      res.status(200).send("Nothing Found")
    }
    
  })
});

app.get("/get-recipes", async (req, res) => {
  console.log('getting recipes...');
  
  fs.readdir(path.join('..', 'recipes'), function (err, files) {
    if (err) {
      console.log(err);
      return;
    }

    let JSONfiles = []
    for (f in files) {
      const data = fs.readFileSync(path.join('..', 'recipes', files[f]))

      JSONfiles.push(JSON.parse(data));
    }

    console.log(JSONfiles);
    res.status(200).send(JSONfiles);
  })
});

app.get("/get-recipes-by-tag", async (req, res) => {
  fs.readdir(path.join('..', 'recipes'), function (err, files) {
    if (err) {
      console.log(err);
      return;
    }

    console.log(req.query.tag);
    let dataList = []

    console.log(`Looking for tag ${req.query.tag}`)

    for (f in files) {
      const data = fs.readFileSync(path.join('..', 'recipes', files[f]))    

      for (var tag in JSON.parse(data).tagsList) {
        if (JSON.parse(data).tagsList[tag] == req.query.tag) {
          console.log(`Found ${JSON.parse(data).title}`)
          dataList.push(JSON.parse(data));
          break;
        }  
      }
    }
    console.log(dataList)
    res.status(200).send (dataList)
    
  })
});

app.get("/get-recipe-by-title", async (req, res) => {
  fs.readdir(path.join('..', 'recipes'), function (err, files) {
    if (err) {
      console.log(err);
      return;
    }

    console.log(req.query.title);

    for (f in files) {
      const data = fs.readFileSync(path.join('..', 'recipes', files[f]))

      if (JSON.parse(data).title == req.query.title) {
        console.log('found.')

        

        res.status(200).send (JSON.parse(data))
      }
      
    }
    
  })
});

app.listen(3300, () => console.log("Server Running..."));
