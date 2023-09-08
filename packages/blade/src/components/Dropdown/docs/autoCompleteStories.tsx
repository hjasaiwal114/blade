// AUTOCOMPLETE

import type { DropdownProps } from '../types';

export const getSimpleAutoComplete = (
  selectionType: DropdownProps['selectionType'] = 'single',
): string => `
  import { 
    Dropdown, 
    DropdownOverlay,
    AutoComplete,
    ActionList,
    ActionListItem,
  } from '@razorpay/blade/components';

  function App(): React.ReactElement {
    return (
      <Dropdown 
        selectionType="${selectionType}"
      >
        <AutoComplete
          label="City"
          placeholder="Select your City"
          name="action"
          onChange={({ name, values }) => {
            console.log({ name, values });
          }}
          onInputValueChange={({ name, value }) => {
            console.log({ name, value });
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Bangalore" value="bangalore" />
            <ActionListItem title="Mysore" value="mysore" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    )
  }

  export default App;
`;

export const controlledFiltering = `
import React from 'react';
import { 
  Box,
  Text,
  Dropdown, 
  DropdownOverlay,
  AutoComplete,
  ActionList,
  ActionListItem,
} from '@razorpay/blade/components';

const cities = [
  {
    title: 'Mumbai',
    value: 'mumbai',
    keywords: ['maharashtra'],
  },
  {
    title: 'Pune',
    value: 'pune',
    keywords: ['maharashtra'],
  },
  {
    title: 'Bengaluru',
    value: 'bengaluru',
    keywords: ['karnataka', 'bangalore'],
  },
  {
    title: 'Ooty',
    value: 'ooty',
    keywords: ['tamil nadu'],
  },
];

const App = (): React.ReactElement => {
  const cityValues = cities.map((city) => city.value);
  const [filteredValues, setFilteredValues] = React.useState<string[]>(cityValues);

  return (
    <Dropdown selectionType="multiple">
      <AutoComplete
        label="City"
        onInputValueChange={({ value }) => {
          if (value) {
            const filteredItems = cities
              .filter(
                (city) =>
                  city.title.toLowerCase().startsWith(value.toLowerCase()) ||
                  city.keywords.find((keyword) =>
                    keyword.toLowerCase().includes(value.toLowerCase()),
                  ),
              )
              .map((city) => city.value);

            // If we find valid filtered items, we apply filter by setting state
            if (filteredItems.length > 0) {
              setFilteredValues(filteredItems);
            } else {
              // if we don't find anything, we filter nothing
              setFilteredValues([]);
            }
          } else {
            // If inputValue is empty, we set all options as filtered items
            setFilteredValues(cityValues);
          }
        }}
        filteredValues={filteredValues}
        helpText="Try typing 'maharashtra' in input"
      />
      <DropdownOverlay>
        {
          filteredValues.length > 0 ? (
            <ActionList>
              {cities.map((city) => (
                <ActionListItem key={city.value} title={city.title} value={city.value} />
              ))}
            </ActionList>
          ) : (
            <Box>
              <Text>Custom No Results Found Message!</Text>
            </Box>
          )
        }          
      </DropdownOverlay>
    </Dropdown>
  );
};

export default App;
`;

export const tagsOutside = `
  import React from 'react';
  import { 
    Box,
    Dropdown, 
    DropdownOverlay,
    AutoComplete,
    ActionList,
    ActionListItem,
    Tag,
  } from '@razorpay/blade/components';

  function App(): React.ReactElement {
    const [selections, setSelections] = React.useState([]);

    return (
      <Box>
        <Dropdown 
          selectionType="multiple"
        >
          <AutoComplete
            label="Filter"
            placeholder="Select your Filters"
            name="filters"
            value={selections}
            onChange={({ name, values }) => {
              setSelections(values);
            }}
          />
          <DropdownOverlay>
            {/* 
              I am setting value same as title so I can just show value in Tag. 
              If you want value to be different, you can create an object and map value to title while creating tags 
            */}
            <ActionList>
              <ActionListItem title="Mumbai" value="Mumbai" />
              <ActionListItem title="Pune" value="Pune" />
              <ActionListItem title="Bangalore" value="Bangalore" />
              <ActionListItem title="Mysore" value="Mysore" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
        <Box marginTop="300px" display="flex" gap="spacing.3">
          {
            selections.map((filterValue) => 
              <Tag onDismiss={() => {
                const newSelections = selections.filter((selectionValue) => 
                  selectionValue !== filterValue
                );
                setSelections(newSelections);
              }}>
                {filterValue}
              </Tag>
            )
          }
        </Box>
      </Box>
    )
  }

  export default App;
`;

export const responsiveBottomSheet = `
  import { 
    Box,
    Text,
    Code,
    Dropdown, 
    DropdownOverlay,
    AutoComplete,
    SelectInput,
    SelectInputProps,
    ActionList,
    ActionListItem,
    BottomSheet,
    BottomSheetHeader,
    BottomSheetBody,
  } from '@razorpay/blade/components';

  // Change this flag, refresh the sandbox preview and watch BottomSheet turn into Dropdown
  const isMobile = true;

  const triggerProps: SelectInputProps = {
    label: 'City',
    placeholder: 'Select your City',
    name: 'city'
  }

  const List = (): React.ReactElement => {
    return (
      <ActionList>
        <ActionListItem title="Mumbai" value="mumbai" />
        <ActionListItem title="Pune" value="pune" />
        <ActionListItem title="Bangalore" value="bangalore" />
        <ActionListItem title="Mysore" value="mysore" />
      </ActionList>
    )
  }

  function App(): React.ReactElement {
    return (
      <Box>
        <Text textAlign="center" marginBottom="spacing.8">Change the <Code>isMobile</Code> flag in code and refresh the sandbox preview</Text>
        <Dropdown 
          selectionType="multiple"
        >
          {
            isMobile 
            ? <SelectInput {...triggerProps} /> 
            : <AutoComplete {...triggerProps} />
          }
          { 
            isMobile 
            ? (
              <BottomSheet>
                <BottomSheetHeader>
                  <AutoComplete {...triggerProps} />
                </BottomSheetHeader>
                <BottomSheetBody>
                  <List />
                </BottomSheetBody>
              </BottomSheet>
            ) : (
              <DropdownOverlay>
                <List />
              </DropdownOverlay>
            )
          }
        </Dropdown>
      </Box>
    )
  }

  export default App;
`;

export const creatableItems = `
  import React from 'react';
  import { 
    Box,
    Button,
    PlusIcon,
    Dropdown, 
    DropdownFooter,
    DropdownOverlay,
    AutoComplete,
    ActionList,
    ActionListItem,
  } from '@razorpay/blade/components';


  const App = (): React.ReactElement => {
    const [items, setItems] = React.useState(['Mumbai', 'Pune', 'Bangalore']);
    const [inputValue, setInputValue] = React.useState('');
    const autoCompleteRef = React.useRef<HTMLInputElement>(null);

    return (
      <Box maxWidth="500px">
        <Dropdown>
          <AutoComplete
            ref={autoCompleteRef}
            label="Select City"
            inputValue={inputValue}
            onInputValueChange={({ value }) => {
              setInputValue(value ?? '');
            }}
          />
          <DropdownOverlay>
            <ActionList>
              {items.map((item, index) => (
                <ActionListItem key={item + String(index)} title={item} value={item.toLowerCase()} />
              ))}
            </ActionList>
            <DropdownFooter>
              <Button
                icon={PlusIcon}
                isFullWidth
                variant="secondary"
                iconPosition="right"
                onClick={() => {
                  autoCompleteRef.current?.focus();
                  setInputValue('');
                  setItems([...items, inputValue]);
                }}
              >
                Create {inputValue}
              </Button>
            </DropdownFooter>
          </DropdownOverlay>
        </Dropdown>
      </Box>
    );
  };

  export default App;
`;

export const clearOnDismiss = `
  import React from 'react';
  import { 
    Box,
    Button,
    PlusIcon,
    Dropdown, 
    DropdownFooter,
    DropdownOverlay,
    AutoComplete,
    ActionList,
    ActionListItem,
  } from '@razorpay/blade/components';


  const App = (): React.ReactElement => {
    const [inputValue, setInputValue] = React.useState('');

    return (
      <Box maxWidth="500px">
        <Dropdown selectionType="multiple" onDismiss={() => setInputValue('')}>
          <AutoComplete
            label="Select City"
            inputValue={inputValue}
            onInputValueChange={({ value }) => {
              setInputValue(value ?? '');
            }}
          />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Mumbai" value="mumbai" />
              <ActionListItem title="Pune" value="pune" />
              <ActionListItem title="Bengaluru" value="bengaluru" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
    );
  };

  export default App;
`;

export const maxRowsStates = `
  import React from 'react';
  import { 
    Box,
    Button,
    PlusIcon,
    Dropdown, 
    DropdownFooter,
    DropdownOverlay,
    AutoComplete,
    ActionList,
    ActionListItem,
  } from '@razorpay/blade/components';


  const App = (): React.ReactElement => {
    return (
      <Box maxWidth="300px" display="flex" flexDirection="column" gap="300px">
        <Dropdown selectionType="multiple">
          <AutoComplete
            label="Select City"
            maxRows="single"
            helpText="Try selecting more than 4 items"
          />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Mumbai" value="mumbai" />
              <ActionListItem title="Pune" value="pune" />
              <ActionListItem title="Bengaluru" value="bengaluru" />
              <ActionListItem title="Mysuru" value="mysuru" />
              <ActionListItem title="Ooty" value="ooty" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>

        <Dropdown selectionType="multiple">
          <AutoComplete
            label="Select City"
            maxRows="multiple"
            helpText="Try selecting multiple items to see the input grow"
          />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Mumbai" value="mumbai" />
              <ActionListItem title="Pune" value="pune" />
              <ActionListItem title="Bengaluru" value="bengaluru" />
              <ActionListItem title="Mysuru" value="mysuru" />
              <ActionListItem title="Ooty" value="ooty" />
              <ActionListItem title="Coorg" value="coorg" />
              <ActionListItem title="Kolhapur" value="kolhapur" />
              <ActionListItem title="Munnar" value="munnar" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>

        <Dropdown selectionType="multiple">
          <AutoComplete
            label="Select City"
            maxRows="expandable"
            helpText="Try selecting multiple items to see the input grow in active state"
          />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Mumbai" value="mumbai" />
              <ActionListItem title="Pune" value="pune" />
              <ActionListItem title="Bengaluru" value="bengaluru" />
              <ActionListItem title="Mysuru" value="mysuru" />
              <ActionListItem title="Ooty" value="ooty" />
              <ActionListItem title="Coorg" value="coorg" />
              <ActionListItem title="Kolhapur" value="kolhapur" />
              <ActionListItem title="Munnar" value="munnar" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
    );
  };

  export default App;
`;
