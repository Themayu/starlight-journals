import * as lit from "lit-html";

import { DeepPartial, FixedInstanceType, Mixin } from "fvtt-types/utils";
import { HTMLTemplateResult } from "lit-html";
import { Constructor } from "@data/types";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

export declare namespace LitApplicationMixin {
	type TemplateOf<RenderContext extends ApplicationV2.RenderContext>
		= (context: RenderContext) =>
			HTMLTemplateResult | PromiseLike<HTMLTemplateResult>;
}

export const LitApplicationMixin = <BaseClass extends Constructor<ApplicationV2>>(
  BaseApplication: BaseClass,
) => class LitApplication extends BaseApplication {
	constructor(...args: any[]) {
		super(...args);
	}

	// Templating ----------------------------------------------------------- //

	/** Lit template function to call when rendering. Receives the render context. */
	static TEMPLATE: LitApplicationMixin.TemplateOf<any> = undefined!;

	/**
	 * Get the template function used for rendering this application.
	 * 
	 * Defaults to reading the static constant `TEMPLATE` if present. Override to implement custom template selection
	 * behaviour.
	 * 
	 * @param _context Context data for the render operation.
	 * @param _options Options which configure application rendering behaviour
	 * 
	 * @returns A template function to be used for rendering the application.
	 */
	protected _getTemplate(
		_context: ApplicationV2.RenderContextOf<this>,
		_options: DeepPartial<ApplicationV2.RenderOptionsOf<this>>,
	): LitApplicationMixin.TemplateOf<ApplicationV2.RenderContextOf<this>> {
		let template = (this.constructor as typeof LitApplication).TEMPLATE;

		if (template === undefined) {
			throw new ReferenceError(
				`\`${this.constructor.name}.TEMPLATE\` has not been assigned .` +
				`Assign a template function to TEMPLATE or override \`${this.constructor.name}#_getTemplate\`.`
			);
		}

		return template;
	}

	// Rendering ------------------------------------------------------------ //

	/** @inheritdoc */
	protected override _renderHTML(
		context: ApplicationV2.RenderContextOf<this>,
		options: DeepPartial<ApplicationV2.RenderOptionsOf<this>>,
	): Promise<HTMLTemplateResult> {
		return Promise.try(this._getTemplate(context, options), context);
	}

	/** @inheritdoc */
	protected override _replaceHTML(
		result: HTMLTemplateResult,
		content: HTMLElement,
		options: DeepPartial<ApplicationV2.RenderOptionsOf<this>>,
	): void {
		lit.render(result, content, { isConnected: !options.isFirstRender });
	}
}
