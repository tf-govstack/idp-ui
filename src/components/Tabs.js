import React from "react";

export default function Tabs ({ 
  color,
  tabs,
  block
}) {
  const [openTab, setOpenTab] = React.useState(1);
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
            role="tablist"
          >
            {
            tabs.map((tab, index)=>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === index
                    ? "text-white bg-" + color + "-600"
                    : "text-" + color + "-600 bg-white")
                }
                onClick={e => {
                  e.preventDefault();
                  setOpenTab(index);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                <i className={"fas fa-" + tab.icon + " text-base mr-1"}></i> {tab.name} 
              </a>
            </li>
            )
            }
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space"></div>
              {
                tabs.map((tab, index)=> 
                
                <div className={openTab === index ? "block" : "hidden"} id={"link"+ index}>
                  <p>
                    {index} {block[tab.comp]}
                  </p>
                </div>
                )
              }
              </div>
            </div>
            </div>
            </div>
    </>
  );
};