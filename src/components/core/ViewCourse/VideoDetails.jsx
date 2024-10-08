import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPIs';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { BigPlayButton, Player } from 'video-react';
import 'video-react/dist/video-react.css';
import { FaPlay } from 'react-icons/fa6';
import { IconBnt } from '../../common/IconBnt';
import { AiFillPlayCircle } from 'react-icons/ai';


export const VideoDetails = () => {
     

const {courseId, sectionId, subSectionId} = useParams();
const navigate = useNavigate();
const dispatch = useDispatch();
const location = useLocation();
const playerRef = useRef();
const {token} = useSelector((state)=>state.auth);
const {courseSectionData, courseEntireData, completedLectures} = useSelector((state)=>state.viewCourse);

const [videoData, setVideoData] = useState([]);
const [videoEnded, setVideoEnded] = useState(false);
const [loading, setLoading] = useState(false);
const [previewSource, setPreviewSource] = useState("")

useEffect(()=> {

  const setVideoSpecificDetails = async() => {
      if(!courseSectionData.length)
          return;
      if(!courseId && !sectionId && !subSectionId) {
          navigate("/dashboard/enrolled-courses");
      }
      else {
     

          const filteredData = courseSectionData.filter(
              (course) => course._id === sectionId
          )

          const filteredVideoData = filteredData?.[0].subSection.filter(
              (data) => data._id === subSectionId
          )

          setVideoData(filteredVideoData[0]);
          setPreviewSource(courseEntireData.thumbnail)
          setVideoEnded(false);

      }
  }
  setVideoSpecificDetails();

},[courseSectionData, courseEntireData, location.pathname])

const isFirstVideo = () => {
  const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
  )

  const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
  )
  if(currentSectionIndex === 0 && currentSubSectionIndex === 0) {
      return true;
  }
  else {
      return false;
  }
} 

const isLastVideo = () => {
  const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
  )

  const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

  const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
  )

  if(currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === noOfSubSections - 1) {
          return true;
      }
  else {
      return false;
  }


}

const goToNextVideo = () => {
  const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
  )

  const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

  const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
  )

  if(currentSubSectionIndex !== noOfSubSections - 1) {
      //same section ki next video me jao
      const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1]._id;
      //next video pr jao
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
  }
  else {
      //different section ki first video
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubSectionIds = courseSectionData[currentSectionIndex + 1].subSection[0]._id;
      ///iss voide par jao 
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionIds}`)
  }
}

const goToPrevVideo = () => {

  const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
  )

  const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

  const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
  )

  if(currentSubSectionIndex !== 0 ) {
      //same section , prev video
      const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]._id;
      //iss video par chalge jao
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
  }
  else {
      //different section , last video
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const prevSubSectionLength = courseSectionData[currentSectionIndex - 1].subSection.length;
      const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[prevSubSectionLength - 1]._id;
      //iss video par chalge jao
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)

  }


}

const handleLectureCompletion = async() => {

  ///dummy code, baad me we will replace it witht the actual call
  setLoading(true);
  //PENDING - > Course Progress PENDING
  const res = await markLectureAsComplete({courseId: courseId, subSectionId: subSectionId}, token);
  //state update
  if(res) {
      dispatch(updateCompletedLectures(subSectionId)); 
  }
  setLoading(false);

}
return (
    
  
  <div className='flex flex-col gap-5 text-white mt-4 ml-2 shadow-[8px_8px_rgba(270,255,255)'>
    {
      !videoData ? (
        <img
        src={previewSource}
        alt="Preview"
        className="h-full w-full rounded-md object-cover"
      />
                  )
      : (
          <Player
              ref = {playerRef}
              aspectRatio="16:9"
              playsInline
              onEnded={() => setVideoEnded(true)}
              src={videoData?.videoUrl}
              
              
               >

           
              <BigPlayButton position="center" />

              {
                  videoEnded && (
                      <div
                      style={{
                        backgroundImage:
                          " lg:linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1) md:linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                      }}
                      className="full absolute  inset-0 z-[100] grid h-full place-content-center lg:font-inter"
                      >
                          {
                              !completedLectures.includes(subSectionId) && (
                                  <IconBnt
                                      disabled={loading}
                                      onclick={() => handleLectureCompletion()}
                                      text={!loading ? "Mark As Completed" : "Loading..."}
                                      customClasses= 'lg:text-xl md:text-sm text-[8px] lg:max-w-max md:max-w-max lg:px-4 mx-auto  '
                                  />
                              )
                          }

                          <IconBnt
                              disabled={loading}
                              onclick={() => {
                                  if(playerRef?.current) {
                                    // set the current time of the video to 0
                                      playerRef.current?.seek(0);
                                      setVideoEnded(false);
                                  }
                              }}
                              text="Rewatch"
                              customClasses="lg:text-xl md:text-sm text-[8px] lg:max-w-max md:max-w-max px-4 mx-auto mt-2"
                             
                          />

                          <div className='lg:mt-10  md:mt-10 mt-3 flex min-w-[250px] justify-center gap-x-4 lg:text-xl md:text-xl text-[8px]'>
                              {!isFirstVideo() && (
                                  <button
                                  disabled={loading}
                                  onClick={goToPrevVideo}
                                  className='blackButton lg:text-xl md:text-sm text-[5px] lg:max-w-max md:max-w-max lg:p-4 md:p-4 p-2'
                                  >
                                      Prev
                                  </button>
                              )}
                              {!isLastVideo() && (

                                

                                  <button
                                  disabled={loading}
                                  onClick={goToNextVideo}
                                  className='blackButton lg:text-xl md:text-sm text-[5px] lg:max-w-max md:max-w-max lg:p-4 md:p-4 p-2   '>
                                      Next
                                  </button>
                            
                              )}
                          </div>
                      </div>
                  )
              }
          </Player>
      )
    }
    <h1 className='mt-4 lg:text-3xl md:text-2xl text-xl font-semibold'>
      {videoData?.title}
    </h1>
    <p className='pt-2 pb-6'>
      {videoData?.description}
    </p>

 
  </div>
)
}
