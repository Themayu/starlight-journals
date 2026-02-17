/**
 * Translate a provided string key by using the loaded dictionary of localization strings.
 * 
 * @param value The path to a localized string.
 * @param context Interpolation data passed to `Localization#format`.
 * @returns A localized string.
 * 
 * @example Translating a provided localization string, optionally including formatting parameters
 * ```ts
 * import * as helpers from "@templates/helpers";
 * import { html, render } from "lit-html";
 * 
 * let template = html`
 * <label>${helpers.localize("ACTOR.Create")}</label>
 * <label>${helpers.localize("CHAT.InvalidCommand", { command: "foo" })}</label>
 * `;
 * 
 * // <label>Create Actor</label>
 * // <label>foo is not a valid chat message command.</label>
 * render(element, template);
 * ```
 */
export const localize = (value: string, context?: Readonly<Record<string, string>>) => {
	if (foundry.utils.isEmpty(context)) {
		return game.i18n.localize(value);
	} else {
		return game.i18n.format(value, context!);
	}
}
