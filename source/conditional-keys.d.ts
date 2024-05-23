/**
Extract the keys from a type where the value type of the key extends the given `Condition`.

Internally this is used for the `ConditionalPick` and `ConditionalExcept` types.

@example
```
import type {ConditionalKeys} from 'type-fest';

interface Example {
	a: string;
	b: string | number;
	c?: string;
	d: {};
}

type StringKeysOnly = ConditionalKeys<Example, string>;
//=> 'a'
```

To support partial types, make sure your `Condition` is a union of undefined (for example, `string | undefined`) as demonstrated below.

@example
```
import type {ConditionalKeys} from 'type-fest';

type StringKeysAndUndefined = ConditionalKeys<Example, string | undefined>;
//=> 'a' | 'c'
```

@category Object
*/
export type ConditionalKeys<Base, Condition> =
{
	// Map through all the keys of the given base type.
	[Key in keyof Base]-?:
	// Pick only keys with types extending the given `Condition` type.
	Base[Key] extends Condition
		// Retain this key since the condition passes
		?
			// If the condition extends never, only include the key if the value for that key is also never
			[Condition] extends [never]
				? Base[Key] extends never
					? Key
					: never
				// Otherwise, only include the key if the value is not never (since never extends every other type)
				: Base[Key] extends never ? never : Key
		// Discard this key since the condition fails.
		: never;
	// Convert the produced object into a union type of the keys which passed the conditional test.
}[keyof Base];
