import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Search() {
      const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
      const location = useLocation();
      useEffect(() => {
            const urlParams = new URLSearchParams(location.search);
        
            const getUsers = async () => {
              setLoading(true);
              const searchQuery = urlParams.toString();
              const res = await fetch(`/api/user/searchuser?${searchQuery}`);
        
              if (!res.ok) {
                setLoading(false);
                return;
              } else {
                const data = await res.json();
                setUsers(data);
                setLoading(false);
              }
            };
            getUsers();
          }, [location.search]);
  return (
    <div className="">

    </div>
  )
}
