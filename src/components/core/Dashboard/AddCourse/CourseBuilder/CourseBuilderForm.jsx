import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IconBnt } from '../../../../common/IconBnt';
import { IoMdAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { MdNavigateNext } from 'react-icons/md';
import {setCourse, setEditCourse, setStep} from "../../../../../slices/courseSlice"
import {toast} from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPIs';
import { NestedView } from './NestedView';
export const CourseBuilderForm = () => {
  const {register,handleSubmit,setValue,
    formState:{errors}
  } = useForm();

  const [editSectionName,setEditSectionName] = useState(null);
   const {course} = useSelector((state) =>  state.course)
   const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
   const [loading,setLoading] = useState(false);

    const onSubmit = async(data) =>{
          setLoading(true);
          let result;
          if(editSectionName){
            //  we are editing thw section name
            result = await updateSection(
                   {
                    sectionName: data.sectionName,
                    sectionId: editSectionName,
                    courseId: course._id,
                   },token
            )
          }
          else{
             result = await createSection({
              sectionName: data.sectionName,
              courseId: course._id,
             },token)
          }

          // update value
          if(result){
            dispatch(setCourse(result));
            setEditSectionName(null);
            setValue("sectionName","");
          }
          // loading false
          setLoading(false);
    }


  const cancelEdit = () =>{
    setEditSectionName(null);
    setValue("sectionName","");
  }

  const goBack = () =>{
     dispatch(setStep(1));
     dispatch(setEditCourse(true));
  }
  const goToNext = () =>{
    if(course?.courseContent?.length === 0){
      toast.error("Please add atleast one section");
      return;
    }
    if(course.courseContent.some((section) => section.subSection.length === 0)){
      toast.error("Please add atleast one lecture in each section ");
      return;
    }
    //  if everything is good
    dispatch(setStep(3));
  }

  const handleChangeEditSectionName = (sectionId, sectionName) =>{
    if(editSectionName === sectionId){
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName",sectionName);
  }
  return (
    <div className='space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 lg:p-6 md:p-6 p-2 lg:mr-0 md:mr-0 mr-1 '>
     <p className='text-2xl font-semibold text-richblack-5'>Course Builder</p>
     <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='flex flex-col space-y-2'>
        <label htmlFor="sectionName" className='text-sm text-richblack-5'>Section name<sup className='text-pink-200'>*</sup></label>
        <input
           id='sectionName'
           placeholder='Add a section to build your course'
           {...register("sectionName",{required:true})}
           className='w-full form-style'
        />
        {
          errors.sectionName && (
            <span className='ml-2 text-xs tracking-wide text-pink-200'>
              Section Name is required**
            </span>
          )
        }
      </div>

      <div className='flex items-end gap-x-4'>
        <IconBnt  
        type= "submit"
        text={editSectionName ? "Edit Section Name" : "Create Section"}
        outline = {true}
        customClasses={"text-white"}
        >
          <IoMdAddCircleOutline className='text-yellow-50 ' size={20} />

        </IconBnt>
        {editSectionName && (
          <button type='button' onClick={cancelEdit}
          className='text-sm text-richblack-300 underline ml-10' >
            Cancel Edit
          </button>
        )}
      </div>
     </form>

     {course?.courseContent?.length > 0 && (
       <NestedView handleChangeEditSectionName = {handleChangeEditSectionName}/>
     )}
     <div className='flex justify-end gap-x-3 '>
       <button onClick={goBack}
       className='flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900'
       >
        Back
       </button>
       <IconBnt text="Next" disabled={loading} onclick={goToNext}>
       <MdNavigateNext />
       </IconBnt>
     </div>
    </div>
  )
}
