import { PlayerCharacterSheet } from "@applications/sheets";
import { STARLIGHT_JOURNALS } from "@config";
import { PlayerCharacterData } from "@models/actors";

import ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;
import Actors = foundry.documents.collections.Actors;

export default function init() {
	CONFIG.STARLIGHT_JOURNALS = STARLIGHT_JOURNALS;

	// Data model registration ---------------------------------------------- //
	Object.assign(CONFIG.Actor.dataModels, {
		playerCharacter: PlayerCharacterData,
	});

	// Sheet registration --------------------------------------------------- //
	Actors.unregisterSheet("core", ActorSheetV2);

	Actors.registerSheet("starlight-journals", PlayerCharacterSheet, {
		types: ["playerCharacter"],
		label: "TYPES.Actor.playerCharacter",
		makeDefault: true,
	});
}
