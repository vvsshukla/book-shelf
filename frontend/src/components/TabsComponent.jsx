import { useState } from "react";
import "./TabComponent.css";

export const TabsComponent = ({tabItems}) => {
    const [active, setActive] = useState(0);
    return (
        <div className="wrapper">
            <div className="tabs">
                {tabItems?.map(({id, title}) => 
                    <TabItemComponent 
                        key={title} 
                        title={title}
                        onItemClicked={() => setActive(id)}
                        isActive={active === id}
                    />)}
            </div>
            <div className="content">
                {tabItems?.map(({id, content}) => {
                    return active === id ? content : ''
                })}
            </div>
        </div>
    );
}

const TabItemComponent = ({title, onItemClicked = () => console.error('You passed no action to the component.'), isActive = false}) => {
    return (
        <div className={isActive ? 'tabItem' : 'tabItem tabItemInactive'} onClick={onItemClicked}>
            <p className="tabItemTitle">{title}</p>
        </div>
    )
}