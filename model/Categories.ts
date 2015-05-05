/**
 * Created by jonashansen on 27/04/15.
 */

export interface Category {
    name: string
    allowedChildren?: number
    allowedChildrenCategory?: Category
    maxScore: number
}

export class Categories {
    public static A10_1:Category = {
        name: "A10 1",
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    };
    public static A10_10:Category = {
        name: "A10 10",
        allowedChildren: 10,
        allowedChildrenCategory: Categories.A10_1,
        maxScore: 100
    };
    public static A10_20:Category = {
        name: "A10 20",
        allowedChildren: 2,
        allowedChildrenCategory: Categories.A10_10,
        maxScore: 200
    };
    public static A10_30:Category = {
        name: "A10 30",
        allowedChildren: 3,
        allowedChildrenCategory: Categories.A10_10,
        maxScore: 300
    };
    public static A10_40:Category = {
        name: "A10 40",
        allowedChildren: 4,
        allowedChildrenCategory: Categories.A10_10,
        maxScore: 400
    };
    public static A10_60:Category = {
        name: "A10 60",
        allowedChildren: 6,
        allowedChildrenCategory: Categories.A10_10,
        maxScore: 600
    };
    public static A30_K_1:Category = {
        name: "A30 K 1",
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    };
    public static A30_K_10:Category = {
        name: "A30 K 10",
        allowedChildren: 10,
        allowedChildrenCategory: Categories.A30_K_1,
        maxScore: 100
    };
    public static A30_K_20:Category = {
        name: "A30 K 20",
        allowedChildren: 2,
        allowedChildrenCategory: Categories.A30_K_10,
        maxScore: 200
    };
    public static A30_K_30:Category = {
        name: "A30 K 30",
        allowedChildren: 3,
        allowedChildrenCategory: Categories.A30_K_10,
        maxScore: 300
    };
    public static A30_S_1:Category = {
        name: "A30 S 1",
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    };
    public static A30_S_10:Category = {
        name: "A30 S 10",
        allowedChildren: 10,
        allowedChildrenCategory: Categories.A30_S_1,
        maxScore: 100
    };
    public static A30_S_20:Category = {
        name: "A30 S 20",
        allowedChildren: 2,
        allowedChildrenCategory: Categories.A30_S_10,
        maxScore: 200
    };
    public static A30_S_30:Category = {
        name: "A30 S 30",
        allowedChildren: 3,
        allowedChildrenCategory: Categories.A30_S_10,
        maxScore: 300
    };
}