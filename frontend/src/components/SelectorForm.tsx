// import React from 'react'
// import { Controller } from 'react-hook-form'
// import Select from 'react-select'

// function SelectorForm(props: any) {
//   const { error } = props.method.getFieldState(props.methodName)
//   return (
//     <div className={`w-full space-y-1 ${props.className}`}>
//       <label className="md:mx-0 text-md font-light text-gray-600">
//         {props.label}
//       </label>
//       <Controller
//         control={props.method.control}
//         name={props.methodName}
//         defaultValue={props.defaultValue}
//         render={({
//           field: { onChange, onBlur, value, name, ref },
//           fieldState: { invalid, isTouched, isDirty, error },
//           formState,
//         }) => {
//           return (
//             <Select
//               className={props.className}
//               styles={{
//                 control: (baseStyles, state: any) => ({
//                   ...baseStyles,
//                   borderRadius: '0px',
//                   paddingTop: '1px',
//                   paddingBottom: '1px',
//                   borderColor: state.isTouched ? '#624d4d' : '#624d4d',
//                   borderWidth: '2px',
//                 }),
//               }}
//               classNamePrefix="select"
//               placeholder={props.placeholder}
//               options={props.options}
//               isMulti={props.isMulti}
//               onBlur={props.onBlur}
//               onChange={(e) => {
//                 if (props.isMulti) {
//                   onChange(e.map((d: any) => d.value))
//                   if (props.onChange) {
//                     props.onChange(e)
//                   }
//                 } else {
//                   onChange(e.value)
//                   if (props.onChange) {
//                     props.onChange(e)
//                   }
//                 }
//               }}
//               isDisabled={props.disabled}
//               ref={ref}
//               value={
//                 props.onChange
//                   ? props.value
//                   : props.options?.find((o: any) => o.value === value)
//               }
//             />
//           )
//         }}
//       />
//       {error && <p className="text-red-600 mt-1 mx-1">{error.message}</p>}
//     </div>
//   )
// }

// export default SelectorForm
