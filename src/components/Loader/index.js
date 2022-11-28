import React from 'react';
import './style.css';

function Loader(props) {
    return (
        <div className='spinner'>
            <div
                className='rect1'
                style={{ backgroundColor: props.loaderColor && '#393E46' }}
            ></div>
            <div
                className='rect2'
                style={{ backgroundColor: props.loaderColor && '#393E46' }}
            ></div>
            <div
                className='rect3'
                style={{ backgroundColor: props.loaderColor && '#393E46' }}
            ></div>
            <div
                className='rect4'
                style={{ backgroundColor: props.loaderColor && '#393E46' }}
            ></div>
            <div
                className='rect5'
                style={{ backgroundColor: props.loaderColor && '#393E46' }}
            ></div>
        </div>
    );
}

export default Loader;
