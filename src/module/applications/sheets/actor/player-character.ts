import { DeepPartial } from "fvtt-types/utils";
import { LitApplicationMixin } from "@applications/api";
import { BaseActorSheet } from "@applications/sheets/actor/base";
import { playerCharacter } from "@templates/sheets";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

export class PlayerCharacterSheet<
	RenderContext extends BaseActorSheet.RenderContext = BaseActorSheet.RenderContext,
	Configuration extends BaseActorSheet.Configuration = BaseActorSheet.Configuration,
	RenderOptions extends BaseActorSheet.RenderOptions = BaseActorSheet.RenderOptions,
> extends BaseActorSheet<RenderContext, Configuration, RenderOptions> {
	static DEFAULT_OPTIONS: BaseActorSheet.DefaultOptions = {
		classes: ["player-character"],
		position: {
			width: 800,
			height: 1000,
		},
	};

	/** @inheritdoc */
	protected override _getTemplate(
		context: ApplicationV2.RenderContextOf<this>,
		options: DeepPartial<ApplicationV2.RenderOptionsOf<this>>,
	): LitApplicationMixin.TemplateOf<this> {
		if (!this.showLimitedSheet) {
			return playerCharacter;
		} else {
			return undefined!;
		}
	}

	protected override async _onRender(
		context: ApplicationV2.RenderContextOf<this>,
		options: DeepPartial<ApplicationV2.RenderOptionsOf<this>>
	) {

	}
}
