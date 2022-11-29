import {expect, test, beforeEach} from '@jest/globals';
import * as pulumi from "@pulumi/pulumi";

pulumi.runtime.setMocks({
    newResource: function(args: pulumi.runtime.MockResourceArgs): {id: string, state: any} {
        return {
            id: args.inputs.name + "_id",
            state: args.inputs,
        };
    },
    call: function(args: pulumi.runtime.MockCallArgs) {
        return args.inputs;
    },
},
  "project",
  "stack",
  false, // Sets the flag `dryRun`, which indicates if pulumi is running in preview mode.
);

// Define the infra variable as a type whose shape matches that of the
    // to-be-defined resources module.
    // https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
let infra: typeof import("./index");

beforeEach(async () => {

    // Dynamically import the index module.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports
    infra = await import("./index");
});

test("must have a correct name and be tagged", () => {

    pulumi.all([infra.bucket1.urn, infra.bucket1.tags]).apply(async ([urn, tags]) => {
        expect(tags).not.toBeUndefined();
        // expect(tags?.length).toBeGreaterThan(0);
        expect(urn).toMatch(/gitops/i)
    });
});

