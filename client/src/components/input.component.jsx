import React from 'react'

const InputBox = ({name,type,id,value,placeholder,icon,disabled = false,is_brand}) => {

  const [showPassword, setShowPassword] = React.useState(false);

  let inputIcon = showPassword ?  "eye" : "eye-crossed";
  const handleClick = () => {
    setShowPassword((prev) => !prev);
    let input = document.querySelector(`input[name=${name}]`);
    if(showPassword){
      input.type = "password";
    }else{
      input.type = "text";
    }
  }

  return (
    <div className='relative w-[100%] mb-4'>
      <input 
        name={name}
        type={type}
        id={id}
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        className='input-box'
      />
      <i className={`fi fi-${is_brand ? "brands" : "rr"}-${icon} input-icon`}></i>
      {
        
        type == "password"
        ?
        <i onClick={handleClick} className={`fi fi-rr-${inputIcon} input-icon left-[auto] right-4 cursor-pointer`}></i>
        :
        null
      }
    </div>
  )
}

export default InputBox