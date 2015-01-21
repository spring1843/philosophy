module.exports.inject = function (di) {

    var dep = di;

    var depthFirstSearch = dep.depthFirstSearch || require('./DFSearch').inject(dep);
    var breadthFirstSearch = dep.breadthFirstSearch || require('./BFSearch').inject(dep);

    var findDFS = function (url, callback) {
        depthFirstSearch.find(url, callback);
    }

    var findBFS = function (url, callback) {
        breadthFirstSearch.find(url, callback);
    }

    var find = function (url, type , callback) {

        console.log('Find type', type);
        if(type === 'dfs')
            findDFS(url, callback);

        if(type === 'bfs')
            findBFS(url, callback);
    }

    return {
        find: find,
        findDFS: findDFS,
        findBFS: findBFS
    };
};