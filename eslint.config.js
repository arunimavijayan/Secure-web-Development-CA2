
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
    pluginJs.configs.recommended,

    {
        files: ["**/*.js", "**/*.jsx"],

        ...pluginReact.configs.flat.recommended,
        
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2020,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                },
            },
        },
        rules: {
            "react/no-danger": "error",

            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
        },
        settings: {
            react: {
                version: "detect"
            }
        }
    },
];