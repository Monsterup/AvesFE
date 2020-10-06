import React from 'react'
import HashLoader from 'react-spinners/HashLoader'
import LoadingOverlay from 'react-loading-overlay'

function loading(props) {
    return (
    <div className="app justify-content-center">
        <LoadingOverlay
            active={true}
            spinner={<HashLoader color={"#f5c33b"}/>}
        >
        </LoadingOverlay>
    </div>
    )
}

export default loading;