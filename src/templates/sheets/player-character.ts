import * as helpers from "@templates/helpers";

import type { PlayerCharacterSheet } from "@applications/sheets";
import type { SkillDefinition, SkillKey } from "@config";
import { html } from "lit-html";
import { repeat } from "lit-html/directives/repeat.js";
import { typedObjectEntries, typedObjectFromEntries } from "@data/conversion";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

const statistic = (label: string, statistic: number, level: number) => {
	return html`
	<li>
		<strong>${helpers.localize(label)}</strong>: ${statistic} (${helpers.localize("STARLIGHT_JOURNALS.Statistics.Level")} ${level})
	</li>
	`;
}

const attribute = (label: string, attribute: number) => {
	return html`
	<li>
		<strong>${helpers.localize(label)}</strong>: ${attribute}
	</li>
	`;
}

const skill = (label: string, skill: number, main: number, ...alts: number[]) => {
	return html`
	<li>
		<strong>${helpers.localize(label)}</strong>: ${skill} (${
			[main, ...alts].map(stat => skill * 10 + stat).join(", ")
		})
	</li>
	`;
}

const focus = (
	context: ApplicationV2.RenderContextOf<PlayerCharacterSheet>,
	label: string,
	skills: Record<SkillKey, SkillDefinition>,
) => {
	return html`
	<li style="font-size: smaller;">
		<p style="font-weight: bold; margin-bottom: 4px; margin-top: 4px;">${helpers.localize(label)}</p>
		<ul>
			${repeat(
				typedObjectEntries(skills),
				([skillKey, _config]) => skillKey,
				([skillKey, config]) => skill(
					config.label,
					context.document.system.skills[skillKey].level,
					context.document.system.statistics[config.primaryStatistic].calculated,
					...config.altStatistics.map(stat => {
						return context.document.system.statistics[stat.statistic].calculated;
					}),
				),
			)}
		</ul>
	</li>
	`
}

const template = (context: ApplicationV2.RenderContextOf<PlayerCharacterSheet>) => {
	return html`
	<input type="text" name="name" class="uninput" value="${context.document._source.name}" />
	<p>Hello from <strong>${context.document.name}</strong> (locked: ${context.locked})</p>
	<p style="font-weight: bold; margin-bottom: 4px;">Statistics</p>
	<ul style="margin-top: 0;">
		${repeat(
			typedObjectEntries(CONFIG.STARLIGHT_JOURNALS.statistics),
			([statisticKey, _config]) => statisticKey,
			([statisticKey, config]) => statistic(
				config.label,
				context.document.system.statistics[statisticKey].calculated,
				context.document.system.statistics[statisticKey].level,
			),
		)}

		${statistic(
			"STARLIGHT_JOURNALS.Statistics.Luck.Label",
			context.document.system.statistics.luck.value,
			context.document.system.statistics.luck.level,
		)}
	</ul>

	<p style="font-weight: bold; margin-bottom: 4px;">Vitals</p>
	<ul style="margin-top: 0;">
		${repeat(
			typedObjectEntries(CONFIG.STARLIGHT_JOURNALS.attributes.vital),
			([attributeKey, _config]) => attributeKey,
			([attributeKey, config]) => attribute(
				config.label,
				context.document.system.vital[attributeKey].current ??
					context.document.system.vital[attributeKey].calculated,
			),
		)}
	</ul>

	<p style="font-weight: bold; margin-bottom: 4px;">Attributes</p>
	<ul style="margin-top: 0;">
		${repeat(
			typedObjectEntries(CONFIG.STARLIGHT_JOURNALS.attributes.attrs),
			([attributeKey, _config]) => attributeKey,
			([attributeKey, config]) => attribute(
				config.label,
				context.document.system.attributes[attributeKey].calculated,
			),
		)}
	</ul>

	<p style="font-weight: bold; margin-bottom: 4px;">Resources</p>
	<ul style="margin-top: 0;">
		${repeat(
			typedObjectEntries(CONFIG.STARLIGHT_JOURNALS.resources),
			([attributeKey, _config]) => attributeKey,
			([attributeKey, config]) => attribute(
				config.label,
				context.document.system.resources[attributeKey].calculated,
			),
		)}
	</ul>

	<p style="font-weight: bold; margin-bottom: 4px">Skills</p>
	<ul style="margin-top: 0;">
		${repeat(
			typedObjectEntries(CONFIG.STARLIGHT_JOURNALS.focuses),
			([focusKey, _config]) => focusKey,
			([focusKey, config]) => focus(
				context,
				config.label,
				typedObjectFromEntries(
					typedObjectEntries(CONFIG.STARLIGHT_JOURNALS.skills)
						.filter(([_skillKey, config]) => config.focus == focusKey),
				),
			),
		)}
	</ul>
	`;
}

export { template as playerCharacter };

// Equivalent Handlebars template ------------------------------------------- //

/*
<p>Hello from <strong>{{document.name}}</strong> (locked: {{locked}})</p>
<p style="font-weight: bold; margin-bottom: 4px;">Statistics</p>
<ul style="margin-top: 0;">
	{{#each CONFIG.STARLIGHT_JOURNALS.statistics as |statistic|}}
	<li>
		<strong>{{localize statistic.label}}</strong>:
		{{#with (lookup @root.document.system.statistics @key)}} {{calculated}} {{/with}}
	</li>
	{{/each}}
</ul>

<p style="font-weight: bold; margin-bottom: 4px;">Vitals</p>
<ul style="margin-top: 0;">
	{{#each CONFIG.STARLIGHT_JOURNALS.attributes.vital as |attribute|}}
	<li>
		<strong>{{localize attribute.label}}</strong>:
		{{#with (lookup @root.document.system.vital @key)}}
			{{#if current}}
				{{current}}
			{{#else}}
				{{calculated}}
			{{/if}}
		{{/with}}
	</li>
	{{/each}}
</ul>

<p style="font-weight: bold; margin-bottom: 4px;">Attributes</p>
<ul style="margin-top: 0;">
	{{#each CONFIG.STARLIGHT_JOURNALS.attributes.attrs as |attribute|}}
	<li>
		<strong>{{localize attribute.label}}</strong>:
		{{#with (lookup @root.document.system.attributes @key)}} {{calculated}} {{/with}}
	</li>
	{{/each}}
</ul>

<p style="font-weight: bold; margin-bottom: 4px;">Resources</p>
<ul style="margin-top: 0;">
	{{#each CONFIG.STARLIGHT_JOURNALS.attributes.resources as |attribute|}}
	<li>
		<strong>{{localize attribute.label}}</strong>:
		{{#with (lookup @root.document.system.resources @key)}} {{calculated}} {{/with}}
	</li>
	{{/each}}
</ul>
*/
