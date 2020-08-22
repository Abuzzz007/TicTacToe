import React from 'react';
import loadinggif from '../Images/Loading.gif';

function Loading() {
    return(
        <div className='loading'>
            <img src={loadinggif} alt={loadinggif} width='100px' height='100px'/>
        </div>
    );
}

export default Loading;