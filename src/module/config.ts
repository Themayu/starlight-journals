import { documentConfig } from "@config/document-config";
import { Tuple } from "@data/types";
import { Exact } from "ts-essentials";

export type STARLIGHT_JOURNALS = "STARLIGHT_JOURNALS";

/* ========================================================================== */
/* Statistics                                                                 */
/* ========================================================================== */

export type StatisticDefinition = {
	label: `${STARLIGHT_JOURNALS}.Statistics.${Capitalize<string>}.Label`,
	level: `${STARLIGHT_JOURNALS}.Statistics.${Capitalize<string>}.Level`,
	abbreviation: `${STARLIGHT_JOURNALS}.Statistics.${Capitalize<string>}.Abbr`,
	summary: `${STARLIGHT_JOURNALS}.Statistics.${Capitalize<string>}.Summary`,
};

const statistics = {
	build: {
		label: "STARLIGHT_JOURNALS.Statistics.Build.Label",
		level: "STARLIGHT_JOURNALS.Statistics.Build.Level",
		abbreviation: "STARLIGHT_JOURNALS.Statistics.Build.Abbr",
		summary: "STARLIGHT_JOURNALS.Statistics.Build.Summary",
	},

	coordination: {
		label: "STARLIGHT_JOURNALS.Statistics.Coordination.Label",
		level: "STARLIGHT_JOURNALS.Statistics.Coordination.Level",
		abbreviation: "STARLIGHT_JOURNALS.Statistics.Coordination.Abbr",
		summary: "STARLIGHT_JOURNALS.Statistics.Coordination.Summary",
	},

	wits: {
		label: "STARLIGHT_JOURNALS.Statistics.Wits.Label",
		level: "STARLIGHT_JOURNALS.Statistics.Wits.Level",
		abbreviation: "STARLIGHT_JOURNALS.Statistics.Wits.Abbr",
		summary: "STARLIGHT_JOURNALS.Statistics.Wits.Summary",
	},

	acuity: {
		label: "STARLIGHT_JOURNALS.Statistics.Acuity.Label",
		level: "STARLIGHT_JOURNALS.Statistics.Acuity.Level",
		abbreviation: "STARLIGHT_JOURNALS.Statistics.Acuity.Abbr",
		summary: "STARLIGHT_JOURNALS.Statistics.Acuity.Summary",
	},

	empathy: {
		label: "STARLIGHT_JOURNALS.Statistics.Empathy.Label",
		level: "STARLIGHT_JOURNALS.Statistics.Empathy.Level",
		abbreviation: "STARLIGHT_JOURNALS.Statistics.Empathy.Abbr",
		summary: "STARLIGHT_JOURNALS.Statistics.Empathy.Summary",
	},

	potency: {
		label: "STARLIGHT_JOURNALS.Statistics.Potency.Label",
		level: "STARLIGHT_JOURNALS.Statistics.Potency.Level",
		abbreviation: "STARLIGHT_JOURNALS.Statistics.Potency.Abbr",
		summary: "STARLIGHT_JOURNALS.Statistics.Potency.Summary",
	},
} as const satisfies Record<string, StatisticDefinition>;

export type StatisticKey = keyof typeof statistics;

/* ========================================================================== */
/* Focuses                                                                    */
/* ========================================================================== */

export type FocusDefinition = {
	label: `${STARLIGHT_JOURNALS}.Focuses.${string}`,
};

const focuses = {
	biology: { label: "STARLIGHT_JOURNALS.Focuses.Biology" },
	dexterity: { label: "STARLIGHT_JOURNALS.Focuses.Dexterity" },
	exploration: { label: "STARLIGHT_JOURNALS.Focuses.Exploration" },
	physics: { label: "STARLIGHT_JOURNALS.Focuses.Physics" },
	physical: { label: "STARLIGHT_JOURNALS.Focuses.Physical" },
	psychic: { label: "STARLIGHT_JOURNALS.Focuses.Psychic" },
	mechanical: { label: "STARLIGHT_JOURNALS.Focuses.Mechanical" },
	willpower: { label: "STARLIGHT_JOURNALS.Focuses.Willpower" },
	social: { label: "STARLIGHT_JOURNALS.Focuses.Social" },
	general: { label: "STARLIGHT_JOURNALS.Focuses.General" },
} as const satisfies Record<string, FocusDefinition>;

export type FocusKey = keyof typeof focuses;

/* ========================================================================== */
/* Attributes                                                                 */
/* ========================================================================== */

type IsExact<T, U> = Exact<T, U> extends never ? false : true;

export type AttributeTypeDefinitions
	= { type: "attribute" }
	| { type: "vital", current: `${STARLIGHT_JOURNALS}.Attributes.${Capitalize<string>}.Current` }
	| { type: "resource" | "limit", remaining: `${STARLIGHT_JOURNALS}.Attributes.${Capitalize<string>}.Remaining` };

export type AttributeBoostTypeDefinition<Keys extends string>
	= Keys | { higherOf: Keys[], amount: number };

export type AttributeBoostDefinition<Keys extends string> = { mod: number }
	& (IsExact<Keys, StatisticKey> extends true ? { statistic: AttributeBoostTypeDefinition<Keys> }
	: IsExact<Keys, SkillKey> extends true ? { skill: AttributeBoostTypeDefinition<Keys> }
	: never);

export type AttributeDefinition
	// base fields
	= {
		label: `${STARLIGHT_JOURNALS}.Attributes.${Capitalize<string>}.Label`,
		description: {
			general: `${STARLIGHT_JOURNALS}.Attributes.${Capitalize<string>}.GeneralDescription`,
			player: `${STARLIGHT_JOURNALS}.Attributes.${Capitalize<string>}.PlayerDescription`,
		},

		baseStatistics: AttributeBoostDefinition<StatisticKey>[],
		skillBoosts: AttributeBoostDefinition<SkillKey>[],
	// type-specific fields
	} & AttributeTypeDefinitions;

function attributeDescription<
	Attr extends "health" | "stamina" | "nerve" | "assets" | "capacity" | "charges" | "charisma" | "influence" | "ingenuity" | "intensity" | "resilience" | "resolve" | "speed" | "strength",
>(attribute: Attr) {
	const capitalized: Capitalize<Attr> =
		attribute.substring(0).toUpperCase() + attribute.substring(1) as any;

	return {
		description: {
			general: `STARLIGHT_JOURNALS.Attributes.${capitalized}.GeneralDescription`,
			player: `STARLIGHT_JOURNALS.Attributes.${capitalized}.PlayerDescription`,
		},
	} satisfies Pick<AttributeDefinition, "description">;
}

const attributes = {
	vital: {
		health: {
			label: "STARLIGHT_JOURNALS.Attributes.Health.Label",
			type: "vital",
			current: "STARLIGHT_JOURNALS.Attributes.Health.Current",
			baseStatistics: [
				{ statistic: "build", mod: 1 },
				{ statistic: "coordination", mod: 0.5 },
			],

			skillBoosts: [
				{ skill: "endurance", mod: 1 },
				{ skill: "medicine", mod: 1 },
			],

			...attributeDescription("health"),
		},

		stamina: {
			label: "STARLIGHT_JOURNALS.Attributes.Stamina.Label",
			type: "vital",
			current: "STARLIGHT_JOURNALS.Attributes.Stamina.Current",
			baseStatistics: [
				{
					statistic: {
						higherOf: ["build", "coordination", "wits", "potency"],
						amount: 2,
					},

					mod: 1,
				},
			],

			skillBoosts: [
				{ skill: "acrobatics", mod: 1 },
				{ skill: "athletics", mod: 1 },
				{ skill: "endurance", mod: 1 },
			],

			...attributeDescription("stamina"),
		},

		nerve: {
			label: "STARLIGHT_JOURNALS.Attributes.Nerve.Label",
			type: "vital",
			current: "STARLIGHT_JOURNALS.Attributes.Nerve.Current",
			baseStatistics: [
				{
					statistic: {
						higherOf: ["empathy", "potency"],
						amount: 1,
					},

					mod: 1,
				},
			],

			skillBoosts: [
				{ skill: "composure", mod: 1 },
				{ skill: "determination", mod: 1 },
			],

			...attributeDescription("nerve"),
		},
	},

	attrs: {
		capacity: {
			label: "STARLIGHT_JOURNALS.Attributes.Capacity.Label",
			type: "limit",
			remaining: "STARLIGHT_JOURNALS.Attributes.Capacity.Remaining",
			baseStatistics: [
				{ statistic: "build", mod: 1 },
				{ statistic: "coordination", mod: 1 },
			],

			skillBoosts: [
				{ skill: "athletics", mod: 1 },
				{ skill: "heavyGuns", mod: 1 },
				{ skill: "heavyMelee", mod: 1 },
			],

			...attributeDescription("capacity"),
		},

		charisma: {
			label: "STARLIGHT_JOURNALS.Attributes.Charisma.Label",
			type: "attribute",
			baseStatistics: [
				{ statistic: "empathy", mod: 1 },
				{ statistic: "wits", mod: 0.5 },
			],

			skillBoosts: [
				{
					skill: {
						higherOf: ["deception", "persuasion"],
						amount: 1,
					},

					mod: 1,
				},
			],

			...attributeDescription("charisma"),
		},

		ingenuity: {
			label: "STARLIGHT_JOURNALS.Attributes.Ingenuity.Label",
			type: "attribute",
			baseStatistics: [
				{ statistic: "acuity", mod: 1 },
				{ statistic: "wits", mod: 0.5 },
			],

			skillBoosts: [
				{ skill: "research", mod: 1 },
			],

			...attributeDescription("ingenuity"),
		},

		intensity: {
			label: "STARLIGHT_JOURNALS.Attributes.Intensity.Label",
			type: "attribute",
			baseStatistics: [
				{ statistic: "potency", mod: 1 },
			],

			skillBoosts: [
				{ skill: "control", mod: 1 },
			],

			...attributeDescription("intensity"),
		},

		resilience: {
			label: "STARLIGHT_JOURNALS.Attributes.Resilience.Label",
			type: "attribute",
			baseStatistics: [
				{ statistic: "build", mod: 1 },
			],

			skillBoosts: [],
			...attributeDescription("resilience"),
		},

		resolve: {
			label: "STARLIGHT_JOURNALS.Attributes.Resolve.Label",
			type: "attribute",
			baseStatistics: [
				{ statistic: "wits", mod: 1 },
				{ statistic: "empathy", mod: 0.5 },
			],

			skillBoosts: [
				{ skill: "determination", mod: 1 },
			],

			...attributeDescription("resolve"),
		},

		speed: {
			label: "STARLIGHT_JOURNALS.Attributes.Speed.Label",
			type: "attribute",
			baseStatistics: [
				{ statistic: "coordination", mod: 1 },
			],

			skillBoosts: [
				{ skill: "acrobatics", mod: 1 },
				{ skill: "athletics", mod: 1 },
			],

			...attributeDescription("speed"),
		},

		strength: {
			label: "STARLIGHT_JOURNALS.Attributes.Strength.Label",
			type: "attribute",
			baseStatistics: [
				{ statistic: "build", mod: 0.5 },
			],

			skillBoosts: [
				{ skill: "athletics", mod: 1 },
			],

			...attributeDescription("strength"),
		},

		charges: {
			label: "STARLIGHT_JOURNALS.Attributes.Charges.Label",
			type: "resource",
			remaining: "STARLIGHT_JOURNALS.Attributes.Charges.Remaining",
			baseStatistics: [
				{
					statistic: {
						higherOf: ["empathy", "potency"],
						amount: 1,
					},

					mod: 1,
				},
			],

			skillBoosts: [
				{ skill: "control", mod: 1 },
			],

			...attributeDescription("charges"),
		},
	},
} satisfies Record<"attrs" | "vital", Record<string, AttributeDefinition>>;

export type AttributeCategory = keyof typeof attributes;

export type VitalAttributeKey = keyof typeof attributes["vital"];
export type AttributeKey = keyof typeof attributes["attrs"];

export type AnyAttributeKey = VitalAttributeKey | AttributeKey;

/* ========================================================================== */
/* Skills                                                                     */
/* ========================================================================== */

export type SkillAttributeBoostDefinition
	= { type: "vital", attribute: VitalAttributeKey, mod: number }
	| { type: "attr", attribute: AttributeKey, mod: number };

export type SkillDefinition = {
	label: `${STARLIGHT_JOURNALS}.Skills.${Capitalize<string>}.Label`,
	summary: `${STARLIGHT_JOURNALS}.Skills.${Capitalize<string>}.Summary`,
	description: `${STARLIGHT_JOURNALS}.Skills.${Capitalize<string>}.Description`,
	focus: FocusKey,
	primaryStatistic: StatisticKey,
	altStatistics: Array<{
		statistic: StatisticKey,
		use: `${STARLIGHT_JOURNALS}.Skills.${Capitalize<string>}.AltStatistics.${Capitalize<StatisticKey>}`,
	}>,
};

const skills = {
	acrobatics: {
		label: "STARLIGHT_JOURNALS.Skills.Acrobatics.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Acrobatics.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Acrobatics.Description",
		focus: "dexterity",
		primaryStatistic: "coordination",
		altStatistics: [
			{
				statistic: "build",
				use: "STARLIGHT_JOURNALS.Skills.Acrobatics.AltStatistics.Build",
			},
		],
	},

	aeFab: {
		label: "STARLIGHT_JOURNALS.Skills.AEFab.Label",
		summary: "STARLIGHT_JOURNALS.Skills.AEFab.Summary",
		description: "STARLIGHT_JOURNALS.Skills.AEFab.Description",
		focus: "physics",
		primaryStatistic: "acuity",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.AEFab.AltStatistics.Wits",
			},
		],
	},

	animalHandling: {
		label: "STARLIGHT_JOURNALS.Skills.AnimalHandling.Label",
		summary: "STARLIGHT_JOURNALS.Skills.AnimalHandling.Summary",
		description: "STARLIGHT_JOURNALS.Skills.AnimalHandling.Description",
		focus: "biology",
		primaryStatistic: "empathy",
		altStatistics: [
			{
				statistic: "acuity",
				use: "STARLIGHT_JOURNALS.Skills.AnimalHandling.AltStatistics.Acuity",
			},
			{
				statistic: "potency",
				use: "STARLIGHT_JOURNALS.Skills.AnimalHandling.AltStatistics.Potency",
			},
		],
	},

	antiquarian: {
		label: "STARLIGHT_JOURNALS.Skills.Antiquarian.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Antiquarian.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Antiquarian.Description",
		focus: "general",
		primaryStatistic: "acuity",
		altStatistics: [
			{
				statistic: "empathy",
				use: "STARLIGHT_JOURNALS.Skills.Antiquarian.AltStatistics.Empathy",
			}
		],
	},

	athletics: {
		label: "STARLIGHT_JOURNALS.Skills.Athletics.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Athletics.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Athletics.Description",
		focus: "physical",
		primaryStatistic: "build",
		altStatistics: [
			{
				statistic: "coordination",
				use: "STARLIGHT_JOURNALS.Skills.Athletics.AltStatistics.Coordination",
			},
		],
	},

	bioFab: {
		label: "STARLIGHT_JOURNALS.Skills.BioFab.Label",
		summary: "STARLIGHT_JOURNALS.Skills.BioFab.Summary",
		description: "STARLIGHT_JOURNALS.Skills.BioFab.Description",
		focus: "biology",
		primaryStatistic: "acuity",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.BioFab.AltStatistics.Wits",
			},
		],
	},

	chemistry: {
		label: "STARLIGHT_JOURNALS.Skills.Chemistry.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Chemistry.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Chemistry.Description",
		focus: "general",
		primaryStatistic: "acuity",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.Chemistry.AltStatistics.Wits",
			},
		],
	},

	composure: {
		label: "STARLIGHT_JOURNALS.Skills.Composure.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Composure.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Composure.Description",
		focus: "willpower",
		primaryStatistic: "wits",
		altStatistics: [
			{
				statistic: "potency",
				use: "STARLIGHT_JOURNALS.Skills.Composure.AltStatistics.Potency",
			},
		],
	},

	control: {
		label: "STARLIGHT_JOURNALS.Skills.Control.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Control.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Control.Description",
		focus: "psychic",
		primaryStatistic: "potency",
		altStatistics: [
			{
				statistic: "empathy",
				use: "STARLIGHT_JOURNALS.Skills.Control.AltStatistics.Empathy",
			},
		],
	},

	cooking: {
		label: "STARLIGHT_JOURNALS.Skills.Cooking.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Cooking.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Cooking.Description",
		focus: "exploration",
		primaryStatistic: "wits",
		altStatistics: [
			{
				statistic: "acuity",
				use: "STARLIGHT_JOURNALS.Skills.Cooking.AltStatistics.Acuity",
			},
		],
	},

	cqc: {
		label: "STARLIGHT_JOURNALS.Skills.CQC.Label",
		summary: "STARLIGHT_JOURNALS.Skills.CQC.Summary",
		description: "STARLIGHT_JOURNALS.Skills.CQC.Description",
		focus: "physical",
		primaryStatistic: "build",
		altStatistics: [
			{
				statistic: "coordination",
				use: "STARLIGHT_JOURNALS.Skills.CQC.AltStatistics.Coordination",
			},
		],
	},

	deception: {
		label: "STARLIGHT_JOURNALS.Skills.Deception.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Deception.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Deception.Description",
		focus: "social",
		primaryStatistic: "empathy",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.Deception.AltStatistics.Wits",
			},
		],
	},

	determination: {
		label: "STARLIGHT_JOURNALS.Skills.Determination.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Determination.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Determination.Description",
		focus: "willpower",
		primaryStatistic: "wits",
		altStatistics: [
			{
				statistic: "potency",
				use: "STARLIGHT_JOURNALS.Skills.Determination.AltStatistics.Potency",
			},
		],
	},

	endurance: {
		label: "STARLIGHT_JOURNALS.Skills.Endurance.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Endurance.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Endurance.Description",
		focus: "physical",
		primaryStatistic: "build",
		altStatistics: [
			{
				statistic: "potency",
				use: "STARLIGHT_JOURNALS.Skills.Endurance.AltStatistics.Potency",
			},
		],
	},

	energetics: {
		label: "STARLIGHT_JOURNALS.Skills.Energetics.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Energetics.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Energetics.Description",
		focus: "physics",
		primaryStatistic: "wits",
		altStatistics: [
			{
				statistic: "acuity",
				use: "STARLIGHT_JOURNALS.Skills.Energetics.AltStatistics.Acuity",
			},
		],
	},

	finesse: {
		label: "STARLIGHT_JOURNALS.Skills.Finesse.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Finesse.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Finesse.Description",
		focus: "dexterity",
		primaryStatistic: "coordination",
		altStatistics: [
			{
				statistic: "build",
				use: "STARLIGHT_JOURNALS.Skills.Finesse.AltStatistics.Build",
			},
		],
	},

	firstAid: {
		label: "STARLIGHT_JOURNALS.Skills.FirstAid.Label",
		summary: "STARLIGHT_JOURNALS.Skills.FirstAid.Summary",
		description: "STARLIGHT_JOURNALS.Skills.FirstAid.Description",
		focus: "biology",
		primaryStatistic: "wits",
		altStatistics: [
			{
				statistic: "acuity",
				use: "STARLIGHT_JOURNALS.Skills.FirstAid.AltStatistics.Acuity",
			},
		],
	},

	heavyGuns: {
		label: "STARLIGHT_JOURNALS.Skills.HeavyGuns.Label",
		summary: "STARLIGHT_JOURNALS.Skills.HeavyGuns.Summary",
		description: "STARLIGHT_JOURNALS.Skills.HeavyGuns.Description",
		focus: "physical",
		primaryStatistic: "build",
		altStatistics: [
			{
				statistic: "coordination",
				use: "STARLIGHT_JOURNALS.Skills.HeavyGuns.AltStatistics.Coordination",
			},
		],
	},

	heavyMelee: {
		label: "STARLIGHT_JOURNALS.Skills.HeavyMelee.Label",
		summary: "STARLIGHT_JOURNALS.Skills.HeavyMelee.Summary",
		description: "STARLIGHT_JOURNALS.Skills.HeavyMelee.Description",
		focus: "physical",
		primaryStatistic: "build",
		altStatistics: [],	},

	inquiry: {
		label: "STARLIGHT_JOURNALS.Skills.Inquiry.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Inquiry.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Inquiry.Description",
		focus: "social",
		primaryStatistic: "empathy",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.Inquiry.AltStatistics.Wits",
			},
		],
	},

	interlacing: {
		label: "STARLIGHT_JOURNALS.Skills.Interlacing.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Interlacing.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Interlacing.Description",
		focus: "psychic",
		primaryStatistic: "potency",
		altStatistics: [
			{
				statistic: "acuity",
				use: "STARLIGHT_JOURNALS.Skills.Interlacing.AltStatistics.Acuity",
			},
		],
	},

	intimidation: {
		label: "STARLIGHT_JOURNALS.Skills.Intimidation.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Intimidation.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Intimidation.Description",
		focus: "willpower",
		primaryStatistic: "potency",
		altStatistics: [
			{
				statistic: "build",
				use: "STARLIGHT_JOURNALS.Skills.Intimidation.AltStatistics.Build",
			},
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.Intimidation.AltStatistics.Wits",
			},
		],
	},

	knowledge: {
		label: "STARLIGHT_JOURNALS.Skills.Knowledge.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Knowledge.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Knowledge.Description",
		focus: "general",
		primaryStatistic: "acuity",
		altStatistics: [],	},

	longArms: {
		label: "STARLIGHT_JOURNALS.Skills.LongArms.Label",
		summary: "STARLIGHT_JOURNALS.Skills.LongArms.Summary",
		description: "STARLIGHT_JOURNALS.Skills.LongArms.Description",
		focus: "dexterity",
		primaryStatistic: "coordination",
		altStatistics: [
			{
				statistic: "build",
				use: "STARLIGHT_JOURNALS.Skills.LongArms.AltStatistics.Build",
			},
		],
	},

	magnetism: {
		label: "STARLIGHT_JOURNALS.Skills.Magnetism.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Magnetism.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Magnetism.Description",
		focus: "willpower",
		primaryStatistic: "empathy",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.Magnetism.AltStatistics.Wits",
			},
		],
	},

	mechFab: {
		label: "STARLIGHT_JOURNALS.Skills.MechFab.Label",
		summary: "STARLIGHT_JOURNALS.Skills.MechFab.Summary",
		description: "STARLIGHT_JOURNALS.Skills.MechFab.Description",
		focus: "mechanical",
		primaryStatistic: "acuity",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.MechFab.AltStatistics.Wits",
			},
		],
	},

	medicine: {
		label: "STARLIGHT_JOURNALS.Skills.Medicine.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Medicine.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Medicine.Description",
		focus: "biology",
		primaryStatistic: "acuity",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.Medicine.AltStatistics.Wits",
			},
		],
	},

	navigation: {
		label: "STARLIGHT_JOURNALS.Skills.Navigation.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Navigation.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Navigation.Description",
		focus: "physics",
		primaryStatistic: "acuity",
		altStatistics: [
			{
				statistic: "coordination",
				use: "STARLIGHT_JOURNALS.Skills.Navigation.AltStatistics.Coordination",
			},
		],
	},

	perception: {
		label: "STARLIGHT_JOURNALS.Skills.Perception.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Perception.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Perception.Description",
		focus: "exploration",
		primaryStatistic: "wits",
		altStatistics: [
			{
				statistic: "coordination",
				use: "STARLIGHT_JOURNALS.Skills.Perception.AltStatistics.Coordination",
			},
		],
	},

	performance: {
		label: "STARLIGHT_JOURNALS.Skills.Performance.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Performance.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Performance.Description",
		focus: "social",
		primaryStatistic: "empathy",
		altStatistics: [
			{
				statistic: "coordination",
				use: "STARLIGHT_JOURNALS.Skills.Performance.AltStatistics.Coordination",
			},
		],
	},

	persuasion: {
		label: "STARLIGHT_JOURNALS.Skills.Persuasion.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Persuasion.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Persuasion.Description",
		focus: "social",
		primaryStatistic: "empathy",
		altStatistics: [
			{
				statistic: "acuity",
				use: "STARLIGHT_JOURNALS.Skills.Persuasion.AltStatistics.Acuity",
			},
		],
	},

	piloting: {
		label: "STARLIGHT_JOURNALS.Skills.Piloting.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Piloting.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Piloting.Description",
		focus: "exploration",
		primaryStatistic: "coordination",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.Piloting.AltStatistics.Wits",
			},
		],
	},

	programming: {
		label: "STARLIGHT_JOURNALS.Skills.Programming.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Programming.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Programming.Description",
		focus: "mechanical",
		primaryStatistic: "acuity",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.Programming.AltStatistics.Wits",
			},
		],
	},

	psiTechFab: {
		label: "STARLIGHT_JOURNALS.Skills.PsiTechFab.Label",
		summary: "STARLIGHT_JOURNALS.Skills.PsiTechFab.Summary",
		description: "STARLIGHT_JOURNALS.Skills.PsiTechFab.Description",
		focus: "psychic",
		primaryStatistic: "potency",
		altStatistics: [
			{
				statistic: "acuity",
				use: "STARLIGHT_JOURNALS.Skills.PsiTechFab.AltStatistics.Acuity",
			},
		],
	},

	repair: {
		label: "STARLIGHT_JOURNALS.Skills.Repair.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Repair.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Repair.Description",
		focus: "mechanical",
		primaryStatistic: "wits",
		altStatistics: [
			{
				statistic: "acuity",
				use: "STARLIGHT_JOURNALS.Skills.Repair.AltStatistics.Acuity",
			},
		],
	},

	research: {
		label: "STARLIGHT_JOURNALS.Skills.Research.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Research.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Research.Description",
		focus: "general",
		primaryStatistic: "acuity",
		altStatistics: [
			{
				statistic: "empathy",
				use: "STARLIGHT_JOURNALS.Skills.Research.AltStatistics.Empathy",
			},
		],
	},

	scanning: {
		label: "STARLIGHT_JOURNALS.Skills.Scanning.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Scanning.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Scanning.Description",
		focus: "physics",
		primaryStatistic: "acuity",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.Scanning.AltStatistics.Wits",
			},
		],
	},

	security: {
		label: "STARLIGHT_JOURNALS.Skills.Security.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Security.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Security.Description",
		focus: "mechanical",
		primaryStatistic: "wits",
		altStatistics: [
			{
				statistic: "coordination",
				use: "STARLIGHT_JOURNALS.Skills.Security.AltStatistics.Coordination",
			},
		],
	},

	sidearms: {
		label: "STARLIGHT_JOURNALS.Skills.Sidearms.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Sidearms.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Sidearms.Description",
		focus: "dexterity",
		primaryStatistic: "coordination",
		altStatistics: [],	},

	stealth: {
		label: "STARLIGHT_JOURNALS.Skills.Stealth.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Stealth.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Stealth.Description",
		focus: "exploration",
		primaryStatistic: "coordination",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.Stealth.AltStatistics.Wits",
			},
		],
	},

	survival: {
		label: "STARLIGHT_JOURNALS.Skills.Survival.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Survival.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Survival.Description",
		focus: "exploration",
		primaryStatistic: "wits",
		altStatistics: [
			{
				statistic: "coordination",
				use: "STARLIGHT_JOURNALS.Skills.Survival.AltStatistics.Coordination",
			},
		],
	},

	telekinesis: {
		label: "STARLIGHT_JOURNALS.Skills.Telekinesis.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Telekinesis.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Telekinesis.Description",
		focus: "psychic",
		primaryStatistic: "potency",
		altStatistics: [
			{
				statistic: "build",
				use: "STARLIGHT_JOURNALS.Skills.Telekinesis.AltStatistics.Build",
			},
		],
	},

	telepathy: {
		label: "STARLIGHT_JOURNALS.Skills.Telepathy.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Telepathy.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Telepathy.Description",
		focus: "psychic",
		primaryStatistic: "empathy",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.Telepathy.AltStatistics.Wits",
			},
		],
	},

	trickery: {
		label: "STARLIGHT_JOURNALS.Skills.Trickery.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Trickery.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Trickery.Description",
		focus: "dexterity",
		primaryStatistic: "coordination",
		altStatistics: [
			{
				statistic: "wits",
				use: "STARLIGHT_JOURNALS.Skills.Trickery.AltStatistics.Wits",
			},
		],
	},

	xenology: {
		label: "STARLIGHT_JOURNALS.Skills.Xenology.Label",
		summary: "STARLIGHT_JOURNALS.Skills.Xenology.Summary",
		description: "STARLIGHT_JOURNALS.Skills.Xenology.Description",
		focus: "biology",
		primaryStatistic: "acuity",
		altStatistics: [],	},
} as const satisfies Record<string, SkillDefinition>;

export type SkillKey = keyof typeof skills;

/* ========================================================================== */
/* Resources                                                                  */
/* ========================================================================== */

const resources = {
	assets: {
		label: "STARLIGHT_JOURNALS.Attributes.Assets.Label",
		type: "resource",
		remaining: "STARLIGHT_JOURNALS.Attributes.Assets.Remaining",
		...attributeDescription("assets"),
	},

	influence: {
		label: "STARLIGHT_JOURNALS.Attributes.Influence.Label",
		type: "resource",
		remaining: "STARLIGHT_JOURNALS.Attributes.Influence.Remaining",
		...attributeDescription("influence"),
	},
};

export type ResourceKey = keyof typeof resources;

/* ========================================================================== */
/* Advancement                                                                */
/* ========================================================================== */

// Levels ------------------------------------------------------------------- //

export type LevelThresholdDefinition = {
	threshold: number;
	level: string;
};

const levelThresholds = [
	{ threshold: 0, level: "trainee" },
	{ threshold: 250, level: "amateur" },
	{ threshold: 750, level: "professional" },
	{ threshold: 1500, level: "ace" },
	{ threshold: 2500, level: "elite" },
	{ threshold: 3750, level: "epitome" },
] as const satisfies LevelThresholdDefinition[];

export type LevelDefinition = {
	label: `${STARLIGHT_JOURNALS}.Advancement.Levels.${Capitalize<string>}.Label`,
	skillLevelCap: number,
	talentLevelCap: number,
	talentT4Cap?: number,
	statisticBoostCap: number,
	attributeBoostCap: number,
	assetsBaseCap: number,
};

const levels = {
	trainee: {
		label: "STARLIGHT_JOURNALS.Advancement.Levels.Trainee.Label",
		skillLevelCap: 4,
		talentLevelCap: 2,
		statisticBoostCap: 15,
		attributeBoostCap: 3,
		assetsBaseCap: 15
	},

	amateur: {
		label: "STARLIGHT_JOURNALS.Advancement.Levels.Amateur.Label",
		skillLevelCap: 5,
		talentLevelCap: 2,
		statisticBoostCap: 15,
		attributeBoostCap: 4,
		assetsBaseCap: 20,
	},

	professional: {
		label: "STARLIGHT_JOURNALS.Advancement.Levels.Professional.Label",
		skillLevelCap: 6,
		talentLevelCap: 3,
		talentT4Cap: 1,
		statisticBoostCap: 20,
		attributeBoostCap: 5,
		assetsBaseCap: 28,
	},

	ace: {
		label: "STARLIGHT_JOURNALS.Advancement.Levels.Ace.Label",
		skillLevelCap: 7,
		talentLevelCap: 3,
		talentT4Cap: 2,
		statisticBoostCap: 25,
		attributeBoostCap: 6,
		assetsBaseCap: 38,
	},

	elite: {
		label: "STARLIGHT_JOURNALS.Advancement.Levels.Elite.Label",
		skillLevelCap: 7,
		talentLevelCap: 4,
		statisticBoostCap: 30,
		attributeBoostCap: 8,
		assetsBaseCap: 50,
	},

	epitome: {
		label: "STARLIGHT_JOURNALS.Advancement.Levels.Epitome.Label",
		skillLevelCap: 8,
		talentLevelCap: 4,
		statisticBoostCap: 35,
		attributeBoostCap: 10,
		assetsBaseCap: 62,
	},
} satisfies Record<typeof levelThresholds[number]["level"], LevelDefinition>;

export type LevelKey = keyof typeof levels;

// Advancement costs -------------------------------------------------------- //

export type CostDefinitionFlat = number;
export type CostDefinitionWithFocus = { unfocused: number, focused: number };

const attributeCosts = {
	// vitals
	health:     [  5,  5,  5,  5,  5, 10, 10, 10,  10,  10 ],
	stamina:    [  5,  5,  5,  5,  5, 10, 10, 10,  10,  10 ],
	nerve:      [  2,  3,  5,  5,  5,  5,  5, 10,  10,  10 ],

	// attributes
	strength:   [ 10, 15, 25, 35, 45, 55, 65, 80,  90, 100 ],
	speed:      [  5, 10, 10, 15, 20, 25, 30, 35,  40,  45 ],
	ingenuity:  [  5, 10, 15, 20, 25, 30, 35, 40,  45,  50 ],
	resilience: [ 10, 20, 30, 40, 50, 60, 70, 85, 100, 120 ],
	resolve:    [ 10, 15, 20, 25, 30, 35, 40, 45,  50,  60 ],
	charisma:   [  5, 10, 15, 20, 25, 30, 35, 40,  45,  50 ],
	intensity:  [ 10, 15, 25, 35, 45, 55, 65, 80,  90, 100 ],
	capacity:   [  5, 10, 10, 15, 20, 25, 30, 35,  40,  45 ],
} satisfies Record<
	Exclude<AnyAttributeKey, "charges">,
	Tuple<CostDefinitionFlat, 10>
>;

const skillCosts = [
	{ unfocused: 10, focused:  5 },
	{ unfocused: 20, focused: 10 },
	{ unfocused: 30, focused: 15 },
	{ unfocused: 40, focused: 20 },
	{ unfocused: 50, focused: 25 },
	{ unfocused: 60, focused: 30 },
	{ unfocused: 70, focused: 35 },
	{ unfocused: 80, focused: 40 },
] satisfies Tuple<CostDefinitionWithFocus, 8>;

const statisticCosts = [
	10,
	25,
	40,
	55,
	70,
	85,
	100,
] satisfies Tuple<CostDefinitionFlat, 7>;

const talentCosts = [
	{ unfocused: 20, focused: 10 },
	{ unfocused: 30, focused: 20 },
	{ unfocused: 40, focused: 30 },
	{ unfocused: 60, focused: 45 },
] satisfies Tuple<CostDefinitionWithFocus, 4>;

// Advancement rollup ------------------------------------------------------- //

const advancement = {
	levels,
	attributeCosts,
	skillCosts,
	statisticCosts,
	talentCosts,
};

/* ========================================================================== */
/* Configuration rollup                                                       */
/* ========================================================================== */

export const STARLIGHT_JOURNALS = {
	advancement,
	statistics,
	attributes,
	resources,
	focuses,
	skills,

	...documentConfig(),
}
