import fields = foundry.data.fields;

export const migrationData = () => ({
	migrationData: new fields.SchemaField({
		version: new fields.NumberField({
			required: true,
			nullable: true,
			initial: null,
		}),

		type: new fields.StringField({
			required: true,
			nullable: false,
			initial: "",
		}),

		lastMigration: new fields.SchemaField({
			schema: new fields.NumberField({
				required: false,
				nullable: true,
			}),

			system: new fields.StringField({
				required: false,
				nullable: true,
			}),

			foundry: new fields.StringField({
				required: false,
				nullable: true,
			}),
		}),
	}),
});

export type MigrationData = ReturnType<typeof migrationData>;
