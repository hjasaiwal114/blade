import { DropdownButton } from './DropdownButton';
import { Dropdown, DropdownOverlay } from '.';
import { ActionList, ActionListItem } from '~components/ActionList';
import styled from 'styled-components';
import { Box } from '~components/Box';

const DropdownStoryMeta = {
  title: 'Components/Dropdown/With Button',
  component: Dropdown,
  subcomponents: { DropdownButton },
  args: {},
};

const RedProfile = styled.button`
  height: 20px;
  width: 20px;
  border-radius: 100%;
  background: url('https://avatars.githubusercontent.com/u/35374649?v=4');
  background-position: center;
  border: none;
  background-size: cover;
`;

const BlueProfile = styled.button`
  height: 20px;
  width: 20px;
  border-radius: 100%;
  background: url('https://avatars.githubusercontent.com/u/30949385?v=4');
  background-position: center;
  border: none;
  background-size: cover;
`;

RedProfile.componentId = 'ActionListItemAsset';
BlueProfile.componentId = 'ActionListItemAsset';

export const Basic = (): JSX.Element => {
  return (
    <Box width="400px" position="relative">
      <Dropdown>
        <DropdownButton />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem
              isDefaultSelected={true}
              leading={<RedProfile />}
              title="Anurag Hazra"
              value="anurag"
            />
            <ActionListItem leading={<BlueProfile />} title="Saurabh Daware" value="saurabh" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export default DropdownStoryMeta;
