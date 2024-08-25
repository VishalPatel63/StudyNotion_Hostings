import React, { useEffect, useState } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { NavbarLinks } from '../../data/navbar-links'
import { useLocation } from 'react-router-dom'
import { matchPath } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// import { FaCartArrowDown } from "react-icons/fa6";

import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
// import { FaChevronDown } from "react-icons/fa6";
import { ProfileDropDown } from '../core/Auth/ProfileDropDown'
import { AiOutlineMenu, AiOutlineShoppingCart } from 'react-icons/ai'
import { ACCOUNT_TYPE } from '../../utils/constants'
import { BsChevronDown } from 'react-icons/bs'


import { ConfirmationModalNavbar } from './ConfirmationModalNavbar'
import { NavbrModal } from './NavbrModal'


const Navbar = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()
  const [confirmationModalNav, setConfirmationModalNav] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {


    const fetchAllCategory = async () => {
      setLoading(true)
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API)
        console.log("result category", result);
        setSubLinks(result.data.data);

      } catch (error) {
        console.log("Could not fetch Categories", error)
      }
      setLoading(false)
    }
    fetchAllCategory();
  }, [])






  console.log("length", subLinks.length);
  //  console.log("lengthset",setSubLinks);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  }




  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${location.pathname !== "/" ? "bg-richblack-800" : ""
        } transition-all duration-200`}
    >
      {/* {confirmationModal && <ConfirmationModalNavbar modalData={confirmationModal} />} */}
      {confirmationModalNav && <NavbrModal  setConfirmationModalNav = {setConfirmationModalNav}/>}
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25 font-semibold">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                        }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex  translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px] md:w-[250px] w-[150px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              // ?.filter(
                              //   (subLink) => subLink?.courses?.length > 0
                              // )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50 text-richblack-500"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                        }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className=" items-center lg:gap-x-4 md:gap-x-4   gap-x-3 flex lg:flex md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 lg:px-[12px] lg:py-[8px] px-[8px] py-[6px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 lg:px-[12px] lg:py-[8px] px-[8px] py-[6px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>



{/* navbar modal */}

        <button className="mr-4 md:hidden lg:hidden   "
     onClick={()=>setConfirmationModalNav((true))}
        >
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>


      </div>
    </div>
  )
}
export default Navbar









