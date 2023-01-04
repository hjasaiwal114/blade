/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const { stringify, parseSync } = require('svgson');
const { startCase, camelCase } = require('lodash');
const prettier = require('prettier');

const transformSvgNode = (node, components = new Set()) => {
  if (node.name === 'svg') {
    node.attributes = {
      width: '{width}',
      height: '{height}',
      viewBox: '0 0 24 24',
      fill: 'none',
    };
  }

  // title case component names
  node.name = startCase(node.name).replace(/\s/g, '');
  // gather imported components
  components.add(node.name);

  // update iconColor in stroke & fill
  Object.keys(node.attributes).forEach((attribute) => {
    if (['stroke', 'fill'].includes(attribute) && node.attributes[attribute] !== 'none') {
      node.attributes[attribute] = `{iconColor}`;
    }
  });

  // recursively go to child
  if (node.children) node.children.forEach((child) => transformSvgNode(child, components));

  return { node, components };
};

const allIcons = JSON.parse(fs.readFileSync('./icons.json', { encoding: 'utf-8' }));
const icons = allIcons.reduce((prev, curr) => {
  const currentName = Object.keys(curr);
  return { ...prev, [currentName]: curr[currentName] };
}, {});

/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = (plop) => {
  plop.setGenerator('icon', {
    description: 'Generates a icon component',
    prompts: [],
    actions: () => {
      const actions = [];

      Object.keys(icons).forEach((icon) => {
        const iconName = startCase(camelCase(icon)).replace(/\s/g, '');
        const filePath = `./src/components/Icons/${iconName}Icon/${iconName}Icon.tsx`;
        const doesIconAlreadyExists = fs.existsSync(filePath);
        console.log('FILE EXIST', filePath, doesIconAlreadyExists);

        const skip = () => {
          return doesIconAlreadyExists ? `${iconName} already exists` : null;
        };

        // populate the template code
        actions.push({
          type: 'addMany',
          templateFiles: 'plop/icon/**',
          destination: `./src/components/Icons/{{iconName}}Icon`,
          base: 'plop/icon',
          data: { iconName },
          abortOnFail: true,
          skipIfExists: true,
        });

        // add barell import in index.ts
        actions.push({
          skip,
          type: 'modify',
          path: 'src/components/Icons/index.tsx',
          pattern: /(\/\/ # append_icon_export)/gi,
          data: { iconName },
          template: "export { default as {{iconName}}Icon } from './{{iconName}}Icon';\n$1",
          abortOnFail: true,
        });

        // modify iconMap imports
        actions.push({
          skip,
          type: 'modify',
          path: 'src/components/Icons/iconMap.ts',
          data: { iconName },
          pattern: /(\/\/ # append_icon_import)/gi,
          template: "import {{iconName}}IconComponent from './{{iconName}}Icon';\n$1",
          abortOnFail: true,
        });

        // modify iconMap map
        actions.push({
          skip,
          type: 'modify',
          path: 'src/components/Icons/iconMap.ts',
          pattern: /(\/\/ # append_icon_map)/gi,
          data: { iconName },
          template: '{{iconName}}Icon: {{iconName}}IconComponent,\r\t$1',
          abortOnFail: true,
        });

        // modify svg -> jsx
        actions.push({
          skip,
          type: 'modify',
          data: { iconName },
          path: `src/components/Icons/{{iconName}}Icon/{{iconName}}Icon.tsx`,
          abortOnFail: true,
          transform(fileContents) {
            let final = fileContents;
            let importedComponents = [];

            const svgContents = icons[icon];
            // parse svg contents to ast and modify the ast with transformSvgNode
            const svgAst = parseSync(svgContents, {
              camelcase: true,
              // transform each node and gather imported components
              transformNode: (transformNode) => {
                const { node, components } = transformSvgNode(transformNode);
                importedComponents = [...components].map((name) => name.replace(/\s/g, ''));
                return node;
              },
            });

            // stringify svg ast
            const svgString = stringify(svgAst, {
              selfClose: true,
              // transform jsx props
              transformAttr: (key, value) => {
                if (value.startsWith('{')) {
                  return `${key}=${value}`;
                }
                return `${key}="${value}"`;
              },
            });

            // replace template svg placeholder
            final = final.replace(/REPLACE_SVG/g, svgString);
            // update imported svg components
            final = final.replace(/IMPORTED_SVG_COMPONENTS/g, importedComponents.join(', '));

            return prettier.format(final, {
              parser: 'typescript',
              singleQuote: true,
            });
          },
        });
      });

      return actions;
    },
  });
};
