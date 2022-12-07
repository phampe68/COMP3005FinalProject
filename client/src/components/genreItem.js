import * as React from 'react';

const GenreItem = (props) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "5px", backgroundColor: "#002884", borderRadius: "5px" }}>
        {props.item}
    </div>
)

export default GenreItem;