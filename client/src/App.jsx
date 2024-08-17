import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import NavigatePage from "./components/NavigatePage";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import UserProfile from "./pages/userProfile";
import EditProfilePage from "./pages/EditProfilePage";
import FollowingPost from "./pages/FollowingPost";
import FollowerList from "./pages/FollowerList";
import FollowingList from "./pages/FollowingList";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import Search from "./pages/Search";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Header />

        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/profile/edit/:id" element={<EditProfilePage />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/following-post" element={<FollowingPost />} />
            <Route path='/profile/follower-list/:userId' element={<FollowerList/>} />
            <Route path='/profile/following-list/:userId' element={<FollowingList/>} />
            <Route path='/post/:postId' element={<PostDetails/>} />
            <Route path="/create" element={<CreatePost/>} />
            <Route path="/search" element={<Search/>} />
          </Route>
          <Route element={<NavigatePage />}>
            <Route path="/sign-in" element={<Signin />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/reset-password" element={<ResetPassword/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
