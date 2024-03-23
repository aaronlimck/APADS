"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

interface WordCloudProps {
  words: string[];
}

const WordCloudComponent: React.FC<WordCloudProps> = ({ words }) => {
  const wordCloudRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (wordCloudRef.current && words.length > 0) {
      const wordData = words.map(word => ({ text: word, size: Math.random() * 100 + 10 }));

      const layout = cloud()
        .size([500, 500]) // Adjust size as needed
        .words(wordData)
        .padding(5) // Adjust padding as needed
        .rotate(() => ~~(Math.random() * 2) * 90) // Adjust rotation as needed
        .font("Impact")
        .fontSize(d => d.size)
        .on("end", draw);

      layout.start();

      function draw(words) {
        d3.select(wordCloudRef.current)
          .append("g")
          .attr("transform", "translate(250,250)") // Adjust translation as needed
          .selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", d => d.size + "px")
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
          .text(d => d.text);
      }
    }
  }, [words]);

  return <svg ref={wordCloudRef} width="500" height="500" />; // Adjust width and height as needed
};

export default WordCloudComponent;