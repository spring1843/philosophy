#get-to-philosophy

Finds paths to Philosophy on Wikipedia

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and [mongoDB](http://www.mongodb.org/) installed.

```sh
$ git clone https://github.com/yasser1984ir/philosophy # or clone your own fork
$ cd philosophy
$ npm install
$ npm start
```


## Features

- DFS Algorithm ensures shortest path
- Learning is asynchronous, quickest path to results is taken
- Learning continues after response is sent
- Successful paths are stored for re-use
- Page fetches are cached for offline learning