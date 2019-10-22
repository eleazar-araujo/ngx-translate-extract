import { CompilerInterface } from './compiler.interface';
import { TranslationCollection } from '../utils/translation.collection';

import * as gettext from 'gettext-parser';

export class PoCompiler implements CompilerInterface {

	public extension = 'po';

	/**
	 * Translation domain
	 */
	public domain = '';

	public constructor(options?: any) { }

	public compile(collection: TranslationCollection): string {
		const data = {
			charset: 'utf-8',
			headers: {
				'mime-version': '1.0',
				'content-type': 'text/plain; charset=utf-8',
				'content-transfer-encoding': '8bit'
			},
			translations: {
				[this.domain]: Object.keys(collection.values).reduce((translations, key) => {
					const keyParts = key.split('$$context$$');
					const value = collection.get(key);
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
				}, <any> {})
			}
		};

		return gettext.po.compile(data, 'utf-8');
	}

	public parse(contents: string): TranslationCollection {
		const collection = new TranslationCollection();

		const contextSuffix = function(domain: string) {
			if (domain && domain.length > 0) {
				return '$$context$$' + domain
			}
			return domain
		}

		const getValuesFromDomain = function(domain: string, translations: any) {
			return Object.keys(translations[domain])
				.filter(function (key) { return key.length > 0; })
				.reduce(function (values, key) {
					const newKey: string = key + contextSuffix(domain)
					values[newKey] = translations[domain][key].msgstr.pop()
					return values
			}, <Record<string, any>> {})
		}

    const getValuesForAllDomains = function(translations: any) {
			return Object.keys(translations).reduce(function (values, domain) {
				values[domain] = getValuesFromDomain(domain, translations)
				return values
			}, <Record<string, any>>{})
		}

		const po = gettext.po.parse(contents, 'utf-8');
		if (!po.translations.hasOwnProperty(this.domain)) {
			return collection;
		}

		const values = Object.values(getValuesForAllDomains(po.translations))
		.reduce(function (acc, values) {
			return {...acc, ...values}
		}, {})
		return new TranslationCollection(values);
	}

}
