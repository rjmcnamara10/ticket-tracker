import React from 'react';
import { SelectField, IconsProvider } from '@aws-amplify/ui-react';
import { FaCaretDown } from 'react-icons/fa';
import '@aws-amplify/ui-react/styles.css';
import './index.css';

/**
 * Interface that represents the props for the DropdownMenu.
 *
 * @property {string} value - The current selected value of the dropdown.
 * @property {function} onChange - The function to call when the selected value changes.
 * @property {Array<{ value: string; label: string }>} options - The options to display in the dropdown.
 */
interface DropdownMenuProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

/**
 * Represents a dropdown menu component.
 *
 * @param {DropdownMenuProps} props - The props for the DropdownMenu.
 */
const DropdownMenu: React.FC<DropdownMenuProps> = ({ value, onChange, options }) => (
  <IconsProvider
    icons={{
      select: {
        expand: <FaCaretDown color='white' />,
      },
    }}>
    <SelectField
      label={''}
      labelHidden={true}
      size='small'
      value={value}
      onChange={event => onChange(event.target.value)}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </SelectField>
  </IconsProvider>
);

export default DropdownMenu;
