import { STARLIGHT_JOURNALS } from "@config";
import { PlayerCharacterData } from "@models/actors/player-character";

declare module "fvtt-types/configuration" {
	interface AssumeHookRan {
		ready: true,
	}

	interface SystemNameConfig {
		name: "starlight-journals";
	}

	interface CONFIG {
		STARLIGHT_JOURNALS: typeof STARLIGHT_JOURNALS;
	}
}
