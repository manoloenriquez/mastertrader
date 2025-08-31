import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import styled from "styled-components";

const DiamondSlider = styled(Slider)`
  .MuiSlider-rail {
    background-color: #a0a0a0; /* Adjust the rail color here */
  }
  .MuiSlider-track {
    background-color: rgb(183, 189, 198); /* Adjust the track color here */
    /* border-color: #212529; */
    border: none;
  }
  .MuiSlider-thumb {
    background-color: rgb(24, 26, 32); /* Adjust the thumb color here */

    border: 4px solid rgb(71, 77, 87);
    /* border: none; */
    width: 14px;
    height: 14px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    box-shadow: none;
  }
  .MuiSlider-mark {
    background-color: rgb(30, 35, 41);
    border: 1px solid rgb(71, 77, 87);
    width: 10px;
    height: 10px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
  }
  .MuiSlider-markActive {
    background-color: rgb(183, 189, 198);
    opacity: 1;
  }
  .MuiSlider-valueLabel {
    top: -30px;
    left: -15px;
    width: 30px;
    height: 30px;
    background-color: #fff;
    color: #000;
    font-size: 12px;
    font-weight: bold;
  }
  .MuiSlider-markLabel {
    color: #c5cbce;
  }
`;

export default function SizeSlider({ balance, onChange }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const marks = [
    { value: 0, label: "" },
    { value: 25, label: "" },
    { value: 50, label: "" },
    { value: 75, label: "" },
    { value: 100, label: "" },
  ];

  return (
    <div>
      <DiamondSlider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        marks={marks}
        min={0}
        max={100}
      />
    </div>
  );
}
