import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'
import CustomSwitch, { CustomSwitchProps } from './CustomSwitch'

export function FormSwitch<T extends FieldValues>({
  name,
  ...props
}: { name: Path<T> } & Omit<CustomSwitchProps, 'checked' | 'onChange'>) {
  const { control } = useFormContext<T>()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <CustomSwitch checked={value ?? false} onChange={onChange} {...props} />
      )}
    />
  )
}
