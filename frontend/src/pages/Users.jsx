import React, { useEffect } from "react";
import Userlist from "../components/Userlist";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import Layout from "./Layout";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("Fetching user data...");
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      console.error("Error occurred. Navigating back to login...");
      navigate("/");
    }


  }, [isError, user, navigate]);

  console.log("Rendering Lemburs component...");
  return (
    <Layout>
      <Userlist />
    </Layout>
  );
};

export default Users;