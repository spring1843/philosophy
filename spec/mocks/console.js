module.exports.inject = function (di) {

    var enabled = di.enabled || false;
    var realConsole = console.log;


    console.log = function(){
        if(enabled === false)
            return;

        Array.prototype.unshift.call(arguments, 'Report: ');
        realConsole.apply(this, arguments)
    }


    var log = function(){
        return this;
    }


    return{
        log : log
    };
}