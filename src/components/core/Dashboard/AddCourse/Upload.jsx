// import React, { useEffect, useRef, useState } from 'react'
// import { useDropzone } from 'react-dropzone';
// import { FiUploadCloud } from 'react-icons/fi';
// import { useSelector } from 'react-redux'

// import "video-react/dist/video-react.css"
// import { Player } from 'video-react';
// export const Upload = ({
//     name,label,register,setValue,errors,
//     video = false ,
//     viewData = null ,
//     editData = null ,
// }) => {

//     const {course} = useSelector((state) => state.course);
//     const [selectedFile,setSelectedFile] = useState(null);
//     const [previewSource,setPreviewSource] = useState(
//         viewData ? viewData : editData ? editData :""
//     )

//     const inputRef = useRef(null)
  

//     const onDrop = (acceptedFiles) => {
//         const file = acceptedFiles[0]
//         console.log("files",file);
//         if(file){
//             previewFile(file)
//             setSelectedFile(file)

//         }
//     };
    
    
//     const {getRootProps,getInputProps,isDragActive} = useDropzone({
//         accept: !video
//        ? {"image/*":[".jpg" ,".jpeg",".png","image/jpeg","image/png","image/jpg"] }
//         :{"video/*":[".mp4"]},
//         onDrop,
//     })
    
    
    
//     const previewFile = (file) =>{
//         // console.log("file",file);
//         const reader = new FileReader()
//         reader.readAsDataURL(file);
//         reader.onloadend = () =>{
//             setPreviewSource(reader.result);
//             console.log("hello");
//         }
//     }
//     useEffect(() =>{
//         register(name,{required:true})
//     },[register])

//     useEffect(() =>{
//         setValue(name, selectedFile)
//     }, [selectedFile, setValue])
    
//   return (
//     <div className='flex flex-col space-y-2'>
//         <label htmlFor={name} className='text-sm text-richblack-5 label-style'>
//             {label}{!viewData && <sup className='text-pink-200'>*</sup>}
//         </label>
//         <div className= {`${isDragActive ? "bg-richblack-600": "bg-richblack-700"}
//         flex lg:min-h-[250px] md:min-h-[250px] min-h-[150px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500
         
//         ` }     
     
//         >
//             {
//                 previewSource ? (
//                     <div className='flex w-full flex-col p-6'>
//                         {
//                             !video ?(
//                                 <img src= {previewSource}  alt="Preview" 
//                                 className="h-full w-full rounded-md object-cover"/>
//                             ):(
//                                 <Player aspectRatio = "16:9" playsInline   src ={previewSource}></Player>

//                             )
//                         }
//                         {!viewData && (
//                             <button
//                             type='button'
//                             onClick={() =>{
//                                 setPreviewSource("")
//                                 setSelectedFile(null)
//                                 setValue(name,null)
//                             }}
//                              className="mt-3 text-richblack-400 underline"
//                             >
//                                 Cancel
//                             </button>
//                         )}
//                     </div>
//                 ):(
//                     <div   className="flex w-full flex-col items-center p-6"
//                      {...getRootProps()}
//                     >
//                        <input {...getInputProps()}   ref={inputRef}  />
//                     <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                    
//                         <FiUploadCloud className='text-2xl text-yellow-50'/>
//                         </div>
//                         <p className='mt-2 max-w-[200px] text-center text-sm text-richblack-200'>
//                         Drag and drop an {!video ? "image" : "video"}, or click to{" "}
//                         <span className='font-semibold text-yellow-50'>Browse</span> a
//                         file
//                         </p>

//                         <ul className='mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200'>
//                             <li>Aspect ratio 16:9</li>
//                             <li>Recommended size 1024x576</li>
//                         </ul>
                       
//                     </div>
//                 )
//             }
//         </div>
//         {errors[name] && (
//         <span className="ml-2 text-xs tracking-wide text-pink-200">
//           {label} is required**
//         </span>
//       )}
//     </div>
//   )
// }



import React, { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css'; // Ensure video-react styles are imported

export const Upload = ({
    name, label, register, setValue, errors,
    video = false,
    viewData = null,
    editData = null,
}) => {
    const { course } = useSelector((state) => state.course);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewSource, setPreviewSource] = useState(viewData || editData || "");
    const inputRef = useRef(null);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            previewFile(file);
            setSelectedFile(file);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: !video
            ? { "image/*": [".jpg", ".jpeg", ".png"] }
            : { "video/*": [".mp4"] },
        onDrop,
    });

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    useEffect(() => {
        register(name, { required: true });
    }, [register, name]);

    useEffect(() => {
        setValue(name, selectedFile);
    }, [selectedFile, setValue, name]);

    return (
        <div className='flex flex-col space-y-2'>
            <label htmlFor={name} className='text-sm text-richblack-5'>
                {label}{!viewData && <sup className='text-pink-200'>*</sup>}
            </label>
            <div
                {...getRootProps()}
                className={`${
                    isDragActive ? "bg-richblack-600" : "bg-richblack-700"
                } flex items-center justify-center rounded-md border-2 border-dotted border-richblack-500 cursor-pointer transition-colors duration-300
                min-h-[150px] p-4 md:min-h-[200px] lg:min-h-[250px]`}
            >
                {previewSource ? (
                    <div className='flex flex-col w-full h-full items-center justify-center p-4'>
                        {!video ? (
                            <img
                                src={previewSource}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-md"
                            />
                        ) : (
                            <Player
                                aspectRatio="16:9"
                                playsInline
                                src={previewSource}
                                className="w-full h-full"
                            />
                        )}
                        {!viewData && (
                            <button
                                type='button'
                                onClick={() => {
                                    setPreviewSource("");
                                    setSelectedFile(null);
                                    setValue(name, null);
                                }}
                                className="mt-3 text-richblack-400 underline"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <input {...getInputProps()} ref={inputRef} className="hidden" />
                        <div className="flex items-center justify-center bg-pure-greys-800 rounded-full p-4">
                            <FiUploadCloud className='text-3xl text-yellow-50' />
                        </div>
                        <p className='mt-2 text-sm text-richblack-200'>
                            Drag and drop an {!video ? "image" : "video"}, or click to{" "}
                            <span className='font-semibold text-yellow-50'>Browse</span> a file
                        </p>
                        {!video && (
                            <ul className='mt-4 text-xs text-richblack-200'>
                                <li>Aspect ratio 16:9</li>
                                <li>Recommended size 1024x576</li>
                            </ul>
                        )}
                    </div>
                )}
            </div>
            {errors[name] && (
                <span className="ml-2 text-xs text-pink-200">
                    {label} is required
                </span>
            )}
        </div>
    );
};
