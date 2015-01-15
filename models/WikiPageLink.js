module.exports.inject = function (di) {
    var dep = di;

    var mongoose = dep.mongoose;
    console.log('in mongoose is ', mongoose);


    var wikiPageLinkSchema = dep.wikiPageLinkSchema || require('./schemas/wikiPageLink.js');

    var wikiPageLinkModel =  new mongoose.Schema(wikiPageLinkSchema);
    var WikiPageLink = mongoose.model('WikiPageLink',wikiPageLinkModel);

    return WikiPageLink;
};