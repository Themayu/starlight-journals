import FormInputConfig = foundry.applications.fields.FormInputConfig;
import DataField = foundry.data.fields.DataField;

export function formInput<const Field extends DataField.Any>(
	field: Field,
	options?: FormInputConfig<DataField.InitializedTypeFor<Field>>,
): HTMLElement | HTMLCollection | null {
	try {
		return field.toInput(options);
	} catch (error) {
		console.error(error);
		return null;
	}
}
