import { ParserInterface } from './parser.interface';
import { AbstractTemplateParser } from './abstract-template.parser';
import { TranslationCollection } from '../utils/translation.collection';

export class PipeParser extends AbstractTemplateParser implements ParserInterface {

	public extract(contents: string, path?: string): TranslationCollection {
		if (path && this._isAngularComponent(path)) {
			contents = this._extractInlineTemplate(contents);
		}

		return this._parseTemplate(contents, path);
	}

	protected _parseTemplate(template: string, path?: string): TranslationCollection {
		let collection: TranslationCollection = new TranslationCollection();

		const regExp: RegExp = /(['"`])((?:(?!\1).|\\\1)+)\1\s*\|\s*translate(?:(.+))? \}\}/g;
		const extraInfoRegExp: RegExp = /(['"`]+)/g;
		let matches: RegExpExecArray;

		while (matches = regExp.exec(template)) {
			let extraConfig = {};
			if (matches[3]) {
				let [ , comment, context ] = matches[3].split(`:`).map(item => item.replace(extraInfoRegExp, ''));
				extraConfig =  { comment, context };
			}
			collection = collection.add(matches[2].split('\\\'').join('\''), null, {reference: path, ...extraConfig});
		}

		return collection;
	}

}
