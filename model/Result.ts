/**
 * Created by jonashansen on 27/04/15.
 */
import categories = require("./categories");
var Categories = categories.Categories;

export interface Result extends NestedResult {
    shooter: string
}

export interface NestedResult {
    score:number
    category: categories.Category
    children?: NestedResult[]
}

class NestedResultImpl implements NestedResult {

    public category:categories.Category;
    public children:NestedResult[];

    private scoreCalculator:()=>number;

    constructor(category:categories.Category, score = 0) {
        this.category = category;
        this.children = [];
        this.scoreCalculator = this.calculateFixScore(score);
    }

    get score() {
        return this.scoreCalculator();
    }

    set score(score:number) {
        if (this.children.length == 0) {
            this.scoreCalculator = this.calculateFixScore(score);
        }
    }

    public wrap(result:NestedResult):NestedResultImpl {
        var nestedResult = new NestedResultImpl(result.category, result.score);
        this.children.push(nestedResult);
        this.scoreCalculator = this.calculateScoreByChildren;
        return nestedResult;
    }


    private calculateScoreByChildren() {
        var score = 0;
        this.children.forEach((result)=> {
            score += result.score;
        });
        return score;
    }

    private calculateFixScore(score:number) {
        return ()=> {
            return score
        };
    }
}

export class ResultImpl extends NestedResultImpl implements Result {

    public children:NestedResult[];

    constructor(public shooter:string, category:categories.Category, score?:number) {
        super(category, score);
    }
}

export class ResultValidator {
    public isValid(result:NestedResult):boolean {
        var children = result.children;
        var childrenValid = true;
        if (children.length > 0) {
            if (children.length === result.category.allowedChildren) {
                childrenValid = !containsOtherCategoryThan(result.category.allowedChildrenCategory, result);

                var validator = this;
                children.forEach((child) => {
                    if (childrenValid) {
                        childrenValid = validator.isValid(child);
                    }
                });
            }
            else {
                childrenValid = false;
            }
        }
        var scoreValid = true;
        if (result.score < 0 || result.score > result.category.maxScore) {
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
