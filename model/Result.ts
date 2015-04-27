
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


