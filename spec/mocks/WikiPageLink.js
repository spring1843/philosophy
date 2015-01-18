module.exports.inject = function (di) {

    var findOne = function(){
        return this;
    }

    var createAndSave = function(){

    }

    var exec = function(callback){
        callback();
    }

    return{
        findOne:findOne,
        createAndSave: createAndSave,
        exec:exec
    };
}