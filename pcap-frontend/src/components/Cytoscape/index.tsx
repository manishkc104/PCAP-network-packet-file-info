import cytoscape from "cytoscape";
import React, { useRef } from "react";
import "./index.css";

interface IProps {
  formattedElements: any;
}

const Cytoscape = ({ formattedElements }: IProps) => {
  const demo = useRef(null);
  React.useEffect(() => {
    const cy = cytoscape({
      container: demo.current,
      elements: formattedElements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#666",
            label: "data(id)",
            "text-valign": "center",
            "text-halign": "center",
            color: "white",
            "text-outline-width": 2,
            "text-outline-color": "#666",
            height: 40,
            width: 40,
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#ccc",
            "target-arrow-color": "black",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
      ],
      layout: {
        name: "breadthfirst",
      },
    });

    return () => {
      cy.destroy();
    };
  }, []);

  return <div id="cy" ref={demo}></div>;
};

export default Cytoscape;
