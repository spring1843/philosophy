module.exports.inject = function (di) {
    var dep = di;
    var wikiPathLinkSchema = dep.wikiPathLinkSchema || require('./schemas/wikiPath.js');
    var mongoose = dep.mongoose;
    var wikiPathModel =  new mongoose.Schema(wikiPathLinkSchema);
    var WikiPath = mongoose.model('WikiPath',wikiPathModel);
    return WikiPath;
};