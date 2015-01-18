module.exports.inject = function (di) {
    var findOne = function(){

    }

    var where = function(){
        return this;
    }

    var count = function(){

    }

    return{
        findOne : findOne,
        where : where,
        count : count
    };
}