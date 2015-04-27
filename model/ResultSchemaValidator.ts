/**
 * Created by jonashansen on 27/04/15.
 */

import result = require("./Result");
import categories = require("./Categories");

interface ResultSchema {
    category: string
    allowedChildren: number
    allowedChildrenCategory: string
    maxScore: number
}

export class ResultSchemaValidator {
    schema:ResultSchema;

    constructor(public result:result.Result) {
        this.schema = findSchema(result.category);
        if (!this.schema) {
            throw new Error("No schema for " + result.category + " found. Please define one or provide a valid category!");
        }

        function findSchema(category:string) {
            var foundSchema;
            SCHEMAS.forEach((schema) => {
                if (schema.category === category) {
                    foundSchema = schema;
                }
            });
            return foundSchema
        }
    }

    public isValid():boolean {
        var children = this.result.children;
        var childrenValid = true;
        if (children.length > 0) {
            if (children.length === this.schema.allowedChildren) {
                childrenValid = !containsOtherCategoryThan(this.schema.allowedChildrenCategory, this.result);
                children.forEach(function (child) {
                    if (childrenValid) {
                        var validator = new ResultSchemaValidator(child);
                        childrenValid = validator.isValid();
                    }
                });
            }
            else {
                childrenValid = false;
            }
        }
        var scoreValid = true;
        if (this.result.score < 0 || this.result.score > this.schema.maxScore) {
            scoreValid = false;
        }
        return childrenValid && scoreValid;

        function containsOtherCategoryThan(category, result) {
            var containsOtherCategory = false;
            result.children.forEach(function (result) {
                if (result.category !== category) {
                    containsOtherCategory = true;
                }
            });
            return containsOtherCategory;
        }
    }
}

var SCHEMAS = [
    {
        category: categories.A10_1,
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    },
    {
        category: categories.A10_10,
        allowedChildren: 10,
        allowedChildrenCategory: categories.A10_1,
        maxScore: 100
    },
    {
        category: categories.A10_20,
        allowedChildren: 2,
        allowedChildrenCategory: categories.A10_10,
        maxScore: 200
    },
    {
        category: categories.A10_30,
        allowedChildren: 3,
        allowedChildrenCategory: categories.A10_10,
        maxScore: 300
    },
    {
        category: categories.A10_40,
        allowedChildren: 4,
        allowedChildrenCategory: categories.A10_10,
        maxScore: 400
    },
    {
        category: categories.A10_60,
        allowedChildren: 6,
        allowedChildrenCategory: categories.A10_10,
        maxScore: 600
    },
    {
        category: categories.A30_K_1,
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    },
    {
        category: categories.A30_K_10,
        allowedChildren: 10,
        allowedChildrenCategory: categories.A30_K_1,
        maxScore: 100
    },
    {
        category: categories.A30_K_20,
        allowedChildren: 2,
        allowedChildrenCategory: categories.A30_K_10,
        maxScore: 200
    },
    {
        category: categories.A30_K_30,
        allowedChildren: 3,
        allowedChildrenCategory: categories.A30_K_10,
        maxScore: 300
    },
    {
        category: categories.A30_S_1,
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    },
    {
        category: categories.A30_S_10,
        allowedChildren: 10,
        allowedChildrenCategory: categories.A30_S_1,
        maxScore: 100
    },
    {
        category: categories.A30_S_20,
        allowedChildren: 2,
        allowedChildrenCategory: categories.A30_S_10,
        maxScore: 200
    },
    {
        category: categories.A30_S_30,
        allowedChildren: 3,
        allowedChildrenCategory: categories.A30_S_10,
        maxScore: 300
    }
]

