import ProgressBar from '@ramonak/react-progress-bar';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const EnrolledCourses = () => {
    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [enrolledCourses,setEnrolledCourses] = useState(null);
         useEffect(()=>{

           const getEnrolledCourses = async() =>{
               try {
               
                   const response = await getUserEnrolledCourses(token);
                   const filterPublishCourse = response.filter((ele) => ele.status !== "Draft")
                   setEnrolledCourses(filterPublishCourse);
               } catch (error) {
                   console.log("Unable to Fetch Enrolled Courses");
               }
           };
           getEnrolledCourses();
         },[])
  
return (
    <>
    <div className='lg:mt-10 md:mt-10 mt-12 '>
      <div className="lg:text-3xl md:text-3xl text-2xl text-richblack-50 md:ml-2">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)]  place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
          {/* TODO: Modify this Empty State */}
        </p>
      ) : (
        <div className="my-8 lg:w-full md:w-full w-full  text-richblack-5 ">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <p className="lg:w-[45%] md:w-[45%] w-[50%] lg:px-5 md:px-5 px-6 py-3">Course Name</p>
            <p className="lg:w-1/4 md:w-1/4 w-1/2  lg:px-2 md:px-2 px-10 py-3">Duration</p>
            <p className="flex-1 lg:px-2 md:px-2 px-8 py-3">Progress</p>
          </div>
          {/* Course Names */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex items-center border border-richblack-700 ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="flex lg:w-[45%] md:w-[45%] w-[50%] cursor-pointer items-center lg:gap-4 md:gap-4 gap-3 lg:px-5 md:px-5 px-1 py-3 "
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  )
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="lg:h-14 md:h-14 h-12 lg:w-14 md:w-14 w-12 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="lg:font-semibold md:font-semibold font-medium">{course.courseName}</p>
                  <p className="text-xs lg:text-richblack-300 md:text-richblack-300 text-richblack-25">
                    {course.courseDescription.length > 20
                      ? `${course.courseDescription.slice(0, 20)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>
              <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  )
}
