import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import Layout from "./Layout";
import ApprovalLemburList from "../components/ApprovalLemburList";

const ApprovalLembur = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate("/");
        }
    }, [isError, navigate]);
  return (
      <Layout>
          <ApprovalLemburList />
      </Layout>
  )
}

export default ApprovalLembur