import { useDropdown } from './useDropdown';
import type { ButtonProps } from '~components/Button';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import BaseButton from '~components/Button/BaseButton';
import styled from 'styled-components';

const StyledProfileButton = styled.button`
  height: 30px;
  width: 30px;
  border-radius: 100%;
  background: url('https://avatars.githubusercontent.com/u/35374649?v=4');
  background-position: center;
  border: none;
  background-size: cover;
`;

const _DropdownButton = (props: ButtonProps): JSX.Element => {
  const { onTriggerClick, onTriggerBlur, onTriggerKeydown } = useDropdown();
  return (
    <StyledProfileButton
      {...props}
      onClick={onTriggerClick}
      onBlur={() => {
        // With button trigger, there is no "value" as such. It's just clickable items
        onTriggerBlur?.({ name: '', value: '' });
      }}
      onKeyDown={(e) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-explicit-any
        onTriggerKeydown?.({ event: e as any });
      }}
    />
  );
};

const DropdownButton = assignWithoutSideEffects(_DropdownButton, { componentId: 'DropdownButton' });

export { DropdownButton };
