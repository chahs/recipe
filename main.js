var recipes = [
    {
        name: '시금치달걀오픈토스트',
        page: 36,
        ingredientNames: ['통밀식빵', '시금치', '달걀', '저지방슬라이스치즈', '올리브유']
    },
    {
        name: '달걀찜밥',
        page: 38,
        ingredientNames: ['달걀', '잡곡밥', '브로콜리', '당근', '저지방슬라이스치즈', '카레가루', '무가당두유']
    },
    {
        name: '바나나단백질팬케이크',
        page: 40,
        ingredientNames: ['바나나', '달걀', '프로틴가루', '피칸', '카카오닙스', '코코넛오일', '저지방요거트', '딸기']
    },
    {
        name: '단호박영양죽',
        page: 42,
        ingredientNames: ['단호박', '잡곡밥', '저지방우유', '소금', '저지방슬라이스치즈']
    },
    {
        name: '과일케일스무디볼',
        page: 44,
        ingredientNames: ['케일', '바나나', '딸기', '블루베리', '아몬드', '뮤즐리', '카카오닙스', '햄프시드', '저지방우유', '저지방요거트']
    },
    {
        name: '사과땅콩버터토스트',
        page: 46,
        ingredientNames: ['통밀식빵', '사과', '땅콩버터', '아몬드', '피칸', '카카오닙스', '햄프시드', '시나몬가루']
    },
    {
        name: '고구마에그슬럿',
        page: 48,
        ingredientNames: ['고구마', '달걀', '아몬드', '저지방우유', '물', '후춧가루', '파슬리가루', '크러쉬드레드페퍼']
    },
    {
        name: '양배추달걀간장밥',
        page: 50,
        ingredientNames: ['양배추', '달걀', '잡곡밥', '간장', '올리브유']
    }
];

var ingredientNameToRecipes = {};
for (var recipe of recipes) {
    for (var ingredientName of recipe.ingredientNames) {
        if (!ingredientNameToRecipes[ingredientName]) {
            ingredientNameToRecipes[ingredientName] = [];
        }
        ingredientNameToRecipes[ingredientName].push(recipe);
    }
}

Vue.component('ingredient-item', {
    template: '\
    <li>\
        <span>{{name}}</span> <button v-on:click="$emit(\'remove\')">X</button>\
    </li>\
    ',
    props: ['name']
});

var app = new Vue({
    el: '#app',
    data: {
        matchedRecipes: [],
        addedIngredients: [],
        nextIngredientId: 0,
        inputIngredient: ''
    },
    methods: {
        AssortIngredientNames: function(recipe) {
            var includedIngredientNames = [];
            var excludedIngredientNames = [];
            for (var ingredientName of recipe.ingredientNames) {
                var isIncluded = false;
                for (var addedIngredient of this.addedIngredients) {
                    if (ingredientName == addedIngredient.name) {
                        includedIngredientNames.push(ingredientName);
                        isIncluded = true;
                        break;
                    }
                }
                if (!isIncluded) {
                    excludedIngredientNames.push(ingredientName);
                }
            }
            recipe.includedIngredientNames = includedIngredientNames;
            recipe.excludedIngredientNames = excludedIngredientNames;
        },
        UpdateMatchedRecipes: function() {
            var newMatchedRecipes = [];
            var matchedRecipeNameHash = {};
            for (var addedIngredient of this.addedIngredients) {
                if (ingredientNameToRecipes[addedIngredient.name]) {
                    for (var recipe of ingredientNameToRecipes[addedIngredient.name]) {
                        if (!matchedRecipeNameHash[recipe.name]) {
                            newMatchedRecipes.push(recipe);
                            matchedRecipeNameHash[recipe.name] = true;
                        }
                    }
                }
            }
            for (var recipe of newMatchedRecipes) {
                this.AssortIngredientNames(recipe);
            }
            newMatchedRecipes.sort((a, b) => {
                return b.includedIngredientNames.length - a.includedIngredientNames.length;
            });
            this.matchedRecipes = newMatchedRecipes;
        },
        AddIngredient: function() {
            this.addedIngredients.push({
                id: this.nextIngredientId++,
                name: this.inputIngredient
            });
            this.inputIngredient = '';
            this.UpdateMatchedRecipes();
        },
        RemoveIngredient: function(index) {
            this.addedIngredients.splice(index, 1);
            this.UpdateMatchedRecipes();
        }
    }
});