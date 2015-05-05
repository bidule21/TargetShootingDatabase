/**
 * Created by jonashansen on 27/04/15.
 */
import categories = require("./categories");
var Categories = categories.Categories;

export interface Result {
    category: categories.Category
    score: number
    shooter: string
    children: Result[]
}

class BaseResultFactory {
    scoreCalculator:() => number;
    children:Result[];

    constructor(public shooter:string, public category:categories.Category) {
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

    public child(category:categories.Category, score?:number):NestedResultFactory {
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
            });
            return score
        };

        return nestedFactory
    }
}

class NestedResultFactory extends ResultFactory {
    onAddCallback:(nestedResult:Result) => void;

    constructor(onAddCallback:(nestedResult:Result) => void, parentFactory:ResultFactory, category:categories.Category) {
        super(parentFactory.shooter, category);
        this.onAddCallback = onAddCallback
    }

    public add() {
        this.onAddCallback(this.create());
    }
}

class ResultHelper implements Result {
    scoreCalculator:() => number;

    constructor(public shooter:string, public category:categories.Category, public children:Result[], scoreCalculator:() => number) {
        this.scoreCalculator = scoreCalculator
    }

    get score() {
        return this.scoreCalculator()
    }
}

export class ResultSchemaValidator {

    constructor(public result:Result) {
    }

    public isValid():boolean {
        var children = this.result.children;
        var childrenValid = true;
        if (children.length > 0) {
            if (children.length === this.result.category.allowedChildren) {
                childrenValid = !containsOtherCategoryThan(this.result.category.allowedChildrenCategory, this.result);
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
        if (this.result.score < 0 || this.result.score > this.result.category.maxScore) {
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
