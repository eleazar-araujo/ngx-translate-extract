"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var translation_collection_1 = require("../utils/translation.collection");
var gettext = require("gettext-parser");
var PoCompiler = (function () {
    function PoCompiler(options) {
        this.extension = 'po';
        this.domain = '';
    }
    PoCompiler.prototype.compile = function (collection) {
        var data = {
            charset: 'utf-8',
            headers: {
                'mime-version': '1.0',
                'content-type': 'text/plain; charset=utf-8',
                'content-transfer-encoding': '8bit'
            },
            translations: (_a = {},
                _a[this.domain] = Object.keys(collection.values).reduce(function (translations, key) {
                    var keyParts = key.split('$$context$$');
                    var value = collection.get(key);
                    translations[key] = {
                        msgctxt: keyParts.length > 1 ? keyParts[1] : undefined,
                        msgid: keyParts[0],
                        msgstr: value.text,
                        comments: {
                            translator: value.comment,
                            reference: value.reference
                        }
                    };
                    return translations;
                }, {}),
                _a)
        };
        return gettext.po.compile(data, 'utf-8');
        var _a;
    };
    PoCompiler.prototype.parse = function (contents) {
        var collection = new translation_collection_1.TranslationCollection();
        var contextSuffix = function (domain) {
            if (domain && domain.length > 0) {
                return '$$context$$' + domain;
            }
            return domain;
        };
        var getValuesFromDomain = function (domain, translations) {
            return Object.keys(translations[domain])
                .filter(function (key) { return key.length > 0; })
                .reduce(function (values, key) {
                var newKey = key + contextSuffix(domain);
                values[newKey] = translations[domain][key].msgstr.pop();
                return values;
            }, {});
        };
        var getValuesForAllDomains = function (translations) {
            return Object.keys(translations).reduce(function (values, domain) {
                values[domain] = getValuesFromDomain(domain, translations);
                return values;
            }, {});
        };
        var po = gettext.po.parse(contents, 'utf-8');
        if (!po.translations.hasOwnProperty(this.domain)) {
            return collection;
        }
        var values = Object.values(getValuesForAllDomains(po.translations))
            .reduce(function (acc, values) {
            return __assign({}, acc, values);
        }, {});
        return new translation_collection_1.TranslationCollection(values);
    };
    return PoCompiler;
}());
exports.PoCompiler = PoCompiler;
//# sourceMappingURL=po.compiler.js.map