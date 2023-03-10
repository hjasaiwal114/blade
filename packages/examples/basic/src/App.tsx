import { BladeProvider, Dropdown, DropdownOverlay, SelectInput } from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';
import '@fontsource/lato/400.css';
import '@fontsource/lato/400-italic.css';
import '@fontsource/lato/700.css';
import '@fontsource/lato/700-italic.css';

function App(): JSX.Element {
  return (
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      <Dropdown>
        <SelectInput label="Select" />
        <DropdownOverlay>hi</DropdownOverlay>
      </Dropdown>
    </BladeProvider>
  );
}

export default App;
