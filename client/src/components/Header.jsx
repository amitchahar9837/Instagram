import React, { useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { MdLightMode, MdOutlineLightMode } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const [searchBar, setSearchBar] = useState(false);

  const path = useLocation();

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

      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className={`hidden lg:inline outline-[#ee2a7b] ${
            searchBar && "!inline absolute top-[100%] z-10"
          }`}
        />
      </form>
      <Button
        className="w-12 h-10 lg:hidden flex items-center"
        color="gray"
        pill
        onClick={() => setSearchBar(!searchBar)}
      >
        {searchBar ? <ImCross /> : <AiOutlineSearch />}
      </Button>

      <div className="flex items-center gap-4 md:order-2">
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
              <span className="block text-sm">@{currentUser.name}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
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
    </Navbar>
  );
}
