import React from 'react';
// example of image
import src from '../static/password.jpg';

import styles from './h1.css';
// import { redFont } from "./h1.css";

export default () => {
    return (
        <div>
            <img src={src} alt="" />
            <h1 className={styles.redFont}> Hello Worldd </h1>
        </div>
    );
};
