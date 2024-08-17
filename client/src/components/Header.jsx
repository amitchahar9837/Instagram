import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Navbar, Modal, TextInput, Spinner } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { MdLightMode, MdOutlineLightMode } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const path = useLocation().pathname;
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(()=>{
    if(search === '') setUsers([]);
    if(search !== '') handleSearch();
  },[search])

  const handleSearch = async()=>{
    try {
      setLoading(true);
      const res = await fetch(`/api/user/searchuser?search=${search}`);
      const data = await res.json();
    if(res.ok){
      setLoading(false);
      setUsers(data);
    }else{
      setLoading(false);
      console.log(data.message);
    }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Navbar className="border-b-2 relative">
      <Link
        to={"/"}
        className="logo p-1 text-3xl md:text-4xl h-fit bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent  "
      >
        Instagram
      </Link>


      <div className="flex items-center gap-4 md:order-2">
      {
        currentUser && (
          <Button
        className="w-12 h-10 flex items-center"
        color="gray"
        pill
        onClick={() => setShowSearchModal(true)}
      >
        <AiOutlineSearch />
      </Button>
        )
      }
        <Button
          className="w-10 h-10 flex items-center rounded-full border-none outline-none"
          color={"gray"}
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? (
            <MdLightMode className="text-xl font-semibold" />
          ) : (
            <MdOutlineLightMode className="text-xl font-semibold" />
          )}
        </Button>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser.dp} rounded className="dark:bg-white overflow-hidden rounded-full" />}
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.name}
              </span>
            </Dropdown.Header>
            <Link to={"/profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout} >Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"}>
            <Button gradientDuoTone="pinkToOrange" outline>
              Sign in
            </Button>
          </Link>
        )}
        {currentUser && <Navbar.Toggle />}
      </div>
      {currentUser && (
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to={"/"}>Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/following-post"} as={"div"}>
            <Link to={"/following-post"}>Following Post</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/create-post"} as={"div"}>
            <Link to={"/create"}>Create</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      )}

      {/* Search User Modal */}
      <Modal
        show={showSearchModal}
        size={"md"}
        popup
      >
        <Modal.Header onClick={() => setShowSearchModal(false)} />
        <Modal.Body>
          <TextInput value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search..."  />
            <div className="w-full flex flex-col gap-5 mt-4 max-w-[400px] overflow-y-auto noScrollbar ">
            {
              loading ? (
                <h3 className="logo text-center text-3xl">
                <Spinner size={"lg"} />
              </h3>
              ) : (
                users.length > 0 && (
                  users.map(user => (
                    <Link to={`${currentUser._id !== user._id ? `/user/${user._id}` : "/profile"}`} key={user._id} className="flex items-center gap-3" onClick={() => setShowSearchModal(false)}>
                      <img src={user.dp} alt={user.name}  className="w-10 h-10 rounded-full"/>
                      <div className="flex flex-col">
                        <h2 className="font-semibold">{user.name}</h2>
                        <p className="text-gray-400 text-sm">{user.username}</p>
                      </div>
                    </Link>
                  ))
                )
              )
            }
            </div>            
        </Modal.Body>
      </Modal>
    </Navbar>
  );
}
