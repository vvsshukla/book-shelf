import React from "react"

export const BookShelfTableHeader = ({ source }) => {
    return (
        <div id="thead">
            <div id="thTr" key={"existingBooksHeader"}>
                <div>
                    Cover
                </div>
                <div>
                    Title
                </div>
                <div>
                    Author
                </div>
                {source === 'internal' ?
                    (<>
                        <div>Avg Rating</div>
                        <div>Shelves</div>
                    </>
                    ) : ''}
                <div>
                    Action
                </div>
            </div>
        </div>
    )
}