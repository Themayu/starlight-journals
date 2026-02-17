import { DeepPartial, Identity } from "fvtt-types/utils";
import { LitApplicationMixin } from "@applications/api";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;

export declare namespace BaseActorSheet {
	interface Any extends AnyBaseActorSheet {}
	interface AnyConstructor extends Identity<typeof AnyBaseActorSheet> {}

	interface RenderContext extends ActorSheetV2.RenderContext {
		owner: boolean;
		locked: boolean;
	}

	interface Configuration<
		BaseActorSheet extends BaseActorSheet.Any = BaseActorSheet.Any
	> extends ActorSheetV2.Configuration<BaseActorSheet> {}

	type DefaultOptions<BaseActorSheet extends BaseActorSheet.Any = BaseActorSheet.Any>
		= ActorSheetV2.DefaultOptions<BaseActorSheet>;

	interface RenderOptions extends ActorSheetV2.RenderOptions {}
}

export class BaseActorSheet<
	RenderContext extends BaseActorSheet.RenderContext = BaseActorSheet.RenderContext,
	Configuration extends BaseActorSheet.Configuration = BaseActorSheet.Configuration,
	RenderOptions extends BaseActorSheet.RenderOptions = BaseActorSheet.RenderOptions,
> extends LitApplicationMixin(ActorSheetV2)<RenderContext, Configuration, RenderOptions> {
	static DEFAULT_OPTIONS: BaseActorSheet.DefaultOptions = {
		classes: ["starlight-journals", "actor"],
		form: {
			submitOnChange: true,
		},

		window: {
			resizable: true,
		},
	};

	// static TEMPLATE: LitApplicationMixin.TemplateOf<any> =

	get showLimitedSheet(): boolean {
		return !game.user.isGM && this.document.limited;
	}

	/** @inheritdoc */
	protected override async _renderFrame(options: DeepPartial<RenderOptions>): Promise<HTMLElement> {
		let frame = await super._renderFrame(options);
		if (this.showLimitedSheet) {
			frame.classList.add("limited");
		}

		return frame;
	}

	async _prepareContext(
		options: DeepPartial<RenderOptions> & { isFirstRender: boolean }
	): Promise<RenderContext> {
		const context = await super._prepareContext(options);

		Object.assign(context, {
			owner: this.document.isOwner,
			locked: !this.isEditable,
		});

		return context;
	}
}

declare abstract class AnyBaseActorSheet extends BaseActorSheet<
	BaseActorSheet.RenderContext,
	BaseActorSheet.Configuration,
	BaseActorSheet.RenderOptions
> {
	constructor(...args: never);
}
