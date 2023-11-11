import { useRef } from 'react';


export default function(){
    return <UploadFileInput/>
}

export function UploadFileInput({children, onClick=()=>{}, onChange=()=>{}, canUpload=()=>true, ...rest}:any) {
    const input:any = useRef()

    const handleClick = ()=>{
        if(!canUpload()) return
        input.current.click();
        onClick()
    }

    const handleChange = async (event:any) => {
        const fileUploaded = event.target.files;
        if(await onChange(fileUploaded)) input.current.value = ''
      };

    return (<>
        <input ref={input} type='file'  className='hidden' onChange={handleChange}/>
        <button type='button' {...rest} onClick={handleClick}>
            {children}
        </button>
    </>)
}