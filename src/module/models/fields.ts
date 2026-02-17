import { Merge } from "@data/conversion";

import fields = foundry.data.fields;

/* ========================================================================== */
/* Simple field templates                                                     */
/* ========================================================================== */

export function baseFieldTemplate<const Config extends fields.NumberField.Options = {}>(overrides?: Config) {
	const base = {
		required: true,
		nullable: false,
		integer: true,
		initial: 0,
		min: 0,
	} as const;

	return { ...base, ...overrides } as unknown as Merge<typeof base, Config>;
}

export function valueFieldTemplate<const Config extends fields.NumberField.Options = {}>(overrides?: Config) {
	const base = {
		required: true,
		nullable: true,
		integer: true,
		initial: null,
		min: 0,
	} as const;

	return { ...base, ...overrides } as unknown as Merge<typeof base, Config>;
}
