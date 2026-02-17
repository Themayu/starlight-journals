import { PlayerCharacterData } from "@models/actors/player-character";

export const models: DataModelConfig["Actor"] = {
	playerCharacter: PlayerCharacterData,
};

declare module "fvtt-types/configuration" {
	interface DataModelConfig {
		Actor: {
			playerCharacter: typeof PlayerCharacterData;
		};
	}
}

export { PlayerCharacterData };
