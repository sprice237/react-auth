module.exports = {
  env: {
    node: true,
    es2020: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
  plugins: ["prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "printWidth": 100,
        "tabWidth": 2,
        "trailingComma": 'es5',
        "arrowParens": 'always'
      }
    ],
    "indent": [0],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "no-restricted-imports": [
      "error",
      {
        patterns: ['../*']
      }
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};
