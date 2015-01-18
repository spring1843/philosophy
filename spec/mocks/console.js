module.exports.inject = function (di) {

    var log = function(){
        return this;
    }


    return{
        log : log
    };
}