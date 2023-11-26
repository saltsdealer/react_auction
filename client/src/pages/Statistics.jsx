import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { MixedChart } from "../components/MixedChart";

const Statistics = () => {
  // if not login, login first
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    if (!currentUser) {
      navigate("/admin/login", { replace: true });
    }
  }, [currentUser, navigate]);

  const [selection, setSelection] = useState({
    category: "user",
    year: "2023",
  });

  const handleCategoryChange = (event) => {
    setSelection({ ...selection, category: event.target.value });
    console.log(selection);
  };

  const handleYearChange = (event) => {
    setSelection({ ...selection, year: event.target.value });
    console.log(selection);
  };

  return (
    <div>
      <select value={selection.category} onChange={handleCategoryChange}>
        <option value="user">User</option>
        <option value="revenue">Revenue</option>
      </select>

      <select value={selection.year} onChange={handleYearChange}>
        <option value="2018">2018</option>
        <option value="2019">2019</option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
      </select>

      <div>
        <MixedChart category={selection.category} year={selection.year} />
      </div>
    </div>
  );
};

export default Statistics;
