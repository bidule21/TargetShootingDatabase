import categories = require("./Categories");
export interface Result {
    category: string
    score: number
    shooter: string
    children: Result[]
}

class BaseResultFactory {
    scoreCalculator:() => number;
    children:Result[];

    constructor(public shooter:string, public category:string) {
        this.scoreCalculator = () => {
            return 0
        };
        this.children = []
    }

    public setScore(score:number):BaseResultFactory {
        this.scoreCalculator = () => {
            return score
        };
        return this
    }

    public create():Result {
        return new ResultHelper(this.shooter, this.category, this.children, this.scoreCalculator)
    }
}

export class ResultFactory extends BaseResultFactory {

    public child(category:string, score?:number):NestedResultFactory {
        var nestedFactory = new NestedResultFactory(
                nestedResult=> {
                this.children.push(nestedResult)
            },
            this,
            category
        );

        if (score) {
            nestedFactory.setScore(score)
        }

        this.scoreCalculator = () => {
            var score = 0;
            this.children.forEach(child=> {
                score += child.score
            })
            return score
        }

        return nestedFactory
    }
}

class NestedResultFactory extends ResultFactory {
    onAddCallback:(nestedResult:Result) => void;

    constructor(onAddCallback:(nestedResult:Result) => void, parentFactory:ResultFactory, Categoriesegory:string) {
        super(parentFactory.shooter, Categoriesegory);
        this.onAddCallback = onAddCallback
    }

    public add() {
        this.onAddCallback(this.create())
    }
}

class ResultHelper implements Result {
    scoreCalculator:() => number;

    constructor(public shooter:string, public category:string, public children:Result[], scoreCalculator:() => number) {
        this.scoreCalculator = scoreCalculator
    }

    get score() {
        return this.scoreCalculator()
    }
}


interface ResultSchema {
    category: string
    allowedChildren: number
    allowedChildrenCategory: string
    maxScore: number
}

export class ResultSchemaValidator {
    schema:ResultSchema;

    constructor(public result:Result) {
        this.schema = findSchema(result.category);
        if (!this.schema) {
            throw new Error("No schema for " + result.category + " found. Please define one or provide a valid category!");
        }

        function findSchema(category:string) {
            var foundSchema;
            ResultSchemas.forEach((schema) => {
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

var ResultSchemas = [
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
];




