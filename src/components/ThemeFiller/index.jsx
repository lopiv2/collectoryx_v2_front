import React, { useState, useEffect } from "react";
import SvgIcon from "@mui/material/SvgIcon";

function ThemeTemplate(props) {
  const [primaryColor, setPrimaryColor] = useState(props.primarycolor);
  const [secondaryColor, setSecondaryColor] = useState(props.secondarycolor);
  const [sidebarColor, setSidebarColor] = useState(props.sidebarcolor);
  const [topbarColor, setTopbarColor] = useState(props.topbarcolor);
  const [listItemColor, setListItemColor] = useState(props.listitemcolor);
  const [backColor, setBackColor] = useState(props.backcolor);

  useEffect(() => {
    setTopbarColor(props.topbarcolor.css.backgroundColor);
    setSidebarColor(props.sidebarcolor.css.backgroundColor);
    setBackColor(props.backcolor.css.backgroundColor);
    setPrimaryColor(props.primarycolor.css.backgroundColor);
    setListItemColor(props.listitemcolor.css.backgroundColor);
    setSecondaryColor(props.secondarycolor.css.backgroundColor);
  }, [props]);

  return (
    <SvgIcon
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="512"
      height="512"
      version="1.1"
      viewBox="0 0 135.467 135.467"
      xmlSpace="preserve"
    >
      <g display="inline">
        <image
          width="123"
          height="103.161"
          x="5.21"
          y="18.677"
          display="inline"
          preserveAspectRatio="none"
          href="data:image/png;base64,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"
        ></image>
      </g>
      <path
        id="topBar"
        fill={topbarColor}
        fillOpacity="1"
        strokeWidth="0.257"
        d="M43.823 33.532H128.275V44.931H43.823z"
      ></path>
      <path
        id="back"
        fill={backColor}
        fillOpacity="1"
        strokeWidth="0.271"
        d="M44 45.153H127.565V120.28999999999999H44z"
      ></path>
      <g
        id="sidebar"
        fill="#fff"
        fillOpacity="1"
        display="inline"
        transform="matrix(.9964 0 0 1.0061 .068 -.204)"
      >
        <path
          fill={sidebarColor}
          strokeWidth="0.317"
          d="M19.117 45.109H43.778999999999996V57.351H19.117z"
        ></path>
        <path
          fill={sidebarColor}
          strokeWidth="0.269"
          d="M19.161 57.484H43.778000000000006V120.82300000000001H19.161z"
        ></path>
        <path
          strokeWidth="0.306"
          d="M19.014 33.489H43.67V44.908H19.014z"
        ></path>
      </g>
      <g
        id="cards"
        fill="#ececec"
        fillOpacity="1"
        strokeDasharray="none"
        strokeWidth="0.216"
      >
        <path d="M47.371 51.806H70.968V85.338H47.371z"></path>
        <path d="M73.452 51.806H97.049V85.338H73.452z"></path>
        <path d="M99.177 51.806H122.774V85.338H99.177z"></path>
        <path d="M47.726 86.581H71.32300000000001V120.113H47.726z"></path>
        <path d="M73.806 86.581H97.40299999999999V120.113H73.806z"></path>
        <path d="M99.532 86.581H123.12899999999999V120.113H99.532z"></path>
      </g>
      <g
        id="text"
        fill={primaryColor}
        fillOpacity="1"
        strokeDasharray="none"
        strokeWidth="0.265"
      >
        <path d="M25.726 50.21H40.097V53.049H25.726z"></path>
        <path
          d="M25.374 -63.694H39.745V-60.855000000000004H25.374z"
          transform="scale(1 -1)"
        ></path>
        <path
          d="M25.374 -69.514H39.745V-66.675H25.374z"
          transform="scale(1 -1)"
        ></path>
        <path
          d="M25.374 -75.335H39.745V-72.496H25.374z"
          transform="scale(1 -1)"
        ></path>
        <path
          d="M25.374 -81.156H39.745V-78.31700000000001H25.374z"
          transform="scale(1 -1)"
        ></path>
        <path
          d="M25.374 -86.977H39.745V-84.138H25.374z"
          transform="scale(1 -1)"
        ></path>
      </g>
      <g
        id="icons"
        fill={listItemColor}
        fillOpacity="1"
        strokeDasharray="none"
        strokeWidth="0.265"
        transform="matrix(.20465 0 0 1 15.419 0)"
      >
        <path d="M25.726 50.21H40.097V53.049H25.726z"></path>
        <path
          d="M25.374 -63.694H39.745V-60.855000000000004H25.374z"
          transform="scale(1 -1)"
        ></path>
        <path
          d="M25.374 -69.514H39.745V-66.675H25.374z"
          transform="scale(1 -1)"
        ></path>
        <path
          d="M25.374 -75.335H39.745V-72.496H25.374z"
          transform="scale(1 -1)"
        ></path>
        <path
          d="M25.374 -81.156H39.745V-78.31700000000001H25.374z"
          transform="scale(1 -1)"
        ></path>
        <path
          d="M25.374 -86.977H39.745V-84.138H25.374z"
          transform="scale(1 -1)"
        ></path>
      </g>
    </SvgIcon>
  );
}

export default ThemeTemplate;
