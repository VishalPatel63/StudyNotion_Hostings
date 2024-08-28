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



import React, { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';

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

    // Initialization logic similar to Dropzone's init method
    useEffect(() => {
        // Custom initialization code here
        console.log('Upload component initialized');
        // For example, you might set default values or configurations
        if (viewData || editData) {
            console.log('Initial file:', viewData || editData);
        }
    }, [viewData, editData]);

    // Handle file drop or selection
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            previewFile(file);
            setSelectedFile(file);
        }
    };

    // Configure react-dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: !video
            ? { "image/*": [".jpg", ".jpeg", ".png"] }
            : { "video/*": [".mp4"] },
        onDrop,
    });

    // Create a preview URL for the selected file
    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    // Register the input field with react-hook-form
    useEffect(() => {
        register(name, { required: true });
    }, [register, name]);

    // Update form value when the selected file changes
    useEffect(() => {
        setValue(name, selectedFile);
    }, [selectedFile, setValue, name]);

    return (
        <div className="max-w-full mx-auto p-4">
            <label htmlFor={name} className="block text-lg font-medium mb-2">{label}</label>
            <div {...getRootProps({ className: 'border-2 border-dashed border-blue-500 rounded-lg p-4 text-center cursor-pointer hover:border-blue-700 transition-all' })}>
                <input {...getInputProps()} id={name} ref={inputRef} className="hidden" />
                {isDragActive ? (
                    <p className="text-blue-500">Drop the files here...</p>
                ) : (
                    <p className="text-gray-500">Drag 'n' drop some files here, or click to select files</p>
                )}
                {previewSource && (
                    <div className="mt-4">
                        {video ? (
                            <video controls src={previewSource} className="w-full max-h-96 object-cover" />
                        ) : (
                            <img src={previewSource} alt="Preview" className="w-full max-h-96 object-cover" />
                        )}
                    </div>
                )}
            </div>
            {errors[name] && <p className="text-red-500 mt-2">{errors[name].message}</p>}
        </div>
    );
};
