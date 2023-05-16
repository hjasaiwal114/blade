/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { getActionListContainerRole, getActionListItemWrapperRole } from './getA11yRoles';
import { getActionListProperties } from './actionListUtils';
import { StyledActionList } from './styles/StyledActionList';
import { ActionListBox } from './ActionListBox';
import { componentIds } from './componentIds';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { assignWithoutSideEffects, makeAccessible, metaAttribute, MetaConstants } from '~utils';
import { useTheme } from '~components/BladeProvider';
import { useBottomSheetContext } from '~components/BottomSheet/BottomSheetContext';
import type { TestID } from '~src/_helpers/types';

type ActionListContextProp = Pick<ActionListProps, 'surfaceLevel'>;
const ActionListContext = React.createContext<ActionListContextProp>({ surfaceLevel: 2 });
const useActionListContext = (): ActionListContextProp => {
  const context = React.useContext(ActionListContext);

  if (!context) {
    throw new Error(
      '[Blade ActionList]: useActionListContext has to be called inside ActionListContext.Provider',
    );
  }
  return context;
};

type ActionListProps = {
  children: React.ReactNode[];
  /**
   * Decides the backgroundColor of ActionList
   */
  surfaceLevel?: 2 | 3;
} & TestID;

/**
 * ### ActionList
 *
 * List of multiple actionable items. Can be used as menu items inside `Dropdown`,
 * `BottomSheet` and as selectable items when combined with `SelectInput`
 *
 * #### Usage
 *
 * ```jsx
 * <Dropdown>
 *  <SelectInput label="Select Action" />
 *  <DropdownOverlay>
 *    <ActionList>
 *      <ActionListHeader
 *        title="Recent Searches"
 *        leading={<ActionListHeaderIcon icon={HistoryIcon} />}
 *      />
 *      <ActionListItem
 *        title="Home"
 *        value="home"
 *        leading={<ActionListItemIcon icon={HomeIcon} />}
 *      />
 *      <ActionListItem
 *        title="Pricing"
 *        value="pricing"
 *        leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="India Flag" />}
 *      />
 *      <ActionListHeader
 *        title="Search Tips"
 *        leading={<ActionListFooterIcon icon={SearchIcon} />}
 *        trailing={
 *          <Button
 *            onClick={() => console.log('clicked')}
 *          >
 *            Apply
 *          </Button>
 *        }
 *      />
 *    </ActionList>
 *  </DropdownOverlay>
 * </Dropdown>
 * ```
 *
 */
const _ActionList = ({ children, surfaceLevel = 2, testID }: ActionListProps): JSX.Element => {
  const {
    setOptions,
    actionListItemRef,
    selectionType,
    dropdownBaseId,
    setSelectedIndices,
    dropdownTriggerer,
    hasFooterAction,
  } = useDropdown();

  const { theme } = useTheme();
  const { isInBottomSheet } = useBottomSheetContext();

  const {
    sectionData,
    childrenWithId,
    actionListOptions,
    defaultSelectedIndices,
  } = React.useMemo(() => getActionListProperties(children), [children]);

  React.useEffect(() => {
    setOptions(actionListOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionListOptions]);

  React.useEffect(() => {
    setSelectedIndices(defaultSelectedIndices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionListContainerRole = getActionListContainerRole(hasFooterAction, dropdownTriggerer);
  const actionListItemWrapperRole = getActionListItemWrapperRole(
    hasFooterAction,
    dropdownTriggerer,
  );
  const isMultiSelectable = selectionType === 'multiple';

  const actionListContextValue = React.useMemo(() => ({ surfaceLevel }), [surfaceLevel]);

  // If we are inside BottomSheet, we don't render The StyledActionList wrapper
  // This is to ensure:
  // 1. We don't render the box wrapper styles which includes shadows, padding, border etc
  // 2. to ensure GorhomBottomSheetSectionList works as expected, if we add extra wrappers GorhomBottomSheet won't render the content inside
  // NOTE: That this also means inside BottomSheet, ActionList won't render any ActionListHeader or Footer.
  return (
    <ActionListContext.Provider value={actionListContextValue}>
      {isInBottomSheet ? (
        <ActionListBox
          isInBottomSheet={isInBottomSheet}
          actionListItemWrapperRole={actionListItemWrapperRole}
          childrenWithId={childrenWithId}
          sectionData={sectionData}
          isMultiSelectable={isMultiSelectable}
          ref={actionListItemRef as any}
        />
      ) : (
        <StyledActionList
          isInBottomSheet={isInBottomSheet}
          surfaceLevel={surfaceLevel}
          elevation={isInBottomSheet ? undefined : theme.shadows.androidElevation.level[2]}
          id={`${dropdownBaseId}-actionlist`}
          {...makeAccessible({
            role: actionListContainerRole,
            multiSelectable: actionListContainerRole === 'listbox' ? isMultiSelectable : undefined,
            labelledBy: `${dropdownBaseId}-label`,
          })}
          {...metaAttribute({ name: MetaConstants.ActionList, testID })}
        >
          <ActionListBox
            isInBottomSheet={isInBottomSheet}
            actionListItemWrapperRole={actionListItemWrapperRole}
            childrenWithId={childrenWithId}
            sectionData={sectionData}
            isMultiSelectable={isMultiSelectable}
            ref={actionListItemRef as any}
          />
        </StyledActionList>
      )}
    </ActionListContext.Provider>
  );
};

const ActionList = assignWithoutSideEffects(React.memo(_ActionList), {
  componentId: componentIds.ActionList,
  displayName: 'ActionList',
});

export { ActionList, useActionListContext, ActionListProps };
