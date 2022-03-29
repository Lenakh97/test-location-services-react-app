import { FunctionComponent } from "react";


export const Checkbox: FunctionComponent<{checked: boolean, label: string, id: string, onClick: () => void}> = ({checked, label, id, onClick}) => <>
  <input 
  type="checkbox"
  checked={checked}
  id={id}
  onChange={onClick}
  />
  <label htmlFor={id}>{label}</label>
</>