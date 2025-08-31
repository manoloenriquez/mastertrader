import React, { useState } from "react";
import Slider from "rc-slider";
import styled from "styled-components";
import "rc-slider/assets/index.css";

const StyledSlider = styled(Slider)`
  .rc-slider-rail {
    background-color: #a0a0a0;
    height: 4px;
  }
  .rc-slider-track {
    background-color: rgb(183, 189, 198);
    height: 4px;
  }
  .rc-slider-handle {
    background-color: rgb(24, 26, 32);
    border: 4px solid rgb(71, 77, 87);
    width: 14px !important;
    height: 14px !important;
    transform: rotate(45deg);
    box-shadow: none;
    margin-top: -5px;
  }
  .rc-slider-handle:hover {
    border-color: rgb(183, 189, 198);
  }
  .rc-slider-mark {
    font-size: 12px;
    color: #c5cbce;
  }
  .rc-slider-dot {
    background-color: rgb(30, 35, 41);
    border: 1px solid rgb(71, 77, 87);
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    margin-left: -5px;
    margin-top: -5px;
  }
  .rc-slider-dot-active {
    background-color: rgb(183, 189, 198);
  }
`;

export default function SizeSlider({ balance, onChange }) {
  const [value, setValue] = useState(0);

  const handleChange = (newValue) => {
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  const marks = {
    0: "",
    25: "",
    50: "",
    75: "",
    100: "",
  };

  return (
    <div>
      <StyledSlider
        value={value}
        onChange={handleChange}
        marks={marks}
        min={0}
        max={100}
        step={1}
      />
    </div>
  );
}
