import React, { useContext } from 'react';
//import { Context } from "../Wrapper";
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function LogoDisplay(image) {

    //const context = useContext(Context);
    return (
        <LazyLoadImage
            alt=""
            height={150}
            src={!image.includes("http") ? "/images/uploads/" + image : image}
            width="100%" />
    )
}