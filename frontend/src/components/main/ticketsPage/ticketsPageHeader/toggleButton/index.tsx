import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@aws-amplify/ui-react';
import { FaList, FaThLarge } from 'react-icons/fa';
import '@aws-amplify/ui-react/styles.css';
import './index.css';

/**
 * Interface that represents the props for the TicketViewToggleButton.
 *
 * @property {string} value - The current selected view of the toggle button.
 * @property {function} onChange - The function to call when toggle button is pressed.
 * @property {boolean} listView - Whether the list view is selected.
 */
interface TicketViewToggleButtonProps {
  value: string;
  onChange: (value: string) => void;
  listView: boolean;
}

/**
 * Represents a ticket view toggle button component.
 *
 * @param {TicketViewToggleButtonProps} props - The props for the TicketViewToggleButton.
 */
const TicketViewToggleButton: React.FC<TicketViewToggleButtonProps> = ({
  value,
  onChange,
  listView,
}) => (
  <ToggleButtonGroup
    value={value}
    isExclusive
    isSelectionRequired
    onChange={val => onChange(val as string)}>
    <ToggleButton className={listView ? 'selected' : ''} value='list'>
      <FaList color='white' />
    </ToggleButton>
    <ToggleButton className={listView ? '' : 'selected'} value='card'>
      <FaThLarge color='white' />
    </ToggleButton>
  </ToggleButtonGroup>
);

export default TicketViewToggleButton;
