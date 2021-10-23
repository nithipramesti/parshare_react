import React, { useSelector } from 'react';
import { Redirect } from 'react-router-dom';

function Transactions(){
  const authReducer = useSelector((state) => state.authReducer);

  if (authReducer.role === "user") {
    //if role is 'user', redirect to home page
  } else {
    return <Redirect to="/login" />;
  }
}

export default Transactions;