import React, { useEffect, useState, CSSProperties } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { BookCard } from "./BookCard";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loader, setLoader] = useState(true);
    const {user} = useAuth();
    const fetchRecommendations = async () => {
        const header = {
            'Content-Type':'application/json'
        }
        let language = user.language ? user.language : 'en';
        let data = {language: language};
        let response = await axios.post(process.env.REACT_APP_SERVER_URL+'api/recommendations', data, header);
        if (typeof response.data !== "undefined") {
            setRecommendations(response.data);
            setLoader(false);
        }
    }

    useEffect(() => {
        fetchRecommendations();
    }, []);
    
    return <>
                {
                        loader ? (<FontAwesomeIcon icon={faSpinner} size="2x"/>) : (recommendations.length > 0 ? (<div id="recommendations"><RecommendationsList recommendations={recommendations}/></div>):(<p className="">No book recommendations for now.</p>))
                }
           </>;
}

const RecommendationsList = ({recommendations}) => {
    const arrowStyles = {
        position: 'absolute',
        zIndex: 2,
        top: 'calc(50% - 15px)',
        width: 30,
        height: 30,
        cursor: 'pointer',
    };

    const indicatorStyles = {
        background: '#fff',
        width: 8,
        height: 8,
        display: 'none',
        margin: '0 8px',
    };
    return <><Carousel 
    showArrows={true}
    centerMode
    centerSlidePercentage={50}
    statusFormatter={(current, total) => `Current slide: ${current} / Total: ${total}`}
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
                hasPrev && (
                    <button type="button" onClick={onClickHandler} title={label} style={{ ...arrowStyles, left: 15 }}>
                        <FontAwesomeIcon icon={faAngleLeft} size="2x"/>
                    </button>
                )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
                hasNext && (
                    <button type="button" onClick={onClickHandler} title={label} style={{ ...arrowStyles, right: 15 }}>
                        <FontAwesomeIcon icon={faAngleRight} size="2x"/>
                    </button>
                )
            }
            renderIndicator={(onClickHandler, isSelected, index, label) => {
                if (isSelected) {
                    return (
                        <li
                            style={{ ...indicatorStyles, background: '#000' }}
                            aria-label={`Selected: ${label} ${index + 1}`}
                            title={`Selected: ${label} ${index + 1}`}
                        />
                    );
                }
                return (
                    <li
                        style={indicatorStyles}
                        onClick={onClickHandler}
                        onKeyDown={onClickHandler}
                        value={index}
                        key={index}
                        role="button"
                        tabIndex={0}
                        title={`${label} ${index + 1}`}
                        aria-label={`${label} ${index + 1}`}
                    />
                );
            }}
    >{recommendations.map((recommendation) => <Recommendation book={recommendation}/>)}</Carousel></>;
}

const Recommendation = ({book}) => {
    return <div id="recommendation">
                <img src={book?.imageLinks?.smallThumbnail}/>
                <b>{book.title}</b>
           </div>;
}