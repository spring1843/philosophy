module.exports.inject = function (di) {
    var dep = di;
    var wikiPageLinkSchema = dep.wikiPageLinkSchema || require('./schemas/wikiPageLink.js');

    var mongoose = dep.mongoose;
    var wikiPageLinkModel =  new mongoose.Schema(wikiPageLinkSchema);


    var WikiPageLink = mongoose.model('WikiPageLink',wikiPageLinkModel);

    return WikiPageLink;
};