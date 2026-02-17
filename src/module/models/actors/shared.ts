import { baseFieldTemplate, valueFieldTemplate } from "@models/fields";
import fields = foundry.data.fields;

/* ========================================================================== */
/* Actor schemas                                                              */
/* -------------------------------------------------------------------------- */
/* Fields shared between all actor types                                      */
/* ========================================================================== */

export function baseActorDetails() {
	return {
		description: new fields.StringField({
			required: true,
			initial: "",
			label: "STARLIGHT_JOURNALS.Description",
		}),

		notes: new fields.StringField({
			required: true,
			initial: "",
			label: "STARLIGHT_JOURNALS.Notes",
		}),
	};
}

export type BaseActorDetails = ReturnType<typeof baseActorDetails>;

/* ========================================================================== */
/* Character schemas                                                          */
/* -------------------------------------------------------------------------- */
/* Fields shared between player characters and NPCs                           */
/* ========================================================================== */

/**
 * Schema fields for a character's core statistics:
 * 
 * - **Build**: Strength, endurance, and durability.
 * - **Coordination**: Dexterity, coordination, and perception.
 * - **Wits**: Willpower, quick thinking, and ability to act under pressure.
 * - **Acuity**: Curiosity, ability to learn, and overall knowledge.
 * - **Empathy**: Ability to understand and relate to another person, and ability to wield empathetic psychic powers.
 * - **Potency**: General strength of psychic powers, and overall strength of personality.
 * - **Luck**: How much the universe favours the character. Used for re-rolls, surviving death, and other lucky breaks.
 *             Luck caps out at 50.
 */
export function statistics() {
	return {
		statistics: new fields.SchemaField({
			build: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: "STARLIGHT_JOURNALS.Statistics.Build.Name",
					max: 30,
				})),
			}),

			coordination: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: "STARLIGHT_JOURNALS.Statistics.Coordination.Name",
					max: 30,
				})),
			}),

			wits: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: "STARLIGHT_JOURNALS.Statistics.Wits.Name",
					max: 30,
				})),
			}),

			acuity: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: "STARLIGHT_JOURNALS.Statistics.Acuity.Name",
					max: 30,
				})),
			}),

			empathy: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: "STARLIGHT_JOURNALS.Statistics.Empathy.Name",
					max: 30,
				})),
			}),

			potency: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: "STARLIGHT_JOURNALS.Statistics.Potency.Name",
					max: 30,
				})),
			}),

			luck: new fields.SchemaField({
				value: new fields.NumberField(baseFieldTemplate({
					label: "STARLIGHT_JOURNALS.Statistics.Luck.Name",
					initial: 20,
					max: 50,
				})),

				spent: new fields.NumberField(valueFieldTemplate({
					label: "STARLIGHT_JOURNALS.Statistics.Luck.Spent",
					nullable: false,
					initial: 0,
				})),
			}),
		}),
	};
}

export type Statistics = ReturnType<typeof statistics>;

/**
 * Schema fields for a character's attributes:
 * 
 * - **Strength**: 
 * - **Speed**: 
 * - **Ingenuity**: 
 * - **Resilience**: 
 * - **Resolve**: The amount of nerve breaks a character can take before they fall apart.
 * - **Charisma**: 
 * - **Intensity**: 
 * - **Capacity**: How much mass a character can carry without being over-burdened.
 * - **Charges**: The amount of charges a character has to spend on psychic power use.
 */
export function attributes() {
	return {
		attributes: new fields.SchemaField({
			strength: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.attrs.strength.label,
				})),
			}),

			speed: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.attrs.speed.label,
				})),
			}),

			ingenuity: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
						label: CONFIG.STARLIGHT_JOURNALS.attributes.attrs.ingenuity.label,
				})),
			}),

			resilience: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.attrs.resilience.label,
				})),
			}),

			resolve: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.attrs.resolve.label,
				})),
			}),

			charisma: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.attrs.charisma.label,
				})),
			}),

			intensity: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.attrs.intensity.label,
				})),
			}),

			capacity: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.attrs.capacity.label,
				})),
			}),

			charges: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.attrs.charges.label,
					initial: 8,
				})),

				remaining: new fields.NumberField(valueFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.attrs.charges.remaining,
				})),
			}),
		}),
	};
}

export type Attributes = ReturnType<typeof attributes>;

/**
 * Schema fields for a character's resources:
 * 
 * - **Assets**: An abstract measurement of a character's finances. Allocated to equipment maintenance, and spent on
 *               augments. Player characters start with 11 Assets.
 */
export function resources() {
	return {
		resources: new fields.SchemaField({
			assets: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.resources.assets.label,
					initial: 11,
				})),
			}),

			influence: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.resources.influence.label,
				})),
			}),
		}),
	};
}

export type Resources = ReturnType<typeof resources>;

/**
 * Schema fields for a character's vital attributes:
 * 
 * - **Health**: How much physical damage a character can take before they start receiving injuries.
 * - **Stamina**: How much a character can physically exert themselves before suffering injuries from over-exertion.
 * - **Nerve**: How much mental strain a character can suffer before they start receiving mental injuries.
 */
export function vitals() {
	return {
		vital: new fields.SchemaField({
			health: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.vital.health.label,
					initial: 2,
				})),

				current: new fields.NumberField(valueFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.vital.health.current,
				})),
			}),

			stamina: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.vital.stamina.label,
				})),

				current: new fields.NumberField(valueFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.vital.stamina.current,
				})),
			}),

			nerve: new fields.SchemaField({
				base: new fields.NumberField(baseFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.vital.nerve.label,
					initial: 4,
				})),

				current: new fields.NumberField(valueFieldTemplate({
					label: CONFIG.STARLIGHT_JOURNALS.attributes.vital.nerve.current,
				})),
			}),
		}),
	};
}

export type Vitals = ReturnType<typeof vitals>;

/**
 * Schema fields for a character's personality.
 * 
 * - **Details**: Information about the character's personality.
 */
export function personalityDetails() {
	return {
		details: new fields.StringField({
			required: true,
			initial: "",
			label: "STARLIGHT_JOURNALS.Creature.Personality",
		}),
	};
}

export type PersonalityDetails = ReturnType<typeof personalityDetails>;

/**
 * Schema fields for a character's background.
 * 
 * - **Public details**: Publicly visible information about the character's background. Visible to other players.
 * - **Private details**: Private information visible only to the sheet owner and the GM.
 */
export function backgroundDetails() {
	return {
		publicDetails: new fields.StringField({
			required: true,
			initial: "",
			label: "STARLIGHT_JOURNALS.Character.Background.Label",
		}),

		privateDetails: new fields.StringField({
			required: true,
			initial: "",
			label: "STARLIGHT_JOURNALS.Character.PrivateBackground.Label",
		}),
	};
}

export type BackgroundDetails = ReturnType<typeof backgroundDetails>;
