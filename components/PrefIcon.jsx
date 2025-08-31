import { useTheme } from "../context/ThemeContext";

export default function PrefIcon() {
  const {
    data: { theme },
  } = useTheme();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M21 6h-7.79a4.001 4.001 0 00-7.42 0H3v3h2.79a4.001 4.001 0 007.42 0H21V6zm-10.21 9H3v3h7.79a4.001 4.001 0 007.42 0H21v-3h-2.79a4.001 4.001 0 00-7.42 0z"
        fill="currentColor"
      ></path>

      <style jsx>{`
        svg {
          box-sizing: border-box;
          margin: 5px 0px 0px;
          min-width: 0px;
          fill: currentcolor;
          color: ${theme === "light"
            ? "rgb(198, 202, 208)"
            : "rgb(61, 70, 83)"};
          cursor: pointer;
          width: 1em;
          height: 1em;
          font-size: 20px;
        }
      `}</style>
    </svg>
  );
}
