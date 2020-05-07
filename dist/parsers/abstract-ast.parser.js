"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var AbstractAstParser = (function () {
    function AbstractAstParser() {
    }
    AbstractAstParser.prototype._createSourceFile = function (path, contents) {
        return ts.createSourceFile(path, contents, null, false);
    };
    AbstractAstParser.prototype._getCallArgStrings = function (callNode) {
        var _this = this;
        if (!callNode.arguments.length) {
            return;
        }
        return callNode.arguments.map(function (argument) { return _this.getStringByArgue(argument)[0]; });
    };
    AbstractAstParser.prototype.getStringByArgue = function (arg) {
        switch (arg.kind) {
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.FirstTemplateToken:
                return [arg.text];
            case ts.SyntaxKind.ArrayLiteralExpression:
                return arg.elements
                    .map(function (element) { return element.text; });
            case ts.SyntaxKind.Identifier:
                console.log('WARNING: We cannot extract variable values passed to TranslateService (yet)');
                break;
            default:
                console.log("SKIP: Unknown argument type: '" + this._syntaxKindToName(arg.kind) + "'", arg);
        }
    };
    AbstractAstParser.prototype._findNodes = function (node, kind) {
        var _this = this;
        var childrenNodes = node.getChildren(this._sourceFile);
        var initialValue = node.kind === kind ? [node] : [];
        return childrenNodes.reduce(function (result, childNode) {
            return result.concat(_this._findNodes(childNode, kind));
        }, initialValue);
    };
    AbstractAstParser.prototype._syntaxKindToName = function (kind) {
        return ts.SyntaxKind[kind];
    };
    AbstractAstParser.prototype._printAllChildren = function (sourceFile, node, depth) {
        var _this = this;
        if (depth === void 0) { depth = 0; }
        console.log(new Array(depth + 1).join('----'), "[" + node.kind + "]", this._syntaxKindToName(node.kind), "[pos: " + node.pos + "-" + node.end + "]", ':\t\t\t', node.getFullText(sourceFile).trim());
        depth++;
        node.getChildren(sourceFile).forEach(function (childNode) { return _this._printAllChildren(sourceFile, childNode, depth); });
    };
    return AbstractAstParser;
}());
exports.AbstractAstParser = AbstractAstParser;
//# sourceMappingURL=abstract-ast.parser.js.map