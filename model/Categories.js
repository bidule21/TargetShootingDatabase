/**
 * Created by jonashansen on 27/04/15.
 */
var Categories = (function () {
    function Categories() {
    }
    Categories.A10_1 = {
        name: "A10 1",
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    };
    Categories.A10_10 = {
        name: "A10 10",
        allowedChildren: 10,
        allowedChildrenCategory: Categories.A10_1,
        maxScore: 100
    };
    Categories.A10_20 = {
        name: "A10 20",
        allowedChildren: 2,
        allowedChildrenCategory: Categories.A10_10,
        maxScore: 200
    };
    Categories.A10_30 = {
        name: "A10 30",
        allowedChildren: 3,
        allowedChildrenCategory: Categories.A10_10,
        maxScore: 300
    };
    Categories.A10_40 = {
        name: "A10 40",
        allowedChildren: 4,
        allowedChildrenCategory: Categories.A10_10,
        maxScore: 400
    };
    Categories.A10_60 = {
        name: "A10 60",
        allowedChildren: 6,
        allowedChildrenCategory: Categories.A10_10,
        maxScore: 600
    };
    Categories.A30_K_1 = {
        name: "A30 K 1",
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    };
    Categories.A30_K_10 = {
        name: "A30 K 10",
        allowedChildren: 10,
        allowedChildrenCategory: Categories.A30_K_1,
        maxScore: 100
    };
    Categories.A30_K_20 = {
        name: "A30 K 20",
        allowedChildren: 2,
        allowedChildrenCategory: Categories.A30_K_10,
        maxScore: 200
    };
    Categories.A30_K_30 = {
        name: "A30 K 30",
        allowedChildren: 3,
        allowedChildrenCategory: Categories.A30_K_10,
        maxScore: 300
    };
    Categories.A30_S_1 = {
        name: "A30 S 1",
        allowedChildren: 0,
        allowedChildrenCategory: undefined,
        maxScore: 10
    };
    Categories.A30_S_10 = {
        name: "A30 S 10",
        allowedChildren: 10,
        allowedChildrenCategory: Categories.A30_S_1,
        maxScore: 100
    };
    Categories.A30_S_20 = {
        name: "A30 S 20",
        allowedChildren: 2,
        allowedChildrenCategory: Categories.A30_S_10,
        maxScore: 200
    };
    Categories.A30_S_30 = {
        name: "A30 S 30",
        allowedChildren: 3,
        allowedChildrenCategory: Categories.A30_S_10,
        maxScore: 300
    };
    return Categories;
})();
exports.Categories = Categories;
//# sourceMappingURL=categories.js.map