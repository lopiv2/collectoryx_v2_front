import React, { useContext } from 'react';
import { Context } from "../Wrapper";
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function LogoDisplay(image) {

    const context = useContext(Context);
    return (
        <LazyLoadImage
            alt=""
            height={150}
            src={require('../../../public/images/' + image)} // use normal <img> attributes as props
            width="100%" />
    )
}