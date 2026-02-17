import {
	typedObjectKeys,
	typedObjectEntries,
	typedObjectTransformEntries,
} from "@data/conversion";
import { sum } from "@data/math";
import {
	StatisticKey,
	AttributeBoostDefinition,
	AttributeBoostTypeDefinition,
	SkillKey,
} from "@config";
import {
	Attributes,
	Resources,
	Statistics,
	Vitals,
	attributes,
	backgroundDetails,
	baseActorDetails,
	personalityDetails,
	resources,
	statistics,
	vitals,
} from "@models/actors/shared";
import { MigrationData, migrationData } from "@models/migration";

import TypeDataModel = foundry.abstract.TypeDataModel;
import fields = foundry.data.fields;

export const playerCharacterSchema = () => ({
	details: new fields.SchemaField({
		...baseActorDetails(),

		archetype: new fields.StringField({
			required: true,
			initial: "",
			label: "STARLIGHT_JOURNALS.Character.Archetype.Label",
		}),

		archetypeFieldEnabled: new fields.BooleanField({
			required: true,
			initial: true,
			label: "STARLIGHT_JOURNALS.Character.Archetype.Toggle",
		}),

		background: new fields.SchemaField(backgroundDetails()),
		personality: new fields.SchemaField(personalityDetails()),

		sexOrGender: new fields.StringField({
			required: true,
			initial: "",
			label: "STARLIGHT_JOURNALS.Character.SexOrGender",
		}),

		height: new fields.StringField({
			required: true,
			initial: "",
			label: "STARLIGHT_JOURNALS.Character.Height",
		}),

		frame: new fields.StringField({
			required: true,
			initial: "",
			label: "STARLIGHT_JOURNALS.Character.Frame",
		}),

		coloration: new fields.StringField({
			required: true,
			initial: "",
			label: "STARLIGHT_JOURNALS.Character.Coloration",
		}),
	}),
});

type PlayerCharacterSchema = ReturnType<typeof playerCharacterSchema>;

type BaseValueSource<Sources extends string> = [Sources, number];

type ValueSources = {
	statistics: BaseValueSource<StatisticKey>[],
	skills: BaseValueSource<SkillKey>[],
};

export declare namespace PlayerCharacterData {
	type Schema = foundry.data.fields.DataSchema
		& Attributes
		& Resources
		& Statistics
		& Vitals
		& PlayerCharacterSchema
		& MigrationData;

	type SchemaData = foundry.data.fields.SchemaField.InitializedData<Schema>;

	type BaseData = SchemaData & {
		vital: {
			health: { calculated: number },
			stamina: { calculated: number },
			nerve: { calculated: number },
		},

		statistics: {
			build: { calculated: number },
			coordination: { calculated: number },
			wits: { calculated: number },
			acuity: { calculated: number },
			empathy: { calculated: number },
			potency: { calculated: number },
		},

		attributes: {
			strength: { calculated: number },
			speed: { calculated: number },
			ingenuity: { calculated: number },
			resilience: { calculated: number },
			resolve: { calculated: number },
			charisma: { calculated: number },
			intensity: { calculated: number },
			capacity: { calculated: number; },
			charges: { calculated: number; },
		},

		resources: {
			assets: { calculated: number },
			influence: { calculated: number },
		},

		skills: {
			[Skill in SkillKey]: { level: number }
		},

		buildPointsReserved: number,
	}

	type DerivedData = {
		vital: {
			[Key in keyof BaseData["vital"]]: { sources: ValueSources }
		},

		statistics: {
			build: { level: number },
			coordination: { level: number },
			wits: { level: number },
			acuity: { level: number },
			empathy: { level: number },
			potency: { level: number },
			luck: { level: number },
		},

		attributes: {
			[Key in keyof BaseData["attributes"]]: { sources: ValueSources }
		},
	}
}

export class PlayerCharacterData extends TypeDataModel<
	PlayerCharacterData.Schema,
	Actor.Implementation,
	PlayerCharacterData.BaseData,
	PlayerCharacterData.DerivedData
> {
	static override defineSchema(): PlayerCharacterData.Schema {
		return {
			...vitals(),
			...statistics(),
			...attributes(),
			...resources(),
			...playerCharacterSchema(),
			...migrationData(),
		};
	}

	/* ====================================================================== */
	/* Data preparation                                                       */
	/* ====================================================================== */

	// Base data ------------------------------------------------------------ //

	public override prepareBaseData() {
		this.buildPointsReserved = 0;

		this._prepareStatistics();
		this._prepareAttributes();
		this._prepareResources();
		this._prepareSkills();
	}

	protected _prepareAttributes() {
		for (let key of typedObjectKeys(CONFIG.STARLIGHT_JOURNALS.attributes.vital)) {
			this.vital[key].calculated = this.vital[key].base;
			this.vital[key].sources = { skills: [], statistics: [] };
		}

		for (let key of typedObjectKeys(CONFIG.STARLIGHT_JOURNALS.attributes.attrs)) {
			this.attributes[key].calculated = this.attributes[key].base;
			this.attributes[key].sources = { skills: [], statistics: [] };
		}
	}

	protected _prepareResources() {
		for (let key of typedObjectKeys(CONFIG.STARLIGHT_JOURNALS.resources)) {
			this.resources[key].calculated = this.resources[key].base;
		}
	}

	protected _prepareSkills() {
		this.skills = typedObjectTransformEntries(
			CONFIG.STARLIGHT_JOURNALS.skills,
			skills => skills.map(([skill, _config]) => [skill, { level: 0 }]),
		);
	}

	protected _prepareStatistics() {
		for (let key of typedObjectKeys(CONFIG.STARLIGHT_JOURNALS.statistics)) {
			this.statistics[key].calculated = this.statistics[key].base;
		}
	}

	// Derived data --------------------------------------------------------- //

	public override prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>): void {
		for (let key of typedObjectKeys(CONFIG.STARLIGHT_JOURNALS.statistics)) {
			this.statistics[key].level = Math.floor(this.statistics[key].calculated / 10);
		}

		this.statistics.luck.level = Math.floor(this.statistics.luck.value / 10);

		// @ts-expect-error `this.fn()` in `PrepareDerivedDataThis` doubles up on layers for some reason, makes
		// identical `this` contexts not match. Same happens with `PrepareBaseDataThis` as well.
		// TODO(Ryos): report this issue to the fvtt-types devs (done, waiting on dev reply)
		this._propagateStatisticLevels();

		// @ts-expect-error see above
		this._propagateSkillLevels();

		// @ts-expect-error see above
		this._roundAttributes();

		// @ts-expect-error see above
		this._roundResources();
	}

	protected _propagateStatisticLevels(this: TypeDataModel.PrepareDerivedDataThis<this>) {
		let statistics = typedObjectTransformEntries(
			this.statistics,
			entries => entries.map(([stat, value]) => [stat, value.level!])
		);

		for (let [key, attrConfig] of typedObjectEntries(CONFIG.STARLIGHT_JOURNALS.attributes.vital)) {
			let sources = collectBoosts<StatisticKey>(attrConfig.baseStatistics, statistics);
			this.vital[key].sources.statistics = sources;
			this.vital[key].calculated +=
				sum(...sources.map(([_stat, value]) => value));
		}

		for (let [key, attrConfig] of typedObjectEntries(CONFIG.STARLIGHT_JOURNALS.attributes.attrs)) {
			let sources = collectBoosts<StatisticKey>(attrConfig.baseStatistics, statistics);
			this.attributes[key].sources.statistics = sources;
			this.attributes[key].calculated +=
				sum(...sources.map(([_stat, value]) => value));
		}
	}

	protected _propagateSkillLevels(this: TypeDataModel.PrepareDerivedDataThis<this>) {
		let skills = typedObjectTransformEntries(
			this.skills,
			entries => entries.map(([stat, value]) => [stat, value.level!]),
		);

		for (let [key, attrConfig] of typedObjectEntries(CONFIG.STARLIGHT_JOURNALS.attributes.vital)) {
			let sources = collectBoosts<SkillKey>(attrConfig.skillBoosts, skills);
			this.vital[key].sources.skills = sources;
			this.vital[key].calculated +=
				sum(...sources.map(([_stat, value]) => value));
		}

		for (let [key, attrConfig] of typedObjectEntries(CONFIG.STARLIGHT_JOURNALS.attributes.attrs)) {
			let sources = collectBoosts<SkillKey>(attrConfig.skillBoosts, skills);
			this.attributes[key].sources.skills = sources;
			this.attributes[key].calculated +=
				sum(...sources.map(([_stat, value]) => value));
		}
	}

	protected _roundAttributes(this: TypeDataModel.PrepareDerivedDataThis<this>) {
		for (let key of typedObjectKeys(CONFIG.STARLIGHT_JOURNALS.attributes.vital)) {
			this.vital[key].calculated = Math.ceil(this.vital[key].calculated);
		}

		for (let key of typedObjectKeys(CONFIG.STARLIGHT_JOURNALS.attributes.attrs)) {
			this.attributes[key].calculated = Math.ceil(this.attributes[key].calculated);
		}
	}

	protected _roundResources(this: TypeDataModel.PrepareDerivedDataThis<this>) {
		for (let key of typedObjectKeys(CONFIG.STARLIGHT_JOURNALS.resources)) {
			this.resources[key].calculated = Math.ceil(this.resources[key].calculated);
		}
	}
}

function collectBoosts<const Keys extends string>(boosts: AttributeBoostDefinition<Keys>[], values: Record<Keys, number>) {
	return boosts.flatMap<BaseValueSource<Keys>>(boost => {
		let key: AttributeBoostTypeDefinition<Keys>;
		if ("statistic" in boost) {
			key = boost.statistic;
		} else { // ("skill" in boost)
			key = boost.skill;
		}

		if (typeof key != "string") {
			return selectHighest(key.higherOf, key.amount, values)
				.map<BaseValueSource<Keys>>(key => [key, Math.ceil(values[key] * boost.mod)]);
		} else {
			return [[key, Math.ceil(values[key] * boost.mod)]];
		}
	});
}

/** Given a list of keys, select `amount` items from the provided dictionary, and return each selected item's key and value. */
function selectHighest<const Keys extends string>(sourceList: Keys[], amount: number, values: Record<Keys, number>) {
	return sourceList.map<BaseValueSource<Keys>>(key => [key, values[key]])
		.sort((a, b) => b[1] - a[1])
		.slice(0, amount)
		.reduce<Keys[]>((acc, source) => [...acc, source[0]], []);
}
