"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_template_parser_1 = require("./abstract-template.parser");
var translation_collection_1 = require("../utils/translation.collection");
var PipeParser = (function (_super) {
    __extends(PipeParser, _super);
    function PipeParser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PipeParser.prototype.extract = function (contents, path) {
        if (path && this._isAngularComponent(path)) {
            contents = this._extractInlineTemplate(contents);
        }
        return this._parseTemplate(contents, path);
    };
    PipeParser.prototype._parseTemplate = function (template, path) {
        var collection = new translation_collection_1.TranslationCollection();
        var regExp = /(['"`])((?:(?!\1).|\\\1)+)\1\s*\|\s*translate(?:(.+))? \}\}/g;
        var extraInfoRegExp = /(['"`]+)/g;
        var matches;
        while (matches = regExp.exec(template)) {
            var extraConfig = {};
            if (matches[3]) {
                var _a = matches[3].split(":").map(function (item) { return item.replace(extraInfoRegExp, ''); }), comment = _a[1], context_1 = _a[2];
                extraConfig = { comment: comment, context: context_1 };
            }
            collection = collection.add(matches[2].split('\\\'').join('\''), null, __assign({ reference: path }, extraConfig));
        }
        return collection;
    };
    return PipeParser;
}(abstract_template_parser_1.AbstractTemplateParser));
exports.PipeParser = PipeParser;
//# sourceMappingURL=pipe.parser.js.map