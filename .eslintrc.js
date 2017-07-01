module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "jest": true
    },
    "extends": [
        "standard",
        "plugin:flowtype/recommended"
    ],
    "plugins": [
        "standard",
        "promise",
        "flowtype"
    ],
    "rules": {
        "indent": 0,
        "spaced-comment": 0,
        "comma-dangle": ["error", {
            "arrays": "always",
            "objects": "always",
            "imports": "never",
            "exports": "never",
            "functions": "ignore",
        }],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};