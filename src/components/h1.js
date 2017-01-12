import React from 'react';

// example of image
import src from '../static/password.jpg';
// example of CSS pulled in, that make use of an img
import styles from './h1.css';

export default () => {
    return (
        <div>
            <h1>look at h1.js component:</h1>

            <p>How an image is referenced in a component:</p>
            <p><img src={src} alt="" /></p>
            <p>Use of CSS and and image defined in a CSS file:</p>
            <h3 className={styles.redFont}>Hello World</h3>
        </div>
    );
};
