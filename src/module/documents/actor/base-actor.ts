type SystemActorTypes = Exclude<foundry.documents.Actor.ConfiguredSubType, foundry.abstract.Document.CoreTypesForName<"Actor">>;

export interface ActorSj<ActorType extends SystemActorTypes = SystemActorTypes> {
	type: ActorType;
	system: Actor.SystemOfType<ActorType>;
	items: foundry.abstract.EmbeddedCollection<
		foundry.abstract.Document.StoredForName<"Item">,
		Actor.Implementation
	>;
}

export class ActorSj<ActorType extends SystemActorTypes = SystemActorTypes> extends Actor<ActorType> {
	
}
